# Site Modernization & Writing/Speaking Pages

## Overview

Modernize gohjiayi.github.io from a single-page React 17 + Chakra UI v1 portfolio into a multi-page site with modern tooling, a visual refresh, and dedicated writing and speaking pages.

## Goals

1. Upgrade the technical stack (React 18, Tailwind CSS, React Router)
2. Refresh the visual design to a modern minimal aesthetic
3. Add a `/writing` page consolidating authored articles and press features
4. Add a `/speaking` page for talks and presentations
5. Add per-page SEO / Open Graph meta tags

## Technical Stack

### Current → Target

| Layer | Current | Target |
|-------|---------|--------|
| React | 17.0.2 (class components) | 18.x (functional components + hooks) |
| Styling | Chakra UI v1 + @emotion | Tailwind CSS 3.x + Radix UI primitives |
| Routing | None (anchor-based SPA) | React Router v6 |
| Animations | react-awesome-reveal + @emotion keyframes | CSS transitions only |
| Build | Vite 7.x | Vite 7.x (no change) |
| Icons | FontAwesome (@fortawesome) | FontAwesome (no change) |
| Analytics | react-ga (GA3 API) | Keep or migrate to GA4 gtag |

### Key Decisions

- **Tailwind over Chakra v2/v3:** Avoids Chakra's migration churn. Full control over the visual refresh. Better ecosystem support. Radix UI provides accessible primitives (navigation menus, dialogs, toggles) without imposing styles.
- **React 18 over 19:** Stable, full ecosystem compatibility, concurrent features.
- **Drop react-awesome-reveal:** Replaced by subtle CSS transitions. Reduces bundle size and avoids heavy scroll animations.

### GitHub Pages SPA Support

React Router uses `BrowserRouter`. A `404.html` redirect trick is needed for GitHub Pages to support client-side routes:
- `404.html` in `public/` redirects all paths to `index.html` with the original path encoded as a query parameter
- A small script in `index.html` restores the correct URL on load

## Visual Design

### Color

- **Light mode default** with a dark mode toggle (persisted to localStorage)
- **Neutral base:** White/light gray backgrounds, dark gray text
- **Accent:** Rose/pink family — primary `#c02559`, with lighter and darker variants for hover states, tags, and highlights
- **Dark mode:** Near-black backgrounds (`#0f0f0f`), light text, same rose accent

### Typography

- **Headings:** Playfair Display (serif) — retained from current site, distinctive for personal branding
- **Body:** Inter (sans-serif) — clean and highly readable
- **Hierarchy:** Larger heading sizes with more whitespace between sections. Clear visual rhythm.

### Layout Principles

- More whitespace throughout — generous padding and margins
- Max content width (~1024px) centered, with wider hero sections
- Cards: Minimal borders, subtle shadow on hover, clean spacing
- Mobile-first responsive design

### Motion

- CSS transitions on hover states (cards lift, links underline, buttons darken)
- No scroll-triggered entrance animations
- Dark mode toggle transition

## Site Structure

### Routes

| Route | Page | Content |
|-------|------|---------|
| `/` | Home | Hero, About, Resume, Projects — all as scrollable sections |
| `/writing` | Writing | Authored articles + "Featured In" section |
| `/speaking` | Speaking | Talks and presentations |

### Navigation

Persistent top navbar across all pages:

```
Home   About   Resume   Projects   Writing   Speaking        [dark mode toggle]
```

Behavior:
- **On `/`:** About, Resume, Projects are smooth-scroll anchor links (`#about`, `#resume`, `#projects`). Home scrolls to top.
- **On `/writing` or `/speaking`:** Home links to `/`. About, Resume, Projects link to `/#about`, `/#resume`, `/#projects`. Writing/Speaking route to their pages.
- **Active state:** Current page/section highlighted with accent color
- **Mobile:** Hamburger menu with vertical dropdown

### Footer

Shared across all pages:
- Social links row (LinkedIn, GitHub, X, Medium, Google Scholar, Email)
- Copyright with dynamic year
- Back to top button (on `/`, scrolls to hero; on other pages, scrolls to page top)

## Pages

### Home Page (`/`)

Four scrollable sections, refreshed:

**Hero:** Full-viewport. Name (Playfair Display, large), headline, social icon row. Clean background — subtle gradient or solid color, no heavy image overlay. Scroll-down indicator.

**About:** Two-column layout (photo left, bio right). Profile photo with subtle border-radius. Bio paragraphs. Resume download button.

**Resume:** Clean timeline layout for experience and education. Skills as grouped tags (technical skills grouped by category). Light background section for contrast.

**Projects:** Card grid (2 columns desktop, 1 mobile). Each card: image thumbnail (16:9), title, category badge, tags, summary, external link. Existing showcase items carry over.

### Writing Page (`/writing`)

**Stats line** at the top: "X articles, Y features" — computed from data.

**Tag filter bar:** Horizontal row of clickable tag pills. "All" selected by default. Clicking a tag filters the list in-place. Tags derived from the union of all article tags.

**Section: Writing** (authored articles)
- Reverse chronological list of rich cards
- Each card: title, date (DD MMM YYYY), publication name as badge, summary (1-2 sentences), tags as small pills, thumbnail image, external link icon
- Cards link out to the original article URL

