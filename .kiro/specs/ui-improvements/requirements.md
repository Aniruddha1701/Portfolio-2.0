# Requirements: UI Improvements

## Introduction

This document defines the functional and non-functional requirements for the UI improvements to the portfolio website. Requirements are derived from the design document and organized by feature area.

## Requirements

### 1. Visual Consistency

#### 1.1 Unified Card Style
The system shall apply the `card-ultra-border` + `card-ultra` card pattern (already defined in `globals.css`) to the Skills section so that all content cards (Portfolio, Certifications, Skills) share the same dark glass aesthetic.

**Acceptance Criteria**:
- Skills section cards use `card-ultra` background style (`bg-[#0c0c11]` or equivalent dark glass)
- Skills section cards have the gradient top-edge highlight provided by `card-ultra::before`
- Visual appearance is consistent with Portfolio and Certifications card styles

#### 1.2 Consistent Section Header Pattern
All sections (Skills, Portfolio, Journey, Certifications) shall use the same section header structure: a floating badge with icon, a large gradient heading with animated SVG underline, and a subtitle paragraph.

**Acceptance Criteria**:
- Skills section header matches the badge + heading + underline pattern used in Portfolio and Certifications
- Section headings use `text-4xl md:text-6xl lg:text-7xl font-black tracking-tight` typography
- Animated SVG underline draws in on scroll using `whileInView` with `pathLength` animation

#### 1.3 Body Text Contrast
Body text and description text across all sections shall meet WCAG AA contrast requirements against the dark background.

**Acceptance Criteria**:
- Description text uses `text-gray-300` (not `text-gray-400`) for primary body copy
- Metadata/secondary text uses `text-gray-400` minimum
- Bio text in Hero uses `text-gray-300`

### 2. Animation and Interaction Refinements

#### 2.1 Section Entrance Animations
All sections that currently lack entrance animations shall have `whileInView` fade-in-up animations applied.

**Acceptance Criteria**:
- Skills section cards animate in with staggered `whileInView` entrance (matching Portfolio/Certifications stagger pattern)
- Animations use `viewport: { once: true }` to prevent re-triggering on scroll up
- Stagger delay between cards is 0.1s

#### 2.2 Reduced Motion Support
All CSS keyframe animations shall be disabled when the user has `prefers-reduced-motion: reduce` set in their OS.

**Acceptance Criteria**:
- A `@media (prefers-reduced-motion: reduce)` block in `globals.css` sets `animation-duration: 0.01ms` for `.animate-ping`, `.animate-blob`, `.animate-float`, `.animate-spin-slow`, `.animate-gradient`, `.animate-glow-pulse`
- Content remains fully visible and readable without animations
- Framer Motion `whileInView` entrance animations still apply (opacity only, no transform) when reduced motion is active

#### 2.3 Certification Card Spin Optimization
The `animate-spin-slow` conic gradient border on certification cards shall only activate on hover, not on page load.

**Acceptance Criteria**:
- The spinning border animation class is applied via `group-hover:` prefix, not as a default class
- No spinning animation runs on certification cards in their default (non-hovered) state
- On hover, the spin animation starts within 100ms

#### 2.4 Hero Letter Animation Performance
The per-letter `whileHover` animation on the hero name shall not cause visible jank on rapid mouse movement.

**Acceptance Criteria**:
- Hero name letters respond to hover with `y` translation and scale
- No frame drops below 30fps during rapid mouse movement across the name (verified visually)
- The glow effect uses `filter: drop-shadow()` or CSS `text-shadow` via a class toggle rather than Framer Motion string interpolation

### 3. Accessibility

#### 3.1 Navigation Accessibility
The floating navbar shall include proper ARIA attributes for screen reader support.

**Acceptance Criteria**:
- `<nav>` element has `role="navigation"` and `aria-label="Main navigation"`
- Active nav item has `aria-current="page"` attribute
- Mobile menu toggle button has `aria-expanded` attribute reflecting open/closed state
- Mobile menu has `aria-label="Mobile navigation menu"`

#### 3.2 Decorative Element Accessibility
All decorative visual elements (background orbs, grid overlay, glow effects) shall be hidden from screen readers.

