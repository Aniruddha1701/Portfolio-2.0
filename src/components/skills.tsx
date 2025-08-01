import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const skills = [
  { name: 'JavaScript', proficiency: 95, description: "Advanced proficiency in modern ES6+ features." },
  { name: 'React.js & Next.js', proficiency: 90, description: "Component-based development, state management, hooks, and full-stack React." },
  { name: 'Node.js & Express.js', proficiency: 85, description: "Server-side JavaScript, RESTful API development, and middleware." },
  { name: 'Python', proficiency: 80, description: "Machine learning, data analysis, and backend development." },
  { name: 'MongoDB', proficiency: 85, description: "Database design, aggregation pipelines, and performance optimization." },
  { name: 'C++', proficiency: 80, description: "Strong foundation in OOP and algorithm implementation." },
  { name: 'SQL', proficiency: 75, description: "Database design, complex queries, and performance optimization." },
  { name: 'Machine Learning', proficiency: 78, description: "Experience with LightGBM, KNN, Scikit-learn, Pandas, and NumPy." },
];

export function Skills() {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">My Expertise</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            I have a diverse skill set that allows me to build robust and beautiful web applications from front to back.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8">
        <TooltipProvider>
          {skills.map((skill) => (
            <Tooltip key={skill.name} delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="space-y-3 group">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">{skill.name}</h3>
                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                  </div>
                  <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency ${skill.proficiency}%`} className="h-3" />
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
