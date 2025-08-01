"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { handleChatbot } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

type Message = {
  role: "user" | "bot"
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input;
    setInput("")

    startTransition(async () => {
      const result = await handleChatbot({ message: currentInput })
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        const botMessage: Message = { role: "bot", content: "Sorry, I encountered an error. Please try again." }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const botMessage: Message = { role: "bot", content: result.response || "" }
        setMessages((prev) => [...prev, botMessage])
      }
    })
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 z-[100] w-full max-w-sm"
          >
            <Card className="flex h-[60vh] flex-col rounded-2xl border-primary/20 shadow-2xl shadow-primary/10">
              <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarFallback className="bg-primary/10">
                        <Bot className="h-6 w-6 text-primary" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">Aniruddha's Assistant</CardTitle>
                        <p className="text-xs text-muted-foreground">Ask me anything about Aniruddha</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-start gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "bot" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10">
                              <Bot className="h-5 w-5 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                            message.role === "user"
                              ? "rounded-br-none bg-primary text-primary-foreground"
                              : "rounded-bl-none bg-muted"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                    {isPending && (
                        <div className="flex items-center space-x-2 justify-start">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10">
                                <Bot className="h-5 w-5 text-primary" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center space-x-1">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                                <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]"></div>
                                <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="border-t border-primary/10 p-4">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about my projects..."
                    className="flex-grow"
                    disabled={isPending}
                  />
                  <Button type="submit" size="icon" disabled={isPending}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 z-[100] h-16 w-16 rounded-full shadow-2xl shadow-primary/30"
          size="icon"
        >
            <AnimatePresence>
            {isOpen ? (
                <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 180, scale: 0 }} key="x">
                    <X className="h-8 w-8" />
                </motion.div>
            ) : (
                <motion.div initial={{ rotate: 180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -180, scale: 0 }} key="bot">
                    <Bot className="h-8 w-8" />
                </motion.div>
            )}
            </AnimatePresence>
        </Button>
      </motion.div>
    </>
  )
}
