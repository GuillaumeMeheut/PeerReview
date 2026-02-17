
import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { getPullRequest } from '@/lib/mock-data';
import { InlineComment } from '@/lib/types';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { comments, prId }: { comments: [string, InlineComment][], prId: string } = await req.json();

  const pr = getPullRequest(prId);

  if (!pr) {
    return new Response('Pull request not found', { status: 404 });
  }

  // Convert comments array back to a map for easier lookup if needed, 
  // but for the prompt we just need the list.
  const userComments = comments.map(([_, comment]) => comment);

  const prompt = `
    You are an expert senior software engineer and code reviewer.
    Your task is to evaluate a code review submitted by a candidate.

    The candidate was asked to review the following Pull Request:
    Title: ${pr.title}
    Description: ${pr.description}
    Tech Stack: ${pr.techStack.join(', ')}
    Difficulty: ${pr.difficulty}

    Here are the files in the PR and the changes:
    ${pr.files.map(file => `
      File: ${file.path}
      ${file.chunks.map(chunk => chunk.lines.map(line => `${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '} ${line.content}`).join('\n')).join('\n')}
    `).join('\n\n')}

    Here are the comments the candidate made on the code:
    ${userComments.length === 0 ? 'No comments were made.' : userComments.map(c => `
      Comment ID: ${c.id}
      File Index: ${c.fileIndex}
      Line Index: ${c.lineIndex}
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

  const { object } = await generateObject({
    model: openai('gpt-4o'),
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
    prompt,
  });

  return Response.json(object);
}
