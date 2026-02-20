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

    Here are the files in the PR and the changes:
    ${pr.exercise_files.map(file => `
      File: ${file.path}
      ${file.file_chunks.map(chunk => chunk.lines.map(line => `${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} ${line.content}`).join('\n')).join('\n')}
    `).join('\n\n')}

    Here are the comments the candidate made on the code:
    ${userComments.length === 0 ? 'No comments were made.' : userComments.map(c => `
      Comment ID: ${c.id}
      File ID: ${c.file_id}
      Line Index: ${c.line_index}
      Severity: ${c.severity}
      Comment: "${c.text}"
    `).join('\n')}

    Please provide a constructive and detailed feedback on the candidate's review.
    Focus on:
    1. Did they identify the critical issues?
    2. Is their feedback clear and actionable?
    3. Did they miss any important patterns or bugs?
    4. Is the tone appropriate?

    For each comment, provide specific feedback on whether it was useful, accurate, and if the tone was appropriate.

    Structure your response in Markdown formats:
    ## Summary
    A brief summary of the review quality.

    ## Strengths
    Bullet points of what they did well.

    ## Areas for Improvement
    Bullet points of what they missed or could improve.

    ## Overall Rating
    Give a rating out of 10.
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
