"use server"

import { explainCodeSnippet, ExplainCodeSnippetInput } from "@/ai/flows/explain-code-snippet"
import { generateStory, GenerateStoryInput } from "@/ai/flows/story-generator"
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

const generateStoryInputSchema = z.object({
    prompt: z.string().min(3, "Prompt must be at least 3 characters long."),
})

export async function handleGenerateStory(input: GenerateStoryInput) {
    const validation = generateStoryInputSchema.safeParse(input)
    if (!validation.success) {
        return { error: "Invalid input." }
    }

    try {
        const { story } = await generateStory(validation.data)
        return { story }
    } catch (error) {
        console.error(error)
        return { error: "An unexpected error occurred while generating the story." }
    }
}
