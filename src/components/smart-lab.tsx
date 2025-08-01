"use client"

import { useState, useTransition } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleSummarizeText } from "@/app/actions"
import { BrainCircuit, Loader, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <motion.h2 
      className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
)

const SectionDescription = ({ children }: { children: React.ReactNode }) => (
    <motion.p 
      className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.p>
)

export function SmartLab() {
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const onSummarize = () => {
    startTransition(async () => {
      setSummary("")
      const result = await handleSummarizeText({ text })
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error summarizing text",
          description: result.error,
        })
      } else {
        setSummary(result.summary || "")
      }
    })
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>Smart Lab</SectionTitle>
          <SectionDescription>
            A collection of AI-powered tools. Starting with a Text Summarizer.
          </SectionDescription>
        </div>
      </div>
      <Card className="mt-12 max-w-3xl mx-auto bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary"/>
            AI Text Summarizer
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here to summarize..."
            className="h-48 resize-none font-code"
          />
          <Button onClick={onSummarize} disabled={isPending || !text}>
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Summarize
              </>
            )}
          </Button>

          {(isPending || summary) && (
            <div className="mt-4">
              {isPending && !summary ? (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]"></div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              ) : (
                <Alert>
                  <Wand2 className="h-4 w-4" />
                  <AlertTitle>Summary</AlertTitle>
                  <AlertDescription className="prose prose-sm dark:prose-invert">
                    {summary}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
