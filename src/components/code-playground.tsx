"use client"

import { useState, useTransition } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleExplainCode } from "@/app/actions"
import { Sparkles, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

const defaultCode = `<!-- Hover over the card! -->
<style>
  body {
    display: grid;
    place-content: center;
    height: 100%;
    margin: 0;
    background: #1a1a1a;
    font-family: 'Poppins', sans-serif;
  }
  .card-container {
    perspective: 1000px;
    width: 320px;
    height: 220px;
  }
  .card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
    cursor: pointer;
  }
  .card-container:hover .card {
    transform: rotateY(180deg);
  }
  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    padding: 1rem;
    border: 2px solid;
  }
  .front {
    background-color: hsl(var(--card));
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
    font-weight: bold;
  }
  .back {
    background-color: hsl(var(--accent));
    border-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
    transform: rotateY(180deg);
  }
  .back h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .back p {
    font-size: 0.9rem;
    text-align: center;
  }
</style>

<div class="card-container">
  <div class="card">
    <div class="card-face front">
      Hover Over Me!
    </div>
    <div class="card-face back">
      <h3>CSS 3D Transform</h3>
      <p>This card flips using CSS transforms and transitions. It's a great way to create engaging interactive elements.</p>
    </div>
  </div>
</div>

`

export function CodePlayground() {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState(defaultCode)
  const [explanation, setExplanation] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const runCode = () => {
    setOutput(code)
  }

  const onExplain = () => {
    startTransition(async () => {
      setExplanation("")
      const result = await handleExplainCode({ code })
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error explaining code",
          description: result.error,
        })
      } else {
        setExplanation(result.explanation || "")
      }
    })
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your HTML, CSS, and JavaScript here."
            className="h-96 flex-grow resize-none font-code"
          />
          <div className="flex gap-2">
            <Button onClick={runCode}>Run Code</Button>
            <Button variant="outline" onClick={onExplain} disabled={isPending}>
              {isPending ? "Thinking..." : "Explain with AI"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Card className="h-96">
            <iframe
              srcDoc={output}
              title="Code Output"
              sandbox="allow-scripts"
              className="h-full w-full rounded-lg border"
              loading="lazy"
            />
          </Card>
          {explanation && (
             <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>AI Code Explanation</AlertTitle>
              <AlertDescription className="prose prose-sm dark:prose-invert">
                {explanation}
              </AlertDescription>
            </Alert>
          )}
          {isPending && !explanation && (
             <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]"></div>
              <span className="text-sm text-muted-foreground">Generating explanation...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
