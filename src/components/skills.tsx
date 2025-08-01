import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const skills = [
  { name: 'JavaScript', proficiency: 95, description: "Expert in modern JS (ES6+), async/await, and performance optimization." },
  { name: 'React & Next.js', proficiency: 90, description: "Building interactive UIs with hooks, server components, and state management." },
  { name: 'TypeScript', proficiency: 90, description: "Enhancing code quality and maintainability with static typing." },
  { name: 'Node.js', proficiency: 85, description: "Developing scalable server-side applications and RESTful APIs." },
  { name: 'HTML & CSS', proficiency: 95, description: "Crafting semantic, accessible, and responsive layouts with modern CSS." },
  { name: 'Tailwind CSS', proficiency: 88, description: "Rapidly building custom designs with a utility-first CSS framework." },
  { name: 'Python & GenAI', proficiency: 75, description: "Leveraging Python for scripting and integrating generative AI models." },
  { name: 'Firebase & SQL', proficiency: 80, description: "Designing and managing databases with both NoSQL and SQL solutions." },
];

export function Skills() {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Expertise</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            I have a diverse skill set that allows me to build robust and beautiful web applications from front to back.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8">
        <TooltipProvider>
          {skills.map((skill) => (
            <Tooltip key={skill.name}>
              <TooltipTrigger asChild>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">{skill.name}</h3>
                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency ${skill.proficiency}%`} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{skill.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  )
}