**Section: Featured In**
- Same card layout but with `context` instead of `summary` (e.g., "Quoted on LLM guardrails for government use")
- Visually differentiated with a subtle label or different accent

### Speaking Page (`/speaking`)

**Stats line:** "X talks"

**Tag filter bar:** Same pattern as writing page.

**Talk cards:**
- Title, event/conference name, date, summary, tags
- Links: recording URL and/or slides URL (conditionally shown)
- Thumbnail image

## Data Model

All content in `public/resumeData.json`. Existing `main`, `resume`, and `showcase` keys are preserved (showcase renamed internally from "projects" for clarity but data structure unchanged).

### New Keys

```json
{
  "writing": {
    "authored": [
      {
        "title": "string — article title",
        "date": "YYYY-MM-DD",
        "publication": "string — e.g. Medium, Towards Data Science",
        "summary": "string — 1-2 sentence description",
        "tags": ["string"],
        "url": "string — link to article",
        "image": "string — path to thumbnail, e.g. images/writing/slug.jpg (optional)"
      }
    ],
    "featured": [
      {
        "title": "string — article title",
        "date": "YYYY-MM-DD",
        "publication": "string — e.g. TechCrunch, The Straits Times",
        "context": "string — your role, e.g. 'Quoted on LLM guardrails'",
        "url": "string — link to article",
        "image": "string — path to thumbnail (optional)"
      }
    ]
  },
  "speaking": [
    {
      "title": "string — talk title",
      "event": "string — conference/meetup name",
      "date": "YYYY-MM-DD",
      "summary": "string — what the talk covers",
      "tags": ["string"],
      "url": "string — recording link (optional)",
      "slidesUrl": "string — slides link (optional)",
      "image": "string — path to thumbnail (optional)"
    }
  ]
}
```

## SEO

### Per-Page Meta Tags

Each route sets:
- `<title>` — e.g. "Goh Jia Yi — Writing", "Goh Jia Yi — Applied AI Engineer"
- `<meta name="description">` — page-specific summary
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

Implemented via a shared `SEO` component (using `react-helmet-async` or a simple `useEffect` to update `document.head`).

### Canonical URL

Each page sets `<link rel="canonical">` to its full URL.

### Sitemap

A static `sitemap.xml` in `public/` listing all routes. Updated manually when routes change.

## Component Architecture

```
src/
├── index.jsx              — entry point, providers (Router, Theme)
├── App.jsx                — route definitions
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx     — persistent top navigation
│   │   ├── Footer.jsx     — shared footer
│   │   └── SEO.jsx        — meta tag manager
│   ├── home/
│   │   ├── Hero.jsx       — full-viewport hero section
│   │   ├── About.jsx      — bio section
│   │   ├── Resume.jsx     — experience, education, skills
│   │   └── Projects.jsx   — showcase card grid
│   ├── writing/
│   │   ├── WritingPage.jsx    — page container with stats + filters
│   │   ├── ArticleCard.jsx    — card for authored articles
│   │   └── FeaturedCard.jsx   — card for featured/press entries
│   ├── speaking/
│   │   ├── SpeakingPage.jsx   — page container with stats + filters
│   │   └── TalkCard.jsx       — card for talks
│   └── shared/
│       ├── TagFilter.jsx      — reusable tag filter bar
│       ├── StatsLine.jsx      — reusable "X articles, Y talks" line
│       ├── SocialLinks.jsx    — social icon row
│       └── DarkModeToggle.jsx — theme toggle button
├── hooks/
│   └── useScrollSpy.js       — active section detection for nav
├── styles/
│   └── index.css              — Tailwind directives + custom utilities
├── data/
│   └── (resumeData.json stays in public/)
└── theme/
    └── (removed — Tailwind config replaces Chakra theme)

tailwind.config.js             — brand colors, fonts, custom utilities
```

## Migration Strategy

The work is sequenced in two phases:

### Phase 1: Technical Foundation

1. Upgrade React 17 → 18, update react-dom
2. Remove Chakra UI, @emotion, framer-motion. Install Tailwind CSS, Radix UI, postcss, autoprefixer
3. Configure Tailwind (brand colors, fonts, breakpoints)
4. Install React Router v6. Set up route structure and 404.html redirect
5. Convert each component from class → functional, Chakra → Tailwind, one at a time
6. Add SEO component and per-page meta tags
7. Add dark mode toggle (Tailwind `dark:` variant + localStorage persistence)

### Phase 2: New Content Pages

1. Add `writing` and `featured` data to resumeData.json
2. Build TagFilter and StatsLine shared components
3. Build WritingPage with ArticleCard and FeaturedCard
4. Add `speaking` data to resumeData.json
5. Build SpeakingPage with TalkCard
6. Update Navbar to include Writing and Speaking links
7. Add sitemap.xml

## Testing

- Visual testing in browser (dev server) for all pages and responsive breakpoints
- Verify GitHub Pages SPA routing works with 404.html redirect
- Verify dark mode toggle persists across page navigations and refreshes
- Verify tag filtering works correctly
- Verify all external links open in new tabs
- Verify SEO meta tags render correctly (inspect page source, use social card preview tools)
- Verify navigation behavior: smooth-scroll on home page, route links on other pages
