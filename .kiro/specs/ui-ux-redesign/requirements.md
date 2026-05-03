# Requirements: NexoraGrid UI/UX Redesign

## Introduction

NexoraGrid requires a full-stack advanced UI/UX redesign of its public landing page and authenticated dashboard. The goal is to achieve a world-class, modern tech aesthetic — on par with Linear, Vercel, Stripe, and Raycast — using only the existing technology stack (Next.js 14, Tailwind CSS, Framer Motion, Recharts, Radix UI, Lucide React). No new npm packages are introduced.

---

## Requirements

### 1. Design System Foundation

**1.1** The global CSS file SHALL be extended with new CSS custom properties for brand gradients, glass surface tokens, glow shadow tokens, and semantic surface color tokens.

**1.2** The global CSS file SHALL include new `@keyframes` definitions: `shimmer`, `float`, `pulse-glow`, `gradient-shift`, `marquee`, `count-up`, `slide-in-top`, `spin-slow`, `border-flow`.

**1.3** The global CSS file SHALL include new Tailwind `@layer components` utility classes: `.bento-card`, `.glass-strong`, `.gradient-border`, `.marquee-track`, `.marquee-container`, `.neon-glow-indigo`, `.neon-glow-cyan`, `.shimmer-line`.

**1.4** All animations SHALL respect `prefers-reduced-motion` by disabling or minimizing motion when the user has enabled this OS preference.

**1.5** All interactive elements SHALL maintain WCAG 2.1 AA color contrast ratios (≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI components).

---

### 2. Landing Page — Navigation

**2.1** The navigation bar SHALL be transparent on page load and transition to a frosted glass style (`backdrop-blur-xl`, dark semi-transparent background, bottom border) when the user scrolls more than 20px.

**2.2** The navigation SHALL include a "Product" link that opens a mega-menu dropdown showing platform sub-pages (Features, Pricing, Changelog, Roadmap, Status).

**2.3** The navigation SHALL include a "Solutions" link that opens a mega-menu dropdown showing solution verticals (Energy, Enterprise, Startups, Government, Developers).

**2.4** The navigation SHALL include a command palette trigger button displaying `⌘K` that opens the command palette modal when clicked.

**2.5** The navigation SHALL include a mobile hamburger menu that opens a full-screen drawer with staggered link animations on mobile viewports.

**2.6** The navigation logo SHALL have an animated hover effect (gradient rotation).

---

### 3. Landing Page — Hero Section

**3.1** The hero section SHALL occupy the full viewport height with a dark background featuring a CSS mesh gradient (radial gradients, no canvas or WebGL).

**3.2** The hero SHALL display animated floating orbs (CSS `animate-float` keyframe) at different delays to create depth.

**3.3** The hero SHALL display an announcement banner with a gradient border pill containing a "New" badge and descriptive text.

**3.4** The hero headline SHALL use an animated gradient shimmer effect (`gradient-shift` keyframe with `background-size: 200%`).

**3.5** The hero SHALL display a floating dashboard preview card with a subtle float animation and glassmorphism styling.

**3.6** The hero SHALL display a stats bar with 4 key metrics, each with an animated count-up effect on page load.

---

### 4. Landing Page — Features Section

**4.1** The features section SHALL use an asymmetric bento grid layout where some cards span multiple columns/rows.

**4.2** Each feature card SHALL use the `.bento-card` utility class and display a gradient icon, title, and description.

**4.3** Feature cards SHALL apply a `.gradient-border` effect on hover.

**4.4** Feature cards SHALL use Framer Motion `whileHover: { scale: 1.02 }` for subtle interaction feedback.

---

### 5. Landing Page — Social Proof

**5.1** The trusted-by section SHALL use a CSS-only infinite horizontal marquee (`.marquee-track` + `.marquee-container`) with duplicated logo list for seamless looping — no JavaScript animation.

**5.2** The testimonials section SHALL display at least 3 glassmorphism testimonial cards with star rating, quote text, avatar, name, and company.

**5.3** Testimonial cards SHALL animate into view with a staggered `whileInView` Framer Motion effect.

---

### 6. Landing Page — Pricing Section

**6.1** The pricing section SHALL include a monthly/annual billing toggle with an animated sliding pill indicator.

**6.2** The "Pro" pricing tier SHALL be visually distinguished with a `.gradient-border` card and neon glow effect.

**6.3** Feature list items SHALL animate in with a `scaleIn` Framer Motion variant when the section enters the viewport.

---

### 7. Landing Page — Footer

**7.1** The footer SHALL include a newsletter signup form with a gradient-focused input and a gradient "Subscribe" button.

**7.2** The footer SHALL display social links using Lucide React icons (not text abbreviations) for Twitter/X, LinkedIn, GitHub, and YouTube.

**7.3** The footer SHALL display a live status indicator with an animated green pulse dot and "All systems operational" text.

---

