import { CodePlayground } from './code-playground';
import { ItNews } from './it-news';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

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


export function SmartLab() {
  return (
    <div className="container mx-auto px-4 md:px-6">
         <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <SectionTitle>Smart Lab</SectionTitle>
                <SectionDescription>
                    A collection of AI-powered tools to showcase my skills. Play around and see what they can do!
                </SectionDescription>
            </div>
        </div>
        <div className="mt-12">
            <Tabs defaultValue="code-playground" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="code-playground">Code Playground</TabsTrigger>
                    <TabsTrigger value="it-news">IT News</TabsTrigger>
                </TabsList>
                <TabsContent value="code-playground" className="mt-8">
                    <CodePlayground />
                </TabsContent>
                <TabsContent value="it-news" className="mt-8">
                    <ItNews />
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}
