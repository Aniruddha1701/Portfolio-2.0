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

const defaultCode = `<!-- Try editing me! -->
<style>
  body {
    display: grid;
    place-content: center;
    height: 100%;
    margin: 0;
    background: #222;
    color: #fff;
    font-family: sans-serif;
  }
  h1 {
    font-size: 3rem;
    color: #7DF9FF;
    text-shadow: 0 0 15px #7DF9FF;
  }
</style>
<h1>Hello, Vizfolio!</h1>
<script>
  const h1 = document.querySelector('h1');
  h1.addEventListener('click', () => {
    h1.textContent = 'You clicked me!';
  });
</script>
`
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
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <SectionTitle>Code Playground</SectionTitle>
          <SectionDescription>
            Test small code snippets or get an AI-powered explanation of what they do.
          </SectionDescription>
        </div>
      </div>
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
