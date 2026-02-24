import { generateText, Output } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { getExercise, getReviewComments } from '@/lib/supabase/queries';
import { createServerSupabaseClientWithServiceRole } from '@/lib/supabase/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prId, reviewId }: { prId: string, reviewId: string } = await req.json();

  const [pr, userComments] = await Promise.all([
    getExercise(prId),
    getReviewComments(reviewId)
  ]);


  if (!pr) {
    return new Response('Pull request not found', { status: 404 });
  }

  if (!userComments || userComments.length === 0) {
    return new Response('No comments found', { status: 404 });
  }

  const prompt = `
    You are an expert Principal Software Engineer evaluating a candidate's code review skills.
    Your task is to grade the code review submitted by the candidate on the following Pull Request.

    --- PULL REQUEST DETAILS ---
    Title: ${pr.title}
    Description: ${pr.description}
    Tech Stack: ${pr.tech_stack.join(', ')}
    Difficulty: ${pr.difficulty}
    ${pr.commonly_missed && pr.commonly_missed.length > 0 ? `
    EXPECTED ISSUES (The candidate should have caught these):
    ${Array.isArray(pr.commonly_missed) ? pr.commonly_missed.map((m: string) => '- ' + m).join('\\n    ') : pr.commonly_missed}
    ` : ''}

    --- THE CODE CHANGES (DIFF) ---
    CRITICAL INSTRUCTIONS FOR READING THE DIFF:
    - Lines starting with "+" means the line was ADDED in this PR.
    - Lines starting with "-" means the line was REMOVED/DELETED in this PR. It is no longer in the code!
    - Lines starting with " " (space) are unchanged context lines.

    IMPORTANT: Do not evaluate removed ("-") lines as if they are currently in the code. Maintain strict awareness of what is being added versus what is being removed.

    Each line is prefixed with a Line Index. The candidate's comments are attached to these specific indices.
    ${pr.exercise_files.map(file => `
      File: ${file.path}
      ${file.file_chunks.map(chunk => chunk.lines.map((line, index) => `[Line Index: ${index}] ${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} ${line.content}`).join('\n')).join('\n')}
    `).join('\n\n')}

    --- THE CANDIDATE'S REVIEW COMMENTS ---
    ${userComments.length === 0 ? 'No comments were made.' : userComments.map(c => `
      Comment ID: ${c.id}
      File ID: ${c.file_id}
      Line Index: ${c.line_index}
      Comment Text: "${c.text}"
    `).join('\n')}

    --- EVALUATION INSTRUCTIONS ---

    1. INDEPENDENT ANALYSIS
       First, understand the PR. Look at the Expected Issues if provided. Identify the key bugs, anti-patterns, or missing best practices.

    2. OVERALL GRADING
       - Completeness: Did they catch the critical issues? Did they miss glaring bugs?
       - Technical Accuracy: Are their suggestions technically sound? 
       - Constructiveness / Tone: Is the feedback actionable and polite?
       - Signal-to-Noise: Did they avoid useless fluff comments (e.g., just saying "looks good" without value)?

    3. INDIVIDUAL COMMENT FEEDBACK
       For each comment made by the candidate, provide specific, concise feedback to the candidate. 
       - If the candidate made a great catch, clearly praise them.
       - If the comment is valid but could be phrased better, suggest an improvement.
       - If the comment is incorrect or misunderstands the code, correct them.
       - If the comment is a nitpick without substance, point that out.
       - If the candidate identified a valid point, simply acknowledge it is correct! Do NOT complain that a valid comment "lacks depth or context" just for the sake of finding a flaw. Do not demand extreme depth for straightforward issues.
       
    Keep your explanations concise and focus only on the substantial value of the candidate's review.
  `;

  const { output } = await generateText({
    model: openai('gpt-4o'),
    output: Output.object({
      schema: z.object({
        summary: z.string().describe("Overall summary of the candidate's code review performance."),
        strengths: z.array(z.string()).describe("Key strengths of the candidate's review."),
        improvements: z.array(z.string()).describe("Areas where the candidate can improve their code review skills."),
        metrics: z.object({
          technical_accuracy: z.number().min(0).max(10).describe("How accurate the technical feedback is"),
          communication_style: z.number().min(0).max(10).describe("Tone, clarity, and empathy"),
          constructiveness: z.number().min(0).max(10).describe("Actionable advice vs just criticism"),
          completeness: z.number().min(0).max(10).describe("Coverage of critical issues and edge cases"),
        }),
        commentFeedback: z.array(z.object({
          commentId: z.string(),
          feedback: z.string().describe("Direct feedback to the candidate about their comment. E.g., 'Great catch on the security issue!' or 'Incorrect, this approach is valid because...' Avoid artificial criticism for valid points."),
          rating: z.number().min(1).max(10).describe("1-4 = incorrect/unhelpful, 5-7 = okay/nitpick, 8-10 = excellent/crucial catch"),
          category: z.enum(["helpful", "nitpick", "incorrect", "neutral"]).describe("Category of the comment"),
        })).describe("Feedback for each individual comment"),
        overallScore: z.number().min(0).max(10),
      }),
    }),
    prompt,
  });

  const response = {
    ...output,
    commentFeedback: output.commentFeedback.map(fb => ({
      ...fb,
      originalComment: userComments.find(c => c.id === fb.commentId)
    }))
  };

  console.log(response);


  const supabase = createServerSupabaseClientWithServiceRole();
  const { error: insertError } = await supabase
    .from('ai_feedback_results')
    .upsert({
      review_id: reviewId,
      summary: response.summary,
      strengths: response.strengths,
      improvements: response.improvements,
      technical_accuracy: response.metrics.technical_accuracy,
      communication_style: response.metrics.communication_style,
      constructiveness: response.metrics.constructiveness,
      completeness: response.metrics.completeness,
      comment_feedback: response.commentFeedback as any,
      overall_score: response.overallScore,
    }, { onConflict: 'review_id' });

  if (insertError) {
    console.error('Failed to save AI feedback:', insertError);
  }

  return Response.json(response);
}
