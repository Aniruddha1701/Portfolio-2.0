"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { handleGetItNews } from "@/app/actions"
import { Newspaper, BotMessageSquare, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Skeleton } from "./ui/skeleton"

export interface NewsArticle {
  headline: string;
  summary: string;
  url?: string;
}

export function ItNews() {
  const [news, setNews] = useState<NewsArticle[] | null>(null)
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
                  <a href={story.url} target="_blank" rel="noopener noreferrer" className="card-ultra-border relative block">
                    {/* Outer glow */}
                    <div className="absolute -inset-2 rounded-[28px] blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 bg-gradient-to-br from-violet-500/30 to-cyan-500/20 pointer-events-none" />

                    <Card className="card-ultra border-0 relative overflow-hidden h-full">
                      {/* Aurora background */}
                      <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
                        <motion.div
                          className="absolute -top-12 -left-12 w-32 h-32 rounded-full blur-[60px] bg-violet-500"
                          animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-primary">
                        <motion.div
                          className="p-2.5 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 rounded-xl border border-white/[0.06]"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Newspaper className="h-5 w-5" />
                        </motion.div>
                        <span className="line-clamp-2 hover:text-cyan-400 transition-colors">{story.headline}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <Alert className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm rounded-xl group-hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <BotMessageSquare className="h-4 w-4 text-emerald-400" />
                          <span className="text-primary/90 font-medium text-sm border-b border-emerald-500/30 pb-0.5">Article Snippet</span>
                        </div>
                        <AlertDescription className="prose prose-sm dark:prose-invert text-muted-foreground line-clamp-3">
                          {story.summary}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
