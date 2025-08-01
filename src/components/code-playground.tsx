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

const defaultCode = `<!-- Hover over me! -->
<style>
  body {
    display: grid;
    place-content: center;
    height: 100%;
    margin: 0;
    background: #1a1a1a;
    font-family: 'Poppins', sans-serif;
  }
  .glowing-btn {
    position: relative;
    color: #7DF9FF;
    cursor: pointer;
    padding: 0.75em 1.5em;
    border: 0.1em solid #7DF9FF;
    border-radius: 0.45em;
    background: none;
    perspective: 2em;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: 0.5em;
    box-shadow: inset 0px 0px 0.5em 0px #7DF9FF,
      0px 0px 0.5em 0px #7DF9FF;
    animation: border-flicker 2s linear infinite;
  }
  .glowing-txt {
    float: left;
    margin-right: -0.8em;
    text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3),
      0 0 0.45em #7DF9FF;
    animation: text-flicker 3s linear infinite;
  }
  .faulty-letter {
    opacity: 0.5;
    animation: faulty-flicker 2s linear infinite;
  }
  .glowing-btn::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.7;
    filter: blur(1em);
    transform: translateY(120%) rotateX(95deg) scale(1, 0.35);
    background: #7DF9FF;
    pointer-events: none;
  }
  .glowing-btn::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    z-index: -1;
    background-color: #7DF9FF;
    box-shadow: 0 0 2em 0.2em #7DF9FF;
    transition: opacity 100ms linear;
  }
  .glowing-btn:hover {
    color: rgba(0, 0, 0, 0.8);
    text-shadow: none;
    animation: none;
  }
  .glowing-btn:hover .glowing-txt {
    animation: none;
  }
  .glowing-btn:hover .faulty-letter {
    animation: none;
    text-shadow: none;
    opacity: 1;
  }
  .glowing-btn:hover:before {
    filter: blur(1.5em);
    opacity: 1;
  }
  .glowing-btn:hover:after {
    opacity: 1;
  }
  @keyframes faulty-flicker {
    0% { opacity: 0.1; } 2% { opacity: 0.1; } 4% { opacity: 0.5; } 19% { opacity: 0.5; } 21% { opacity: 0.1; } 23% { opacity: 1; } 80% { opacity: 0.5; } 83% { opacity: 0.4; } 87% { opacity: 1; }
  }
  @keyframes text-flicker {
    0% { opacity: 0.1; } 2% { opacity: 1; } 8% { opacity: 0.1; } 9% { opacity: 1; } 12% { opacity: 0.1; } 20% { opacity: 1; } 25% { opacity: 0.3; } 30% { opacity: 1; } 70% { opacity: 0.7; } 72% { opacity: 0.2; } 77% { opacity: 0.9; } 100% { opacity: 0.9; }
  }
  @keyframes border-flicker {
    0% { opacity: 0.1; } 2% { opacity: 1; } 4% { opacity: 0.1; } 8% { opacity: 1; } 70% { opacity: 0.7; } 100% { opacity: 1; }
  }
</style>

<button class="glowing-btn">
  <span class="glowing-txt">C<span class="faulty-letter">L</span>ICK</span>
</button>

<script>
  const btn = document.querySelector('.glowing-btn');
  btn.addEventListener('click', () => {
    const text = document.querySelector('.glowing-txt');
    text.innerHTML = 'SUCCESS!';
  });
</script>
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