**Acceptance Criteria**:
- Background gradient orbs have `aria-hidden="true"`
- The grid SVG overlay has `aria-hidden="true"`
- The scroll indicator in Hero has `aria-label="Scroll down"` on its container

#### 3.3 Focus Visibility
Interactive elements shall have visible focus rings in the dark theme.

**Acceptance Criteria**:
- Portfolio filter buttons have `focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- Navbar buttons have visible focus ring on keyboard navigation
- All `<a>` and `<button>` elements are reachable via Tab key

### 4. Responsive Design

#### 4.1 Scroll Margin for Fixed Navbar
All page sections shall have sufficient scroll margin to prevent content from being hidden behind the floating navbar when navigated to via anchor links.

**Acceptance Criteria**:
- All section IDs (`#home`, `#about`, `#skills`, `#portfolio`, `#certifications`, `#logic-demo`, `#tech-radar`) have `scroll-margin-top: 80px` applied in CSS
- Clicking a nav item scrolls the section heading into view below the navbar

#### 4.2 Timeline Mobile Layout
The Journey timeline shall be fully readable on screens narrower than 375px.

**Acceptance Criteria**:
- Timeline vertical line uses `left-4` on mobile (not `left-6`) to prevent overflow
- Timeline dot is positioned correctly relative to the line on all screen sizes
- Card content does not overflow its container on 320px wide screens

#### 4.3 Skills Grid Responsive Layout
The Skills section grid shall adapt appropriately across breakpoints.

**Acceptance Criteria**:
- 1 column on mobile (< 640px)
- 2 columns on tablet (640px–1023px)
- 3 columns on desktop (≥ 1024px)
- Category cards maintain readable content at all breakpoints

### 5. Performance

#### 5.1 Spotlight Effect Throttling
Mouse-tracking spotlight effects (CertificateCard, ProjectCard) shall be throttled to prevent excessive recalculation.

**Acceptance Criteria**:
- `mousemove` handlers for spotlight effects use `requestAnimationFrame` throttling
- No more than one spotlight recalculation per animation frame (16ms at 60fps)

#### 5.2 Background Animation Staggering
Multiple simultaneous blob/orb animations shall have staggered `animation-delay` values to spread GPU load.

**Acceptance Criteria**:
- Background orb animations in each section have at least 2s delay between each orb's animation cycle start
- No more than 2 orbs animate simultaneously in the same section

#### 5.3 Will-Change Hints
Elements that use CSS transforms in animations shall declare `will-change: transform` to enable GPU compositing.

**Acceptance Criteria**:
- Hero background orbs have `will-change: transform` applied
- Card hover lift elements have `will-change: transform` applied
- `will-change` is removed after animation completes (or scoped to hover state via CSS)

### 6. Typography

#### 6.1 Font Hierarchy Consistency
All section headings shall use the same typographic scale defined in the design document.

**Acceptance Criteria**:
- All section `<h2>` headings use `text-4xl md:text-6xl lg:text-7xl font-black tracking-tight`
- Card titles use `text-xl md:text-2xl font-bold`
- Body/description text uses `text-sm md:text-base leading-relaxed`

#### 6.2 Tech Radar Section Heading
The "Global Tech Radar" heading in `page.tsx` shall match the section heading style used in other sections (badge + gradient heading + underline).

**Acceptance Criteria**:
- Tech Radar section has a badge element matching the pattern in Portfolio/Certifications
- Heading uses the same gradient text and animated SVG underline pattern
- The inline `h2` in `page.tsx` is replaced with the consistent pattern

### 7. SVG ID Uniqueness

#### 7.1 Unique Gradient IDs
SVG `linearGradient` elements with hardcoded `id` attributes shall use unique IDs to prevent conflicts when multiple instances render.

**Acceptance Criteria**:
- Portfolio section SVG gradient IDs are suffixed with a unique identifier (e.g., project index or title slug)
- Certifications section SVG gradient IDs are unique per card
- No duplicate SVG element IDs exist in the rendered DOM (verifiable via browser DevTools)
