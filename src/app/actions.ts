"use server"

import { explainCodeSnippet, ExplainCodeSnippetInput } from "@/ai/flows/explain-code-snippet"
import { getItNews } from "@/ai/flows/it-news-flow";
import { z } from "zod"

const explainCodeInputSchema = z.object({
  code: z.string(),
})

export async function handleExplainCode(input: ExplainCodeSnippetInput) {
  const validation = explainCodeInputSchema.safeParse(input)
  if (!validation.success) {
    return { error: "Invalid input." }
  }

  try {
    const { explanation } = await explainCodeSnippet(validation.data)
    return { explanation }
  } catch (error) {
    console.error(error)
    return { error: "An unexpected error occurred." }
  }
}

export async function handleGetItNews() {
    try {
        const news = await getItNews();
        return news;
    } catch (error) {
        console.error(error);
        return { error: "An unexpected error occurred while fetching the news." };
    }
}
