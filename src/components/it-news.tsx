"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleGetItNews } from "@/app/actions"
import { Newspaper, BotMessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import type { ItNewsOutput } from "@/ai/flows/it-news-flow"
import { Skeleton } from "./ui/skeleton"

export function ItNews() {
  const [news, setNews] = useState<ItNewsOutput['news'] | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    startTransition(async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    })
  }, [toast])

  if (isLoading) {
    return (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {[...Array(3)].map((_, index) => (
                <Card key={index}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {isPending && !news && (
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
