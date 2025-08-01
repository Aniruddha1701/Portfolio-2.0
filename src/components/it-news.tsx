"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleGetItNews } from "@/app/actions"
import { Sparkles, Newspaper, BotMessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import type { ItNewsOutput } from "@/ai/flows/it-news-flow"

export function ItNews() {
  const [news, setNews] = useState<ItNewsOutput['news'] | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const onGetNews = () => {
    startTransition(async () => {
      setNews(null)
      const result = await handleGetItNews()
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error fetching news",
          description: result.error,
        })
      } else {
        setNews(result.news || [])
      }
    })
  }

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="flex justify-center">
          <Button onClick={onGetNews} disabled={isPending}>
            {isPending ? "Fetching..." : "Fetch Latest News"}
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
          {isPending && (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]"></div>
              <span className="text-sm text-muted-foreground">AI is scanning the latest headlines...</span>
            </div>
          )}

          {news && (
             <motion.div 
                className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.2 }}
             >
               {news.map((story, index) => (
                 <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                 >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Newspaper />
                                {story.headline}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <BotMessageSquare className="h-4 w-4" />
                                <AlertTitle>AI Summary</AlertTitle>
                                <AlertDescription className="prose prose-sm dark:prose-invert">
                                    {story.summary}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                 </motion.div>
               ))}
             </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
