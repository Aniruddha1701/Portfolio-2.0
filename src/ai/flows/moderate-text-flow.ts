'use server';

/**
 * @fileOverview An AI-powered flow to moderate text for appropriateness.
 *
 * - moderateText - A function that checks if a given text is appropriate.
 */

import {ai} from '@/ai/genkit';
import {
  ModerateTextInput,
  ModerateTextInputSchema,
  ModerateTextOutput,
  ModerateTextOutputSchema,
} from '@/app/types';

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
