# Graph Report - My Website  (2026-05-17)

## Corpus Check
- 144 files · ~72,043 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 781 nodes · 1400 edges · 64 communities (52 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `060aac04`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 59|Community 59]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 56 edges
2. `dbConnect()` - 29 edges
3. `successResponse()` - 25 edges
4. `serverError()` - 25 edges
5. `errorResponse()` - 22 edges
6. `a` - 18 edges
7. `requireAdmin()` - 17 edges
8. `v` - 15 edges
9. `logAudit()` - 15 edges
10. `z()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `DropdownMenuShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `MenubarShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/menubar.tsx → src/lib/utils.ts
- `SheetHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts

## Communities (64 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (68): GET(), contactSchema, POST(), POST(), dbConnect(), GET(), DELETE(), PATCH() (+60 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (42): ResumeRequest, ResumeRequestsTab(), Sidebar(), NewsArticle, cardVariants, containerVariants, getProjectColors(), Portfolio (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (31): generateMetadata(), AuthContext, AuthContextType, AuthProvider(), useAuth(), User, ProtectedRoute(), ProtectedRouteProps (+23 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (25): domain, getAccessTokenCookieConfig(), getAuthCookieConfig(), getClearCookieConfig(), getRefreshTokenCookieConfig(), createSession(), SessionData, getDeviceInfo() (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (25): ItNews(), Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (14): b(), d(), deleteCacheAndMetadata(), e(), et, f(), g, i (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (13): AccordionContent, AccordionItem, AccordionTrigger, Avatar, AvatarFallback, AvatarImage, PopoverContent, RadioGroup (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (3): a, c(), h()

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (12): SOLUTIONS, VALID_GUESSES, Grid(), GridProps, Keyboard(), KeyboardProps, ROWS, EvaluatedLetter (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (13): Certifications, Footer, ItNews, Journey, MatrixRain, Portfolio, Skills, Terminal (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (7): ResumeRequestModalProps, EyeBallProps, PupilProps, Checkbox, Input, Label, labelVariants

### Community 12 - "Community 12"
Cohesion: 0.35
Nodes (5): m(), st(), T(), u, v

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (11): ai, handleGetItNews(), getItNews(), itNewsFlow, ItNewsOutput, ItNewsOutputSchema, prompt, getStaticItNews() (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (15): 🙏 Acknowledgments, code:bash (# Development), code:env (# Database), code:block9 (Portfolio-2.0/), 📞 Contact & Support, 🤝 Contributing, ⚙️ Environment Variables, 📄 License (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.2
Nodes (11): FloatingNavbar(), navItems, ThemeToggle(), cn(), DialogContent, DialogDescription, DialogFooter(), DialogHeader() (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (13): checkRateLimit(), cleanupExpiredEntries(), config, generateRequestId(), getClientIp(), getRouteTier(), getSecurityHeaders(), hashIp() (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 18 - "Community 18"
Cohesion: 0.2
Nodes (7): SidebarProps, CommandOutput, Button, ButtonProps, buttonVariants, Calendar(), CalendarProps

### Community 20 - "Community 20"
Cohesion: 0.23
Nodes (10): CertificateCard(), CertificationsProps, containerVariants, getCertificateLogo(), getHolographicColors(), CardBody(), CardContainer(), CardItem() (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.21
Nodes (3): j(), q(), r

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (9): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 24 - "Community 24"
Cohesion: 0.2
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.24
Nodes (7): HeroEnhancedProps, ResumeRequestModal(), COLOR_SCHEME, createNoise(), CyberBackgroundProps, FluidParticlesBackground(), Particle

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (9): 🤖 **AI-Powered**, code:yaml (✨ Stunning dark/light mode), code:yaml (🧠 Google Gemini AI integration), code:yaml (📧 Email OTP authentication), code:yaml (📱 PWA support), ✨ Highlights, 🎨 **Modern Design**, ⚡ **Performance** (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (4): Skill, Skills, SkillsProps, techLogos

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (7): 🎨 Admin Panel, Authentication Flow, code:mermaid (sequenceDiagram), 💼 Content, Features, 📄 Files, 👤 Personal Info

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (4): content, files, fs, path

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (5): c, n(), r(), s, u

### Community 36 - "Community 36"
Cohesion: 0.33
Nodes (5): GuestbookEntry, ModerateTextInput, ModerateTextInputSchema, ModerateTextOutput, ModerateTextOutputSchema

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (6): code:yaml (✅ Node.js >= 18.0), code:bash (# 📥 1. Clone the repository), 🛠️ Installation, 🎉 Open [http://localhost:9002](http://localhost:9002) in your browser!, 📦 Prerequisites, 🚀 Quick Start

### Community 41 - "Community 41"
Cohesion: 0.4
Nodes (5): code:dockerfile (FROM node:18-alpine), code:bash (docker build -t portfolio .), 🚢 Deployment, Docker, Vercel (Recommended)

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (3): formatUptime(), GET(), startTime

### Community 43 - "Community 43"
Cohesion: 0.5
Nodes (4): code:mermaid (graph LR), 🌟 Core Features, 🎯 Features, 📦 Portfolio Sections

### Community 44 - "Community 44"
Cohesion: 0.5
Nodes (4): 🤖 AI & Integration, 🔧 Backend & Database, 🌈 Frontend Technologies, 🛠️ Tech Stack

### Community 45 - "Community 45"
Cohesion: 0.5
Nodes (4): Animations, code:css (:root {), 🎨 Customization, Theme Colors

### Community 46 - "Community 46"
Cohesion: 0.5
Nodes (4): 🔌 API Reference, Authentication, Contact, Portfolio

### Community 47 - "Community 47"
Cohesion: 0.5
Nodes (3): Important Notes:, Security:, Uploads Directory

## Knowledge Gaps
- **270 isolated node(s):** `withPWA`, `nextConfig`, `config`, `{ fontFamily }`, `fs` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 15` to `Community 1`, `Community 4`, `Community 6`, `Community 10`, `Community 11`, `Community 17`, `Community 18`, `Community 20`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 27`, `Community 28`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.202) - this node is a cross-community bridge._
- **Why does `handleGetItNews()` connect `Community 13` to `Community 1`, `Community 12`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 0` to `Community 12`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `withPWA`, `nextConfig`, `config` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._