"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleGenerateStory } from "@/app/actions"
import { Sparkles, BookText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export function StoryGenerator() {
  const [prompt, setPrompt] = useState("")
  const [story, setStory] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const onGenerate = () => {
    startTransition(async () => {
      setStory("")
      const result = await handleGenerateStory({ prompt })
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error generating story",
          description: result.error,
        })
      } else {
        setStory(result.story || "")
      }
    })
  }

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row">
            <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a simple prompt, e.g., 'a cat who learned to code'"
                className="flex-grow text-base"
            />
            <Button onClick={onGenerate} disabled={isPending || !prompt}>
                {isPending ? "Generating..." : "Generate Story"}
                <Sparkles className="ml-2 h-4 w-4" />
            </Button>
        </div>
        <div className="flex flex-col gap-4">
            {(story || isPending) && (
                <Card className="min-h-96">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <BookText />
                            Generated Story
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isPending && !story && (
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                                <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]"></div>
                                <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]"></div>
                                <span className="text-sm text-muted-foreground">The AI is weaving a tale...</span>
                            </div>
                        )}
                        {story && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Alert>
                                    <AlertDescription className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                                        {story}
                                    </AlertDescription>
                                </Alert>
                           </motion.div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  )
}
