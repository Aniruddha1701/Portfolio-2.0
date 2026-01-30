"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleGetItNews } from "@/app/actions"
import { Newspaper, BotMessageSquare, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import type { ItNewsOutput } from "@/ai/flows/it-news-flow"
import { Skeleton } from "./ui/skeleton"

export function ItNews() {
  const [news, setNews] = useState<ItNewsOutput['news'] | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  useEffect(() => {
    startTransition(async () => {
      const result = await handleGetItNews()
      if ('error' in result) {
        toast({
          variant: "destructive",
          title: "Error fetching news",
          description: result.error,
        })
      } else {
        setNews(result.news || [])
      }
    })
  }, [toast])

  if (isPending || !news) {
    return (
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-primary/10">
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-primary/10" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full bg-muted/50" />
                <Skeleton className="h-4 w-full mt-2 bg-muted/50" />
                <Skeleton className="h-4 w-2/3 mt-2 bg-muted/50" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {news && (
            <motion.div
              className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {news.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <Card className="relative overflow-hidden bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10">
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <motion.div
                          className="p-2 bg-primary/10 rounded-lg"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Newspaper className="h-5 w-5" />
                        </motion.div>
                        <span className="line-clamp-2">{story.headline}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <Alert className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <BotMessageSquare className="h-4 w-4 text-primary" />
                          {/* Sparkle effect for AI */}
                          <motion.div
                            animate={{
                              opacity: [0.5, 1, 0.5],
                              scale: [0.9, 1.1, 0.9],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="h-3 w-3 text-accent" />
                          </motion.div>
                        </div>
                        <AlertTitle className="text-primary/90 flex items-center gap-2">
                          AI Summary
                        </AlertTitle>
                        <AlertDescription className="prose prose-sm dark:prose-invert text-muted-foreground">
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
