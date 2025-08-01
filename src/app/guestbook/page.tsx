
"use client";

import { useState, useTransition, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addGuestbookEntry, getEntries, GuestbookEntry } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <motion.h2
      className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary text-center"
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
      className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.p>
)

export default function GuestbookPage() {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        getEntries().then(result => {
            if (result.entries) {
                setEntries(result.entries);
            }
        });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await addGuestbookEntry({ name, message });
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: result.error,
                    icon: <AlertCircle className="h-5 w-5" />,
                });
            } else if (result.success && result.entry) {
                toast({
                    title: "Success!",
                    description: "Your message has been posted to the guestbook.",
                    icon: <CheckCircle className="h-5 w-5 text-primary" />,
                });
                setEntries(prev => [result.entry!, ...prev]);
                setName('');
                setMessage('');
                formRef.current?.reset();
            }
        });
    };

    return (
        <main className="container mx-auto px-4 md:px-6 py-24 md:py-32">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <SectionTitle>Guestbook</SectionTitle>
                    <SectionDescription>
                        Leave a comment on my portfolio. All submissions are moderated by AI to ensure a professional and respectful environment.
                    </SectionDescription>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <Card className="bg-card/50 border-primary/10 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="text-primary" />
                                <span>Leave a Message</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative">
                                    <Textarea
                                        placeholder="Your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={5}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        AI Moderation Enabled
                                    </p>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? 'Submitting...' : 'Post Message'}
                                        {!isPending && <Send className="ml-2 h-4 w-4" />}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <div className="h-[450px] overflow-y-auto pr-4 space-y-4">
                        <AnimatePresence>
                            {entries.map((entry, index) => (
                                <motion.div
                                    key={entry.timestamp}
                                    layout
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <Card className="bg-muted/30 border-primary/5">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <p className="font-bold text-primary">{entry.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <p className="text-sm mt-2">{entry.message}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {entries.length === 0 && !isPending &&(
                            <div className="text-center text-muted-foreground py-16">
                                <p>No entries yet. Be the first to leave a message!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