### 8. Dashboard — Sidebar

**8.1** The sidebar SHALL support a collapsed state (`w-16`) showing only icons, and an expanded state (`w-60`) showing icons and labels.

**8.2** The collapsed/expanded state SHALL be persisted to `localStorage` so it survives page refreshes.

**8.3** In collapsed mode, each nav item SHALL display a Radix Tooltip with the item label on hover.

**8.4** The active navigation item SHALL be indicated by a left border pill (`w-0.5 h-5 bg-indigo-500`) and a subtle background highlight.

**8.5** The sidebar width transition SHALL use Framer Motion `motion.aside` with a smooth `0.25s easeInOut` animation.

---

### 9. Dashboard — Topbar

**9.1** The topbar SHALL include a command palette modal triggered by the `⌘K` keyboard shortcut and a visible button.

**9.2** The command palette SHALL be implemented as a Radix Dialog with a search input, grouped results (Pages, Recent, Actions), and keyboard navigation (arrow keys, Enter, Escape).

**9.3** The notification bell SHALL display an animated badge with the unread count.

**9.4** The notification dropdown SHALL use `glass-strong` styling and include a "Mark all read" action.

**9.5** The user avatar SHALL open a Radix DropdownMenu with items: Profile, Settings, Billing, and Sign out.

---

### 10. Dashboard — Metric Cards

**10.1** Each metric card SHALL use glassmorphism styling (`bg-white/[0.04] backdrop-blur-sm border border-white/8 rounded-2xl`).

**10.2** Each metric card SHALL display an inline SVG sparkline (7-day trend using `<polyline>`) — not a Recharts component.

**10.3** The metric value SHALL animate from 0 to its actual value using a `requestAnimationFrame` count-up over 1200ms with easing on component mount.

**10.4** Each metric card SHALL apply a hover lift effect using Framer Motion `whileHover: { y: -2 }`.

---

### 11. Dashboard — Revenue Chart

**11.1** The chart SHALL display two data series: API Events (indigo) and a derived Revenue metric (emerald).

**11.2** The chart SHALL use a custom glassmorphism tooltip component (`.glass-strong` styled `<div>`).

**11.3** The time range selector SHALL use pill buttons with a sliding active indicator animation.

**11.4** Area fills SHALL use SVG `linearGradient` definitions with animated entry (`isAnimationActive={true}`).

---

### 12. Dashboard — System Health

**12.1** The system health panel SHALL display an SVG ring/donut chart showing the overall health score percentage.

**12.2** The ring chart stroke SHALL animate from 0 to the actual value using a Framer Motion `motion.circle` with `strokeDashoffset` animation over 1.2s.

**12.3** Each service row SHALL display an animated pulse dot (green for operational, amber for degraded, red for outage).

---

### 13. Dashboard — Activity Feed

**13.1** The activity feed SHALL use a timeline layout with a vertical connector line and colored dot indicators.

**13.2** Each activity item SHALL animate in using a `slideInLeft` Framer Motion variant with staggered delays.

**13.3** New items added in real-time SHALL animate in from the top using the `slide-in-top` CSS keyframe.

---

### 14. Dashboard — AI Insights Panel

**14.1** The AI insights card SHALL use a `.gradient-border` wrapper with an indigo→purple→cyan gradient border.

**14.2** Each insight's confidence bar SHALL animate its width from 0 to the actual percentage using Framer Motion `whileInView`.

**14.3** The panel SHALL include an "Ask AI" text input with a send button at the bottom.

---

### 15. Dashboard — Agents Panel

**15.1** The agents panel SHALL use a card grid layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) instead of a table.

**15.2** Each agent card SHALL display a gradient avatar circle with the agent's initials and an animated status ring (green pulse for active, amber for learning, grey for idle).

**15.3** Each agent card SHALL display a task progress bar with animated fill.

---

### 16. Dashboard — Quick Actions

**16.1** The quick actions panel SHALL use a command palette-style grid layout (`grid-cols-2`).

**16.2** Each action item SHALL display an icon, label, and keyboard shortcut hint in monospace font.

**16.3** Action items SHALL use `.glass-strong` background with a hover state of `bg-white/8`.

---

### 17. Non-Functional Requirements

**17.1** No new npm packages SHALL be introduced. All enhancements use the existing stack.

**17.2** All 13 files SHALL be rewritten in-place at their existing file paths — no new directories or files.

**17.3** The `dashboard/page.tsx` data orchestration file SHALL NOT be modified.

**17.4** The `landing-theme.tsx` theme context file SHALL NOT be modified.

**17.5** All components SHALL be fully responsive across `sm` (640px), `md` (768px), `lg` (1024px), and `xl` (1280px) breakpoints.

**17.6** All icon-only buttons SHALL have `aria-label` attributes.

**17.7** All modals (command palette, notifications) SHALL trap focus and support Escape key dismissal.
