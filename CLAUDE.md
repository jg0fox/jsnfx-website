# CLAUDE.md — jsnfx.com Personal Website

> This file provides context and instructions for Claude Code when working on this project.

## Project Summary

Building a personal portfolio website for a senior content designer. The site showcases professional work, side projects, and personal brand with an organic, warm, refined aesthetic. Hosted on Vercel, built with Next.js.

**Key Priorities**:
1. **Componentization** — Easy to create new portfolio/project pages with minimal effort
2. **Consistency** — Design system that ensures visual coherence across all pages
3. **Craft** — High attention to detail, polished interactions, thoughtful typography
4. **Content-first** — MDX-based content that's easy to author and maintain

---

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom theme
- **Content**: MDX for all page content
- **Language**: TypeScript (strict mode)
- **Icons**: Lucide React
- **Animations**: Framer Motion (use sparingly)
- **Deployment**: Vercel

---

## Design Tokens — USE THESE CONSISTENTLY

### Colors

```
Palm Leaf (primary green):   #90955e
Palm Leaf 2:                  #9e9658  
Palm Leaf 3 (darker):         #818751
Soft Linen (background):      #f5f1e8
Soft Linen Light (cards):     #faf8f3
Soft Linen Dark (borders):    #e8e2d5
Bronze Spice (accent):        #c25a28
Text Primary:                 #2d3a2e
Text Secondary:               #5a6b5c
Text Muted:                   #8a9a8c
```

### Typography Scale

Use Tailwind's default scale but prefer:
- Headings: text-4xl/text-3xl/text-2xl/text-xl with font-bold or font-black
- Body: text-base with font-normal
- Small/captions: text-sm with text-muted color

### Spacing

Use Tailwind's spacing scale. Prefer generous whitespace:
- Section gaps: gap-12 or gap-16
- Component internal padding: p-6 or p-8
- Element gaps: gap-4 or gap-6

### Border Radius

- Cards/containers: rounded-lg (0.5rem)
- Buttons: rounded-lg
- Tags/pills: rounded-full
- Images: rounded-lg

---

## Responsive Design — CRITICAL

**Mobile is a first-class citizen, not an afterthought.** Every component and page must be designed mobile-first and look intentional at all screen sizes.

### Breakpoints (Tailwind defaults)

```
base     → Mobile (< 640px) — START HERE
sm:      → 640px  (large phones)
md:      → 768px  (tablets)
lg:      → 1024px (laptops) — sidebar becomes visible
xl:      → 1280px (desktops)
2xl:     → 1536px (large desktops)
```

### Key Layout Shifts

| Breakpoint | Sidebar | Content | Portfolio Grid |
|------------|---------|---------|----------------|
| < lg | Hidden (hamburger) | Full width | 1 column |
| ≥ lg | Fixed 288px | Beside sidebar | 2-3 columns |

### Mobile Navigation Requirements

- **Header bar**: 64px tall, sticky, contains logo + hamburger
- **Menu**: Full-screen overlay or slide-in drawer
- **Close**: X button + tap outside to dismiss
- **Active state**: Current page clearly marked

### Responsive Component Pattern

Always write mobile-first, then add breakpoint modifiers:

```tsx
// ✅ Correct: mobile-first
<div className="flex flex-col gap-4 lg:flex-row lg:gap-8">

// ❌ Wrong: desktop-first  
<div className="flex flex-row gap-8 max-lg:flex-col max-lg:gap-4">
```

### Required Responsive Utilities

```tsx
// Stack to row
flex flex-col md:flex-row

// Show/hide at breakpoints
hidden lg:flex          // Hidden on mobile, flex on desktop
lg:hidden               // Visible on mobile, hidden on desktop

// Responsive grid
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Responsive spacing
px-4 md:px-6 lg:px-10
py-6 md:py-8 lg:py-16
gap-4 md:gap-6 lg:gap-8

// Responsive text
text-3xl lg:text-5xl    // Headings scale up on desktop
```

### Touch Targets

All interactive elements must be at least **44x44px** on mobile. Use padding to achieve this:

```tsx
// ✅ Good: adequate tap target
<button className="px-4 py-3 min-h-[44px]">

// ✅ Good: icon button with padding
<button className="p-3"> 
  <Icon className="w-5 h-5" />
</button>
```

### Images

Always use Next.js Image with responsive sizes:

```tsx
<Image
  src={heroImage}
  alt="Description"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
  className="object-cover"
/>
```

### Testing Checklist (Responsive)

Before any PR, verify at these widths:
- [ ] 375px (iPhone SE)
- [ ] 430px (iPhone Pro Max)
- [ ] 768px (iPad)
- [ ] 1024px (breakpoint boundary)
- [ ] 1440px (desktop)

Check for:
- [ ] No horizontal scrollbar
- [ ] Text readable without zoom
- [ ] Navigation accessible
- [ ] Images not cut off or distorted
- [ ] Adequate spacing between elements

---

## Code Standards

### File Organization

```
components/
├── layout/        # Sidebar, MobileNav, Footer, PageHeader
├── ui/            # Button, Card, Tag, StatCard, etc.
├── portfolio/     # Portfolio-specific components
├── projects/      # Project-specific components  
└── mdx/           # MDX component mappings
```

### Component Patterns

**Always**:
- Use TypeScript with proper prop types
- Export named components (not default) except for page components
- Colocate component-specific styles in the component file
- Use semantic HTML elements

**Example component structure**:

