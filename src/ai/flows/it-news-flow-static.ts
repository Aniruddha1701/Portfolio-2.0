'use server';

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

// Static news data as fallback
const staticNewsData: ItNewsOutput = {
  news: [
    {
      headline: "AI Continues to Transform Software Development",
      summary: "Recent advancements in AI-powered coding assistants are revolutionizing how developers write and debug code. Tools like GitHub Copilot and ChatGPT are becoming integral parts of the modern development workflow, significantly boosting productivity and code quality."
    },
    {
      headline: "Cloud Computing Market Reaches New Heights",
      summary: "The global cloud computing market continues its rapid expansion, with major providers AWS, Azure, and Google Cloud reporting record growth. Enterprises are increasingly adopting multi-cloud strategies to optimize costs and improve resilience."
    },
    {
      headline: "JavaScript Frameworks Evolution in 2025",
      summary: "The JavaScript ecosystem continues to evolve with Next.js 15, React 19, and new frameworks emerging. Server components and edge computing are becoming standard features, while performance optimization remains a key focus for developers worldwide."
    }
  ]
};

export async function getStaticItNews(): Promise<ItNewsOutput> {
  // Return static news data
  return Promise.resolve(staticNewsData);
}
