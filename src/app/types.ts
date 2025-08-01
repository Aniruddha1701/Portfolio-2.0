import { z } from 'zod';

export interface GuestbookEntry {
  name: string;
  message: string;
  timestamp: string;
}

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
