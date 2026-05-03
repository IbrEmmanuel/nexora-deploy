# Implementation Tasks: NexoraGrid UI/UX Redesign

## Tasks

- [ ] 1. Extend design system in globals.css
  - Add all new CSS custom properties (gradient-brand, gradient-hero, gradient-mesh, glass tokens, glow tokens, surface tokens)
  - Add all new @keyframes (shimmer, float, pulse-glow, gradient-shift, marquee, count-up, slide-in-top, spin-slow, border-flow)
  - Add new @layer components utility classes (.bento-card, .glass-strong, .gradient-border, .marquee-track, .marquee-container, .neon-glow-indigo, .neon-glow-cyan, .shimmer-line)
  - Add prefers-reduced-motion media query block
  - **File:** `frontend/src/styles/globals.css`

- [ ] 2. Redesign landing navigation
  - Implement scroll-triggered frosted glass transform (transparent → backdrop-blur-xl on scroll > 20px)
  - Add Product mega-menu dropdown using Radix Popover with platform sub-pages
  - Add Solutions mega-menu dropdown with solution verticals
  - Add ⌘K command palette trigger button
  - Animate logo with gradient hover effect
  - Rewrite mobile drawer with staggered Framer Motion link animations
  - **File:** `frontend/src/components/landing/landing-nav.tsx`

- [ ] 3. Redesign landing page — Hero section
  - Replace background with CSS mesh gradient (radial-gradient orbs, no canvas)
  - Add 3 animated floating orbs with animate-float at staggered delays
  - Add gradient-border announcement banner pill
  - Implement animated gradient shimmer on headline text (gradient-shift keyframe)
  - Add floating glassmorphism dashboard preview card with animate-float
  - Add stats bar with 4 metrics and count-up animation on load
  - **File:** `frontend/src/components/landing/landing-page.tsx`

- [ ] 4. Redesign landing page — Features bento grid
  - Replace uniform 3-column grid with asymmetric bento grid layout
  - Apply .bento-card utility class to all feature cards
  - Add gradient-border hover effect on each card
  - Add whileHover scale(1.02) Framer Motion interaction
  - **File:** `frontend/src/components/landing/landing-page.tsx`

- [ ] 5. Redesign landing page — Social proof and pricing
  - Replace static logo grid with CSS-only infinite marquee (.marquee-track + .marquee-container with duplicated list)
  - Add 3 glassmorphism testimonial cards with staggered whileInView animation
  - Add monthly/annual billing toggle with animated sliding pill
  - Apply gradient-border + neon glow to Pro pricing tier card
  - Add scaleIn viewport animation to feature list checkmarks
  - **File:** `frontend/src/components/landing/landing-page.tsx`

- [ ] 6. Redesign landing footer
  - Add newsletter signup form with gradient-focused input and gradient Subscribe button
  - Replace text social abbreviations with Lucide React icon buttons (Twitter, Linkedin, Github, Youtube)
  - Add animated green pulse dot status indicator with "All systems operational" text
  - **File:** `frontend/src/components/landing/landing-footer.tsx`

- [ ] 7. Redesign dashboard sidebar
  - Persist collapsed state to localStorage (read on mount, write on toggle)
  - Add Radix Tooltip on each nav item when sidebar is collapsed
  - Replace current active indicator with left border pill (w-0.5 h-5 bg-indigo-500) + bg-indigo-500/10 background
  - Refine group label styling (text-[10px] uppercase tracking-widest text-white/25)
  - Ensure motion.aside width animation is smooth (0.25s easeInOut)
  - **File:** `frontend/src/components/layout/sidebar.tsx`

- [ ] 8. Redesign dashboard topbar with command palette
  - Add useEffect keyboard listener for ⌘K / Ctrl+K to open command palette
  - Implement command palette as Radix Dialog with search input, grouped results (Pages, Recent, Actions), arrow key + Enter + Escape navigation
  - Add animated notification badge with aria-live="polite"
  - Implement notification dropdown with glass-strong styling and "Mark all read" action
  - Replace user avatar button with Radix DropdownMenu (Profile, Settings, Billing, Sign out items)
  - **File:** `frontend/src/components/layout/topbar.tsx`

- [ ] 9. Redesign metric cards with glassmorphism and sparklines
  - Apply glassmorphism card styling (bg-white/[0.04] backdrop-blur-sm border border-white/8 rounded-2xl)
  - Add inline SVG sparkline using <polyline> with 7 data points per card
  - Implement requestAnimationFrame count-up animation (0 → value over 1200ms with easing) on mount
  - Add Framer Motion whileHover lift effect (y: -2, box-shadow glow)
  - **File:** `frontend/src/components/dashboard/metric-cards.tsx`

- [ ] 10. Redesign revenue chart with multi-series and glass tooltip
  - Add second data series (Revenue, emerald color) derived from event count
  - Implement custom GlassTooltip component using glass-strong styling
  - Add animated time range selector (7d/30d/90d/1y) with sliding active pill
  - Add SVG linearGradient fills for both series with isAnimationActive={true}
  - **File:** `frontend/src/components/dashboard/revenue-chart.tsx`

- [ ] 11. Redesign system health with ring chart and animated dots
  - Add SVG ring/donut chart for overall health score (r=36, stroke-dasharray animation)
  - Animate ring stroke from 0 to actual value using Framer Motion motion.circle over 1.2s
  - Replace static status icons with animated pulse dots (green/amber/red CSS animation)
  - **File:** `frontend/src/components/dashboard/system-health.tsx`

- [ ] 12. Redesign activity feed as timeline
  - Replace list layout with timeline layout (vertical connector line + colored dot per item)
  - Apply slideInLeft Framer Motion variant with staggered delays to each item
  - Add slide-in-top CSS animation for new items prepended in real-time
  - Add "Load more" button at bottom
  - **File:** `frontend/src/components/dashboard/activity-feed.tsx`

- [ ] 13. Redesign AI insights panel with gradient border and animated bars
  - Wrap card in gradient-border div (indigo→purple→cyan gradient border)
  - Add animated gradient header with Sparkles icon and "Powered by GPT-4o" badge
  - Animate each confidence bar width from 0 to value using Framer Motion whileInView
  - Add "Ask AI" text input with send button at bottom of card
  - **File:** `frontend/src/components/dashboard/ai-insights.tsx`

- [ ] 14. Redesign agents panel as card grid
  - Replace table layout with grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4)
  - Add gradient avatar circle with agent initials and animated status ring (pulse for active)
  - Add task progress bar with animated fill width
  - Add Configure and Pause icon action buttons with Radix Tooltips
  - **File:** `frontend/src/components/dashboard/agents-panel.tsx`

- [ ] 15. Redesign quick actions as command palette grid
  - Replace current layout with grid-cols-2 command palette style
  - Apply glass-strong background to each action item
  - Add keyboard shortcut hint (monospace, right-aligned, text-white/30) to each item
  - Add hover state bg-white/8 transition
  - **File:** `frontend/src/components/dashboard/quick-actions.tsx`
