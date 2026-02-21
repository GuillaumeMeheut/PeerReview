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
    You are an expert senior software engineer and code reviewer.
    Your task is to evaluate a code review submitted by a candidate.

    The candidate was asked to review the following Pull Request:
    Title: ${pr.title}
    Description: ${pr.description}
    Tech Stack: ${pr.tech_stack.join(', ')}
    Difficulty: ${pr.difficulty}

    Here are the files in the PR and the changes. Each line is prefixed with its Line Index, which corresponds to the line index in the candidate's comments:
    ${pr.exercise_files.map(file => `
      File: ${file.path}
      ${file.file_chunks.map(chunk => chunk.lines.map((line, index) => `[Line Index: ${index}] ${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} ${line.content}`).join('\n')).join('\n')}
    `).join('\n\n')}

    Here are the comments the candidate made on the code.:
    ${userComments.length === 0 ? 'No comments were made.' : userComments.map(c => `
      Comment ID: ${c.id}
      File ID: ${c.file_id}
      Line Index: ${c.line_index}
      Comment: "${c.text}"
    `).join('\n')}

    Please evaluate the candidate's review quality.
    
    First, independently identify the critical bugs, vulnerabilities, and anti-patterns present in the code provided above.
    Then, compare your findings against the candidate's comments to see what they caught and what they missed.

    Focus on the following criteria:
    1. Did they identify the critical issues? (If they missed glaring bugs, this should reflect poorly on completeness).
    2. Is their feedback clear, actionable, and accurate?
    3. Are there useless or fluff comments (e.g., just saying "good", "looks nice", or restating what the code does without value)? These should be rated poorly.
    4. Is the tone appropriate and constructive?

    For each comment, provide specific feedback. Explain why the comment is good, bad, or useless, considering the exact code at that Line Index. Evaluate the comment purely based on its textual content rather than any severity or comment type label.
  `;

  const { output } = await generateText({
    model: openai('gpt-4o'),
    output: Output.object({
      schema: z.object({
        summary: z.string(),
        strengths: z.array(z.string()),
        improvements: z.array(z.string()),
        metrics: z.object({
          technical_accuracy: z.number().min(0).max(10).describe("How accurate the technical feedback is"),
          communication_style: z.number().min(0).max(10).describe("Tone, clarity, and empathy"),
          constructiveness: z.number().min(0).max(10).describe("Actionable advice vs just criticism"),
          completeness: z.number().min(0).max(10).describe("Coverage of critical issues and edge cases"),
        }),
        commentFeedback: z.array(z.object({
          commentId: z.string(),
          feedback: z.string().describe("Specific feedback on this comment"),
          rating: z.number().min(1).max(10).describe("Rating for this specific comment"),
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
