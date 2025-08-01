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

const defaultCode = `<!-- Click the hamburger menu! -->
<style>
  body {
    display: grid;
    place-content: center;
    height: 100%;
    margin: 0;
    background: #1a1a1a;
    font-family: 'Poppins', sans-serif;
  }
  
  .menu {
    filter: url(#gooey);
  }

  .menu-item, .menu-open-button {
    background: hsl(var(--primary));
    border-radius: 100%;
    width: 80px;
    height: 80px;
    position: absolute;
    top: 20px;
    left: 20px;
    transform: translate3d(0, 0, 0);
    transition: transform ease-out 200ms;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-open {
    display: none;
  }

  .hamburger {
    width: 25px;
    height: 3px;
    background: hsl(var(--primary-foreground));
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -12.5px;
    margin-top: -1.5px;
    transition: transform 200ms;
  }

  .hamburger-1 {
    transform: translate3d(0, -8px, 0);
  }

  .hamburger-2 {
    transform: translate3d(0, 0, 0);
  }

  .hamburger-3 {
    transform: translate3d(0, 8px, 0);
  }

  .menu-open:checked + .menu-open-button .hamburger-1 {
    transform: translate3d(0, 0, 0) rotate(45deg);
  }
  .menu-open:checked + .menu-open-button .hamburger-2 {
    transform: translate3d(0, 0, 0) scale(0.1, 1);
  }
  .menu-open:checked + .menu-open-button .hamburger-3 {
    transform: translate3d(0, 0, 0) rotate(-45deg);
  }

  .menu-item {
    transition: all 0.1s ease 0s;
  }

  .menu-item:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  .menu-item svg {
     width: 24px;
     height: 24px;
     color: hsl(var(--primary-foreground));
  }
  .menu-item:hover svg {
     color: hsl(var(--accent-foreground));
  }

  .menu-open:checked ~ .menu-item:nth-child(3) {
    transition-duration: 180ms;
    transform: translate3d(0.08361px, -104.99997px, 0);
  }
  .menu-open:checked ~ .menu-item:nth-child(4) {
    transition-duration: 280ms;
    transform: translate3d(90.9466px, -52.47586px, 0);
  }
  .menu-open:checked ~ .menu-item:nth-child(5) {
    transition-duration: 380ms;
    transform: translate3d(90.9466px, 52.47586px, 0);
  }
  .menu-open:checked ~ .menu-item:nth-child(6) {
    transition-duration: 480ms;
    transform: translate3d(0.08361px, 104.99997px, 0);
  }

</style>

<nav class="menu" style="position: absolute; top: 50%; left: 50%; margin-left: -70px; margin-top: -70px;">
  <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open"/>
  <label class="menu-open-button" for="menu-open">
    <span class="hamburger hamburger-1"></span>
    <span class="hamburger hamburger-2"></span>
    <span class="hamburger hamburger-3"></span>
  </label>
  
  <a href="#" class="menu-item">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
  </a>
  <a href="#" class="menu-item">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  </a>
  <a href="#" class="menu-item">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  </a>
  <a href="#" class="menu-item">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H15a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /><circle cx="12" cy="12" r="3" /></svg>
  </a>
</nav>

<!-- filters -->
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: none;">
  <defs>
    <filter id="gooey">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
      <feBlend in="SourceGraphic" in2="goo" />
    </filter>
  </defs>
</svg>
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
