'use server';

/**
 * @fileOverview An AI-powered flow to moderate text for appropriateness.
 *
 * - moderateText - A function that checks if a given text is appropriate.
 * - ModerateTextInput - The input type for the moderateText function.
 * - ModerateTextOutput - The return type for the moderateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ModerateTextInputSchema = z.object({
  text: z.string().describe('The text content to moderate.'),
});
export type ModerateTextInput = z.infer<typeof ModerateTextInputSchema>;

export const ModerateTextOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe(
      'Whether the text is appropriate and suitable for a public forum.'
    ),
  reason: z
    .string()
    .optional()
    .describe(
      'The reason why the text was flagged as inappropriate. This is only provided if isAppropriate is false.'
    ),
});
export type ModerateTextOutput = z.infer<typeof ModerateTextOutputSchema>;

export async function moderateText(
  input: ModerateTextInput
): Promise<ModerateTextOutput> {
  return moderateTextFlow(input);
}

const moderationPrompt = ai.definePrompt({
  name: 'moderationPrompt',
  input: {schema: ModerateTextInputSchema},
  output: {schema: ModerateTextOutputSchema},
  prompt: `You are a content moderator for a professional portfolio guestbook. Your task is to determine if the user's message is appropriate.

The message should be flagged as inappropriate if it contains any of the following:
- Hate speech, racism, or discrimination
- Harassment or personal attacks
- Profanity or sexually explicit language
- Spam, advertisements, or promotions
- Any other content that would be unprofessional in a public forum.

Analyze the following text:
"{{{text}}}"

If the text is inappropriate, set "isAppropriate" to false and provide a brief, professional reason. If it is appropriate, set "isAppropriate" to true.`,
});

const moderateTextFlow = ai.defineFlow(
  {
    name: 'moderateTextFlow',
    inputSchema: ModerateTextInputSchema,
    outputSchema: ModerateTextOutputSchema,
  },
  async (input: ModerateTextInput) => {
    const {output} = await moderationPrompt(input);
    return output!;
  }
);
