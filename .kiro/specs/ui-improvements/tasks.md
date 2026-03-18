# Tasks: UI Improvements

## Task List

- [x] 1. Add reduced motion support and scroll margin fixes to globals.css
  - [x] 1.1 Add `@media (prefers-reduced-motion: reduce)` block disabling keyframe animations
  - [x] 1.2 Add `scroll-margin-top: 80px` to all section IDs
  - [x] 1.3 Add `will-change: transform` to hero orb and card hover elements

- [x] 2. Fix floating navbar accessibility
  - [x] 2.1 Add `role="navigation"` and `aria-label="Main navigation"` to `<nav>` element
  - [x] 2.2 Add `aria-current="page"` to active nav button
  - [x] 2.3 Add `aria-expanded` to mobile menu toggle button
  - [x] 2.4 Add `aria-label="Mobile navigation menu"` to mobile menu overlay

- [x] 3. Improve hero section
  - [x] 3.1 Change bio text from `text-gray-400` to `text-gray-300`
  - [x] 3.2 Add `aria-hidden="true"` to decorative background orbs and grid overlay
  - [x] 3.3 Add `aria-label="Scroll down"` to scroll indicator container
  - [x] 3.4 Fix hero letter glow — replace Framer Motion `textShadow` string with CSS class toggle

- [x] 4. Apply consistent card style to Skills section
  - [x] 4.1 Replace shadcn `<Card>` wrappers in skills.tsx with `card-ultra-border` + `card-ultra` pattern
  - [x] 4.2 Add `whileInView` stagger entrance animation to skill category cards
  - [x] 4.3 Update category icon colors to use `hsl(var(--primary))` token

- [x] 5. Standardize Skills section header
  - [x] 5.1 Add floating badge with icon matching Portfolio/Certifications pattern
  - [x] 5.2 Add animated SVG underline to the section heading
  - [x] 5.3 Ensure heading uses `text-4xl md:text-6xl lg:text-7xl font-black tracking-tight`

- [x] 6. Fix Journey timeline responsive layout
  - [x] 6.1 Change timeline line from `left-6 md:left-8` to `left-4 md:left-8` for small screen safety
  - [x] 6.2 Wrap timeline dot ping animation in `prefers-reduced-motion` check
  - [x] 6.3 Add subtle `bg-blue-500/[0.02]` tint to education cards to visually separate from experience

- [x] 7. Optimize certification cards
  - [x] 7.1 Move `animate-spin-slow` from default state to `group-hover:animate-spin-slow`
  - [x] 7.2 Wrap `mousemove` spotlight handler in `requestAnimationFrame` throttle
  - [x] 7.3 Ensure grid items use `h-full` for consistent card heights

- [x] 8. Fix Portfolio section
  - [x] 8.1 Add `focus-visible:ring-2 focus-visible:ring-violet-500` to filter buttons
  - [x] 8.2 Suffix SVG gradient IDs with project index to prevent DOM ID conflicts

- [x] 9. Fix Tech Radar section heading in page.tsx
  - [x] 9.1 Replace inline `<h2>` with badge + gradient heading + animated SVG underline pattern
  - [x] 9.2 Ensure heading style matches other sections

- [x] 10. Stagger background orb animation delays
  - [x] 10.1 Audit all sections for simultaneous blob/orb animations
  - [x] 10.2 Add `animation-delay` values so no more than 2 orbs animate simultaneously per section
