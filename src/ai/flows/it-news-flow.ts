'use server';

/**
 * @fileOverview An AI-powered flow to get the latest IT news.
 *
 * - getItNews - A function that returns a summary of the latest IT news.
 * - ItNewsOutput - The return type for the getItNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItNewsOutputSchema = z.object({
  news: z.array(
    z.object({
      headline: z.string().describe('The headline of the news story.'),
      summary: z.string().describe('A short summary of the news story.'),
    })
  ).describe('An array of the top 3 latest IT news stories.'),
});
export type ItNewsOutput = z.infer<typeof ItNewsOutputSchema>;

export async function getItNews(): Promise<ItNewsOutput> {
  return itNewsFlow();
}

const prompt = ai.definePrompt({
  name: 'itNewsPrompt',
  input: { schema: z.object({}) },
  output: {schema: ItNewsOutputSchema},
  prompt: `You are a senior tech news analyst. Your task is to provide a concise summary of the three most significant and recent news stories in the information technology sector.

Please provide a headline and a brief, one-paragraph summary for each of the three stories. Focus on news related to software development, AI, cloud computing, or major tech company announcements.`,
});

const itNewsFlow = ai.defineFlow(
  {
    name: 'itNewsFlow',
    outputSchema: ItNewsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