```tsx
// components/ui/Button.tsx
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        // variant styles
        // size styles
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Tailwind Usage

- Use the custom color names defined in tailwind.config (palm-leaf, soft-linen, bronze-spice, etc.)
- Prefer utility classes over custom CSS
- Use `@apply` sparingly, only for repeated complex patterns
- Group related utilities logically in className strings

### Content/MDX Patterns

Portfolio and project content lives in `content/` directory with this structure:

```
content/portfolio/project-slug/
├── index.mdx          # Main content with frontmatter
└── images/            # Project-specific images
```

**Frontmatter is the source of truth** for metadata. Parse it consistently.

---

## Key Components to Build

### 1. Layout Components

**Sidebar** (`components/layout/Sidebar.tsx`):
- Logo + name at top
- Main navigation with active state (left border indicator)
- Portfolio section should be expandable to show sub-items
- "Connect" section at bottom with social links
- Fixed position, full viewport height on desktop

**MobileNav** (`components/layout/MobileNav.tsx`):
- Hamburger trigger in header
- Slide-out drawer or full-screen overlay
- Same navigation structure as sidebar

### 2. UI Components (Reusable)

- `Button` — primary, secondary, ghost variants
- `Card` — generic content card with optional image
- `Tag` — pill-style tag for categories, skills, tools
- `StatCard` — large number + label for metrics
- `Divider` — horizontal rule with optional label
- `ImageWithCaption` — image component with optional caption text

### 3. Portfolio Components

- `PortfolioCard` — card for index grid (thumbnail, category, title, description)
- `PortfolioDetail` — wrapper layout for detail pages (2-column on desktop)
- `ProjectMeta` — sticky sidebar with role, timeline, client, tools
- `ProjectNav` — prev/next navigation between projects

### 4. MDX Components

Map these for use in MDX content:
- Custom headings with anchor links
- Image component with proper sizing/captions
- Callout/highlight boxes
- Code blocks with syntax highlighting
- Custom list styling

---

## Content Fetching Pattern

```tsx
// lib/content.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export async function getPortfolioItems() {
  // Read all portfolio directories
  // Parse frontmatter from each index.mdx
  // Return sorted array of portfolio metadata
}

export async function getPortfolioBySlug(slug: string) {
  // Read specific portfolio item
  // Return frontmatter + MDX content
}
```

---

## Page Structure

### Home/About (`app/page.tsx`)

Sections:
1. Hero with intro text + profile photo
2. "My Story" narrative section
3. "Core Competencies" with skill tags
4. Stats row (years experience, projects shipped, etc.)

### Portfolio Index (`app/portfolio/page.tsx`)

- Page header with title + description
- Filter/category tabs (optional, can be added later)
- Grid of PortfolioCards (responsive: 1 col mobile, 2-3 cols desktop)

### Portfolio Detail (`app/portfolio/[slug]/page.tsx`)

- Breadcrumb navigation
- Hero section (title, description, hero image)
- Two-column layout:
  - Main: Problem, Solution, Visual Highlights, Results
  - Sidebar: Project details (sticky)
- Prev/Next project navigation

### Projects pages follow similar pattern to Portfolio

---

## Animation Guidelines

**Default transition**: `transition-colors duration-200 ease-out`

**Hover states**:
- Buttons: background color shift
- Cards: subtle lift (`hover:-translate-y-0.5 hover:shadow-md`)
- Links: color shift, optional underline

**Page transitions** (optional enhancement):
- Fade in + subtle upward motion on route change
- Use Framer Motion's `AnimatePresence` if implementing

**Respect reduced motion**:
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

---

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Lint
npm run lint

# Preview production build
npm run start
```

---

## Testing Checklist

Before considering a page/component complete:

**Responsive (most important)**:
- [ ] Looks intentional at 375px (small phone)
- [ ] Looks good at 430px (large phone)
- [ ] Looks good at 768px (tablet)
- [ ] Looks good at 1024px (laptop / sidebar appears)
- [ ] Looks good at 1440px (desktop)
- [ ] No horizontal scrollbar at any size
- [ ] Touch targets are at least 44x44px on mobile

**Accessibility**:
- [ ] Keyboard navigable: can tab through all interactive elements
- [ ] Focus states: visible focus indicators on all interactive elements
- [ ] Color contrast: text is readable (use browser dev tools to verify)
- [ ] Images: have descriptive alt text

**Quality**:
- [ ] Uses Next.js Image component for all images
- [ ] TypeScript: no type errors
- [ ] Console: no errors or warnings
- [ ] Animations respect prefers-reduced-motion

---

## Important Notes

1. **Mobile-first, always**: Write base styles for mobile, then add breakpoint modifiers for larger screens. Test on mobile viewport before desktop.

2. **Don't reinvent the wheel**: Check if a component already exists before creating a new one

3. **Content is king**: The site exists to showcase work. Design decisions should make content shine, not distract from it

4. **Progressive enhancement**: Core content should work without JavaScript. Animations are enhancement

5. **Consistency over novelty**: When in doubt, match existing patterns rather than introducing new ones

6. **Test at breakpoints**: Every component should be verified at 375px, 768px, and 1024px minimum

7. **Ask about design decisions**: If something isn't specified in the tech spec, ask before implementing. Better to clarify than to redo.

---

## Reference Files

- `jsnfx-website-tech-spec.md` — Full technical specification with design details
- `content/` — All MDX content files
- `public/logo.svg` — Logo file
- `public/images/` — Static images

---

## Quick Start

1. Initialize project:
   ```bash
   npx create-next-app@latest jsnfx-website --typescript --tailwind --app --src-dir=false
   ```

2. Install dependencies:
   ```bash
   npm install lucide-react framer-motion gray-matter next-mdx-remote
   npm install -D @tailwindcss/typography
   ```

3. Configure Tailwind theme with custom colors (see design tokens above)

4. Build components in order: layout → ui → page-specific

5. Set up content structure and MDX processing

6. Build pages, starting with About/Home
