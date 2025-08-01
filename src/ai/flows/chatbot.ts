'use server';

/**
 * @fileOverview A portfolio chatbot that answers questions about Aniruddha Patil.
 *
 * - portfolioChatbot - A function that handles the chatbot conversation.
 * - PortfolioChatbotInput - The input type for the portfolioChatbot function.
 * - PortfolioChatbotOutput - The return type for the portfolioChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioChatbotInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type PortfolioChatbotInput = z.infer<typeof PortfolioChatbotInputSchema>;

const PortfolioChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type PortfolioChatbotOutput = z.infer<typeof PortfolioChatbotOutputSchema>;

export async function portfolioChatbot(input: PortfolioChatbotInput): Promise<PortfolioChatbotOutput> {
  return portfolioChatbotFlow(input);
}

const aboutAniruddha = `
Aniruddha Patil is a Full Stack Developer with expertise in the MERN stack and Machine Learning. He builds beautiful, responsive, and scalable web applications.

Education:
- Vellore Institute of Technology (VIT Chennai): Bachelor of Technology in Computer Science (2021 – 2025)
- Maharashtra State Board, Nashik: Senior Secondary (HSC) (2019 – 2021)
- Maharashtra State Board, Nashik: Secondary (SSC) (Completed 2019)

Skills:
- JavaScript (ES6+)
- React & Next.js
- Node.js & Express
- Python (for ML, data analysis)
- MongoDB (database design, aggregation)
- C++ (OOP, algorithms)
- SQL
- Machine Learning (LightGBM, KNN, Scikit-learn, Pandas, NumPy)

Projects:
- CarePlus - Healthcare Management System: A comprehensive healthcare platform for patient management and scheduling. Built with React.js and Appwrite.
- GourmetGenie - AI-Powered Food Recommendation System: An AI-driven food suggestion engine using LightGBM and KNN. Built with Python, Streamlit, and Django.
- ImaginAI - Text-to-Image Generator: An open-source text-to-image generator using Stability AI. Built with React.js.
- Wildlife Conservation Platform: An educational platform to raise awareness about wildlife conservation.
`;

const prompt = ai.definePrompt({
  name: 'portfolioChatbotPrompt',
  input: {schema: PortfolioChatbotInputSchema},
  output: {schema: PortfolioChatbotOutputSchema},
  prompt: `You are a friendly and professional chatbot assistant for Aniruddha Patil's personal portfolio.
Your goal is to answer questions about Aniruddha based *only* on the context provided below.
Do not make up information or answer questions on other topics. If a question is outside the scope of the provided information, politely decline to answer.

Context about Aniruddha Patil:
---
${aboutAniruddha}
---

User's question:
{{{message}}}
`,
});

const portfolioChatbotFlow = ai.defineFlow(
  {
    name: 'portfolioChatbotFlow',
    inputSchema: PortfolioChatbotInputSchema,
    outputSchema: PortfolioChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
