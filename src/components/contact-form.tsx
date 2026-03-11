"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSuccess(true);
                toast({
                    title: "Message Sent!",
                    description: "Thank you for reaching out. I'll get back to you soon.",
                });
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setIsSuccess(false), 3000);
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card-ultra-border relative group">
            {/* Outer glow */}
            <div className="absolute -inset-2 rounded-[28px] blur-2xl opacity-30 bg-gradient-to-br from-violet-500/20 to-pink-500/15 pointer-events-none" />

            <Card className="card-ultra border-0 relative p-6 md:p-8">
                {/* Aurora background */}
                <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none rounded-3xl">
                    <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full blur-[70px] bg-violet-500 animate-blob" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full blur-[50px] bg-pink-500 animate-blob animation-delay-2000" />
                </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            className="bg-white/[0.03] border-white/[0.08] focus:border-violet-500/50 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="bg-white/[0.03] border-white/[0.08] focus:border-violet-500/50 rounded-xl"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        required
                        className="bg-white/[0.03] border-white/[0.08] focus:border-violet-500/50 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message..."
                        rows={5}
                        required
                        className="bg-white/[0.03] border-white/[0.08] focus:border-violet-500/50 resize-none rounded-xl"
                    />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full group bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-xl py-3 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : isSuccess ? (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Sent!
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                Send Message
                            </>
                        )}
                    </Button>
                </motion.div>
            </form>
            </Card>
        </div>
    );
}
