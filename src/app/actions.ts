"use server"

import { explainCodeSnippet, ExplainCodeSnippetInput } from "@/ai/flows/explain-code-snippet"
import { summarizeText, SummarizeTextInput } from "@/ai/flows/summarize-text-flow"
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

const summarizeTextInputSchema = z.object({
  text: z.string(),
})

export async function handleSummarizeText(input: SummarizeTextInput) {
  const validation = summarizeTextInputSchema.safeParse(input)
  if (!validation.success) {
    return { error: "Invalid input." }
  }

  try {
    const { summary } = await summarizeText(validation.data)
    return { summary }
  } catch (error) {
    console.error(error)
    return { error: "An unexpected error occurred." }
  }
}
