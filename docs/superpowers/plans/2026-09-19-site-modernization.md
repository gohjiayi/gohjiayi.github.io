# Site Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize gohjiayi.github.io from a single-page React 17 + Chakra UI v1 portfolio into a multi-page site with Tailwind CSS, React Router, and dedicated writing/speaking pages.

**Architecture:** React 18 SPA with client-side routing via React Router v6. Tailwind CSS replaces Chakra UI for styling. Three routes: `/` (home with scrollable sections), `/writing`, `/speaking`. GitHub Pages SPA support via 404.html redirect. Dark mode via Tailwind `dark:` class strategy with localStorage persistence.

**Tech Stack:** React 18, Tailwind CSS 3, React Router v6, Vite 7, FontAwesome icons (retained), Google Analytics via gtag.js

**Spec:** `docs/superpowers/specs/2026-09-19-site-modernization-design.md`

## Global Constraints

- Branch: `site-modernization`
- Retain existing content from `public/resumeData.json` — no data loss
- Keep FontAwesome icon libraries (`@fortawesome/*`) — do not replace
- Keep Vite 7 as build tool — no changes to build system beyond Tailwind/PostCSS plugins
- Google Fonts loaded via `index.html`: Inter (body) + Playfair Display (headings)
- Brand accent color: `#c02559` (rose/pink) with full 50–900 scale
- Max content width: `max-w-5xl` (1024px) for main content sections
- All external links open in new tab (`target="_blank" rel="noopener noreferrer"`)
- Mobile breakpoint: Tailwind's default `md:` (768px) for responsive layouts

---

### Task 1: Install dependencies and configure build toolchain

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/styles/index.css`
- Modify: `src/index.jsx`

**Interfaces:**
- Consumes: nothing
- Produces: Tailwind CSS available globally via utility classes in any `.jsx` file. React 18 `createRoot` API active. ChakraProvider still wraps the app (temporary — removed in Task 5).

- [ ] **Step 1: Install new dependencies**

```bash
npm install react@^18.3.1 react-dom@^18.3.1 react-router-dom@^6.28.0
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
```

- [ ] **Step 2: Create `tailwind.config.js`**

Create at project root:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ffe6ef',
          100: '#fbd0e0',
          200: '#f7bcd0',
          300: '#ee8fb0',
          400: '#e46290',
          500: '#c02559',
          600: '#a41f4c',
          700: '#87193f',
          800: '#6b1332',
          900: '#4f0d25',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Create `postcss.config.js`**

Create at project root:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Create `src/styles/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

::selection {
  background-color: #f7bcd0;
  color: #1f1f1f;
}
```

- [ ] **Step 5: Update `src/index.jsx` to React 18 createRoot + import Tailwind CSS**

Replace the full contents of `src/index.jsx`:

```jsx
import { createRoot } from 'react-dom/client';
import App from './App';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import theme from './theme';
import './styles/index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <CSSReset />
    <App />
  </ChakraProvider>
);
```

- [ ] **Step 6: Verify build succeeds and existing site still works**

```bash
npm run build
npm run dev
```

Open `http://localhost:5173` in a browser. All four sections (Home, About, Resume, Projects) should render exactly as before. The Tailwind directives are loaded but not yet used by any component. Check the browser console for errors — there should be none.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js postcss.config.js src/styles/index.css src/index.jsx package.json package-lock.json
git commit -m "chore: install React 18, Tailwind CSS 3, React Router v6

Upgrade React 17→18 with createRoot API. Add Tailwind CSS with brand
color palette and PostCSS config. Add react-router-dom for upcoming
multi-page routing. Existing Chakra UI components still functional."
```

---

### Task 2: Layout shell — Routing, Navbar, Footer, SocialLinks, DarkModeToggle, SEO

**Files:**
- Create: `src/hooks/useScrollSpy.js`
- Create: `src/components/shared/DarkModeToggle.jsx`
- Create: `src/components/shared/SocialLinks.jsx`
- Create: `src/components/layout/SEO.jsx`
- Create: `src/components/layout/Navbar.jsx`
- Create: `src/components/layout/Footer.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.jsx`
- Create: `public/404.html`
- Modify: `index.html`

**Interfaces:**
- Consumes: `resumeData.json` structure (fetched in App.jsx, passed as props)
- Produces:
  - `useScrollSpy(ids: string[]): string` — returns the ID of the currently visible section
  - `<DarkModeToggle />` — self-contained toggle button, reads/writes `localStorage.theme`
  - `<SocialLinks social={object} />` — renders social icon row from data
  - `<SEO title={string} description={string} url={string} />` — sets document head meta tags
  - `<Navbar data={object} />` — persistent top nav with scroll spy + route awareness
  - `<Footer data={object} />` — shared footer with social links + copyright
  - App.jsx exports route structure: `/` renders home sections, `/writing` and `/speaking` render placeholder divs (built in Tasks 6–7)

- [ ] **Step 1: Create `src/hooks/useScrollSpy.js`**

```js
import { useState, useEffect, useRef } from 'react';

export default function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0] || '');
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    if (!idsRef.current.length) return;

    let ticking = false;

    const calc = () => {
      const sectionIds = idsRef.current;
      const offset = 100;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - offset) {
          current = id;
        }
      }
      setActiveId(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calc);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    calc();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return activeId;
}
```

- [ ] **Step 2: Create `src/components/shared/DarkModeToggle.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <FontAwesomeIcon icon={dark ? faSun : faMoon} className="w-5 h-5" />
    </button>
  );
}
```

Note: This requires adding `faSun` and `faMoon` to the FontAwesome library. Update the library registration in App.jsx (done in Step 7).

- [ ] **Step 3: Create `src/components/shared/SocialLinks.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faMedium, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export default function SocialLinks({ social, className = '' }) {
  if (!social) return null;

  const items = [
    { key: 'linkedin', href: social.linkedin, icon: faLinkedin, label: 'LinkedIn' },
    { key: 'github', href: social.github, icon: faGithub, label: 'GitHub' },
    { key: 'x', href: social.x, icon: faXTwitter, label: 'X' },
    { key: 'medium', href: social.medium, icon: faMedium, label: 'Medium' },
    { key: 'scholar', href: social.googlescholar, icon: faGraduationCap, label: 'Google Scholar' },
    { key: 'email', href: social.email ? `mailto:${social.email}` : null, icon: faEnvelope, label: 'Email' },
  ].filter(i => i.href);

  return (
    <div className={`flex items-center justify-center gap-3 md:gap-4 flex-wrap ${className}`}>
      {items.map(({ key, href, icon, label }) => (
        <a
          key={key}
          href={href}
          target={key === 'email' ? undefined : '_blank'}
          rel={key === 'email' ? undefined : 'noopener noreferrer'}
          aria-label={label}
          className="p-2 rounded-full text-gray-400 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-300 hover:-translate-y-0.5 transition-all duration-200"
        >
          <FontAwesomeIcon icon={icon} className="w-5 h-5 md:w-6 md:h-6" />
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/layout/SEO.jsx`**

```jsx
import { useEffect } from 'react';

const BASE_URL = 'https://gohjiayi.github.io';
const DEFAULT_TITLE = 'Goh Jia Yi, Jesa';
const DEFAULT_DESC = 'Applied AI engineer focused on LLM safety, evaluation, and guardrails.';
const DEFAULT_IMAGE = `${BASE_URL}/images/profile.jpg`;

export default function SEO({ title, description, url, image }) {
  const fullTitle = title ? `${title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', ogImage);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
  }, [fullTitle, desc, pageUrl, ogImage]);

  return null;
}
```

- [ ] **Step 5: Create `src/components/layout/Navbar.jsx`**

```jsx
import { useState, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import useScrollSpy from '../../hooks/useScrollSpy';
import DarkModeToggle from '../shared/DarkModeToggle';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', section: true },
  { id: 'about', label: 'About', section: true },
  { id: 'resume', label: 'Resume', section: true },
  { id: 'projects', label: 'Projects', section: true },
  { id: 'writing', label: 'Writing', href: '/writing' },
  { id: 'speaking', label: 'Speaking', href: '/speaking' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const sectionIds = isHome ? ['home', 'about', 'resume', 'projects'] : [];
  const activeSection = useScrollSpy(sectionIds);

  const getActiveId = () => {
    if (isHome) return activeSection;
    const path = location.pathname.slice(1);
    return path || 'home';
  };

  const activeId = getActiveId();

  const handleSectionClick = useCallback((e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    if (isHome) {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      if (id !== 'home') {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [isHome, navigate]);

  const handleRouteClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const linkClasses = (id) => {
    const isActive = activeId === id;
    return `text-xs tracking-widest uppercase transition-colors duration-200 ${
      isActive
        ? 'text-brand-400'
        : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-12">
        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6 mx-auto">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              {item.section ? (
                <a
                  href={`#${item.id}`}
                  className={linkClasses(item.id)}
                  onClick={(e) => handleSectionClick(e, item.id)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className={linkClasses(item.id)}
                  onClick={handleRouteClick}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Dark mode toggle - desktop */}
        <div className="hidden md:block absolute right-4">
          <DarkModeToggle />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center justify-between w-full">
          <DarkModeToggle />
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-white hover:text-brand-300 transition-colors"
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <ul className="py-2">
            {NAV_ITEMS.map(item => (
              <li key={`m-${item.id}`}>
                {item.section ? (
                  <a
                    href={`#${item.id}`}
                    className={`block px-4 py-3 text-sm ${
                      activeId === item.id
                        ? 'text-brand-300 bg-white/5'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    } transition-colors`}
                    onClick={(e) => handleSectionClick(e, item.id)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={`block px-4 py-3 text-sm ${
                      activeId === item.id
                        ? 'text-brand-300 bg-white/5'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    } transition-colors`}
                    onClick={handleRouteClick}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 6: Create `src/components/layout/Footer.jsx`**

```jsx
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import SocialLinks from '../shared/SocialLinks';

export default function Footer({ data }) {
  if (!data) return null;

  const location = useLocation();
  const social = data.social || {};
  const year = new Date().getFullYear();

  const handleBackToTop = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gray-900 dark:bg-black text-center py-12">
      <div className="max-w-5xl mx-auto px-4">
        <SocialLinks social={social} />
        <p className="mt-4 text-sm text-gray-500">
          &copy; {year}{' '}
          <a
            href={social.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-400 transition-colors"
          >
            Goh Jia Yi, Jesa
          </a>
        </p>
      </div>

      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <button
          onClick={handleBackToTop}
          aria-label="Back to top"
          className="w-10 h-10 rounded-full bg-gray-700 text-white hover:bg-brand-500 transition-colors flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Rewrite `src/App.jsx` with routing and new layout**

Replace the full contents of `src/App.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SEO from './components/layout/SEO';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCode, faBrain, faRocket, faCloud, faCube, faLayerGroup,
  faCubes, faUserTie, faHandshake, faUserFriends,
  faSun, faMoon, faBars, faXmark, faChevronUp, faChevronDown,
  faArrowUpRightFromSquare, faDownload,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCode, faBrain, faRocket, faCloud, faCube, faLayerGroup,
  faCubes, faUserTie, faHandshake, faUserFriends,
  faSun, faMoon, faBars, faXmark, faChevronUp, faChevronDown,
  faArrowUpRightFromSquare, faDownload,
);

function HomePage({ data }) {
  return (
    <>
      <SEO />
      {/* Sections will be added in Tasks 3–4. Temporary placeholders: */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-serif font-bold">{data?.name || 'Loading...'}</h1>
          <p className="mt-3 text-lg text-gray-300">{data?.headline || ''}</p>
        </div>
      </section>
      <section id="about" className="py-20 scroll-mt-20 bg-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-brand-300 mb-4">About</h2>
          <p>{data?.bio?.[0] || ''}</p>
        </div>
      </section>
      <section id="resume" className="py-20 scroll-mt-20 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Resume</h2>
          <p>Resume section — replaced in Task 4</p>
        </div>
      </section>
      <section id="projects" className="py-20 scroll-mt-20 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <p>Projects section — replaced in Task 4</p>
        </div>
      </section>
    </>
  );
}

function WritingPage() {
  return (
    <>
      <SEO title="Writing" description="Articles and features by Goh Jia Yi" url="/writing" />
      <div className="min-h-screen pt-20 pb-12 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Writing</h1>
          <p className="mt-2 text-gray-500">Coming in Task 6</p>
        </div>
      </div>
    </>
  );
}

function SpeakingPage() {
  return (
    <>
      <SEO title="Speaking" description="Talks and presentations by Goh Jia Yi" url="/speaking" />
      <div className="min-h-screen pt-20 pb-12 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Speaking</h1>
          <p className="mt-2 text-gray-500">Coming in Task 7</p>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/resumeData.json', { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage data={data.main} resumeData={data.resume} showcaseData={data.showcase} />} />
        <Route path="/writing" element={<WritingPage data={data.writing} />} />
        <Route path="/speaking" element={<SpeakingPage data={data.speaking} />} />
      </Routes>
      <Footer data={data.main} />
    </>
  );
}
```

- [ ] **Step 8: Update `src/index.jsx` — add BrowserRouter, remove ChakraProvider**

Replace the full contents of `src/index.jsx`:

```jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

- [ ] **Step 9: Create `public/404.html` for GitHub Pages SPA routing**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Goh Jia Yi, Jesa</title>
    <script>
      // Single Page App redirect for GitHub Pages
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 10: Add SPA redirect script to `index.html`**

Add this script inside `<head>`, before the `<title>` tag in `index.html`:

```html
    <!-- SPA redirect handler for GitHub Pages -->
    <script>
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&');
          }).join('?');
          window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location));
    </script>
```

Also update the `<body>` background to prevent flash of white on dark mode. Add to the `<body>` tag:

```html
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
```

And add a dark-mode initialization script at the top of `<head>` (before any stylesheets) to prevent flash:

```html
    <script>
      (function() {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
```

- [ ] **Step 11: Verify routing, navbar, footer, and dark mode all work**

```bash
npm run dev
```

Open `http://localhost:5173`:
1. The new Navbar should render at the top (fixed, dark background, translucent)
2. Home page shows placeholder sections with temporary content
3. Clicking "Writing" in nav should navigate to `/writing` — shows placeholder text
4. Clicking "Speaking" in nav should navigate to `/speaking` — shows placeholder text
5. Clicking "Home" on `/writing` should return to `/`
6. Clicking "About" on `/writing` should navigate to `/#about` and scroll to the About section
7. Dark mode toggle should switch colors (light ↔ dark)
8. Dark mode preference should persist on page reload (check localStorage)
9. Mobile: hamburger menu opens/closes, nav links work
10. Check page `<title>` changes on route: "Goh Jia Yi, Jesa" on home, "Writing — Goh Jia Yi, Jesa" on /writing

- [ ] **Step 12: Commit**

```bash
git add src/ public/404.html index.html
git commit -m "feat: add routing, navbar, footer, dark mode, and SEO

Replace anchor-based navigation with React Router v6. New Tailwind-based
Navbar with scroll spy on home page and route-aware active states. Dark
mode toggle persisted to localStorage. SEO component sets per-page meta
tags and Open Graph data. SPA 404.html redirect for GitHub Pages."
```

---

### Task 3: Home page — Hero and About sections

**Files:**
- Create: `src/components/home/Hero.jsx`
- Create: `src/components/home/About.jsx`
- Modify: `src/App.jsx` — replace placeholder sections with new components

**Interfaces:**
- Consumes: `data.main` from resumeData.json (name, headline, bio, image, social, resumedownload)
- Produces:
  - `<Hero data={object} />` — full-viewport hero with name, headline, social links, scroll indicator
  - `<About data={object} />` — two-column bio section with photo and resume download

- [ ] **Step 1: Create `src/components/home/Hero.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SocialLinks from '../shared/SocialLinks';

export default function Hero({ data }) {
  if (!data) return null;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: "url('/images/background.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/70 to-gray-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(192,37,89,0.25),_transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="text-center px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
          {data.name}
        </h1>
        {data.headline && (
          <p className="mt-4 text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            {data.headline}
          </p>
        )}
        <hr className="w-3/5 md:w-2/5 mx-auto my-6 border-white/20" />
        <SocialLinks social={data.social} />
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 hover:text-brand-300 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <FontAwesomeIcon icon={faChevronDown} className="w-6 h-6" />
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/home/About.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default function About({ data }) {
  if (!data) return null;

  const profileSrc = `images/${data.image}`;
  const resumeHref = `files/${data.resumedownload}`;
  const bio = data.bio || [];

  return (
    <section
      id="about"
      className="py-16 md:py-20 scroll-mt-20 bg-gray-800 dark:bg-gray-900"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
          <img
            src={profileSrc}
            alt="Goh Jia Yi, Jesa"
            className="w-36 h-36 rounded-full object-cover shrink-0 hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h2 className="text-lg font-semibold text-brand-200 border-b-[3px] border-brand-500 inline-block pb-1 mb-4">
              About
            </h2>
            {bio.map((paragraph, i) => (
              <p key={i} className="text-white leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-brand-200 rounded-md hover:bg-brand-200 hover:text-gray-900 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faDownload} />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire Hero and About into `App.jsx`**

In `src/App.jsx`, add imports at the top (after existing imports):

```jsx
import Hero from './components/home/Hero';
import About from './components/home/About';
```

Replace the `HomePage` function with:

```jsx
function HomePage({ data, resumeData, showcaseData }) {
  return (
    <>
      <SEO />
      <Hero data={data} />
      <About data={data} />
      <section id="resume" className="py-20 scroll-mt-20 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Resume</h2>
          <p>Resume section — replaced in Task 4</p>
        </div>
      </section>
      <section id="projects" className="py-20 scroll-mt-20 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <p>Projects section — replaced in Task 4</p>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify Hero and About render correctly**

```bash
npm run dev
```

Open `http://localhost:5173`:
1. **Hero section** fills the viewport with the background image (grayscale with gradient overlay and subtle brand tint)
2. Name "Goh Jia Yi, Jesa" in large serif font, centered
3. Headline text below the name
4. Social icons row (LinkedIn, GitHub, X, Medium, Scholar, Email) — clickable, hover lifts
5. Horizontal rule separates name/headline from social icons
6. Chevron-down scroll indicator at the bottom — clicking scrolls to About
7. **About section** has dark background, profile photo (round) on the left, bio text on the right
8. "Download Resume" button with download icon — clicking opens the PDF
9. **Dark mode:** Hero stays dark (image-based). About section adjusts to darker bg.
10. **Mobile:** Photo stacks above bio text. Social icons wrap.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/Hero.jsx src/components/home/About.jsx src/App.jsx
git commit -m "feat: add Hero and About sections with Tailwind

Full-viewport hero with background image, brand gradient overlay, name,
headline, and social links. About section with profile photo, bio, and
resume download button. Both responsive and dark-mode aware."
```

---

### Task 4: Home page — Resume and Projects sections

**Files:**
- Create: `src/components/home/Resume.jsx`
- Create: `src/components/home/Projects.jsx`
- Modify: `src/App.jsx` — replace remaining placeholder sections

**Interfaces:**
- Consumes:
  - `resumeData` from `data.resume` — education array, work array, technicalskills array, softskills array
  - `showcaseData` from `data.showcase` — items array with title, summary, image, date, type, tags, links
- Produces:
  - `<Resume data={object} />` — experience timeline, education, skills grid
  - `<Projects data={object} />` — card grid with category badges, tags, and external links

- [ ] **Step 1: Create `src/components/home/Resume.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Resume({ data }) {
  if (!data) return null;

  const work = data.work || [];
  const education = data.education || [];
  const technicalSkills = data.technicalskills || [];
  const softSkills = data.softskills || [];

  return (
    <section
      id="resume"
      className="py-16 md:py-20 scroll-mt-20 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Experience */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 mb-10">
          <div>
            <h2 className="text-lg font-semibold">
              <span className="border-b-[3px] border-brand-500 pb-1">Experience</span>
            </h2>
          </div>
          <div className="md:col-span-3 space-y-10">
            {work.map((job, i) => (
              <div key={`${job.company}-${i}`} className="flex gap-4">
                <div className="flex flex-col items-center pt-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(192,37,89,0.15),0_0_14px_rgba(192,37,89,0.35)]" />
                  {i < work.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-600 mt-2" />}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{job.title}</h3>
                  <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                    {job.company} &bull; {job.location} &bull; {job.years}
                  </p>
                  <ul className="mt-2 space-y-1.5 list-disc pl-5">
                    {(job.description || []).map((line, j) => (
                      <li key={j} className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-600" />

        {/* Education */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 mb-10">
          <div>
            <h2 className="text-lg font-semibold">
              <span className="border-b-[3px] border-brand-500 pb-1">Education</span>
            </h2>
          </div>
          <div className="md:col-span-3 space-y-8">
            {education.map((edu) => (
              <div key={edu.school}>
                <h3 className="text-base font-semibold">{edu.school}</h3>
                <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                  {edu.degree} &bull; {edu.graduated}
                </p>
                {edu.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{edu.description}</p>
                )}
                {edu.activities && (
                  <div className="mt-1 pl-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-400">Activities and Societies</p>
                    <ul className="list-disc pl-4">
                      {(Array.isArray(edu.activities) ? edu.activities : String(edu.activities).split(/;\s*/))
                        .map((activity, j) => (
                          <li key={j} className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{activity}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-600" />

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
          <div>
            <h2 className="text-lg font-semibold">
              <span className="border-b-[3px] border-brand-500 pb-1">Skills</span>
            </h2>
          </div>
          <div className="md:col-span-3 space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((s) => (
                  <span
                    key={s.skill}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-pink-50 text-brand-700 border border-pink-100 dark:bg-brand-900/30 dark:text-brand-200 dark:border-brand-800"
                  >
                    <FontAwesomeIcon icon={['fas', s.icon]} className="w-3.5 h-3.5" />
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((s) => (
                  <span
                    key={s.skill}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-pink-50 text-brand-700 border border-pink-100 dark:bg-brand-900/30 dark:text-brand-200 dark:border-brand-800"
                  >
                    <FontAwesomeIcon icon={['fas', s.icon]} className="w-3.5 h-3.5" />
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/home/Projects.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { faLink, faCode, faArrowUpRightFromSquare, faPaperclip, faVideo } from '@fortawesome/free-solid-svg-icons';

function resolveImage(img) {
  if (!img) return null;
  return img.startsWith('images/') ? img : `images/${img}`;
}

function getCategoryBadges(item) {
  let types = [];
  if (Array.isArray(item.types)) types = item.types;
  else if (Array.isArray(item.type)) types = item.type;
  else if (typeof item.type === 'string') types = item.type.split(',').map(s => s.trim());
  types = types.map(t => t.toLowerCase()).filter(Boolean);

  const colorMap = {
    project: 'bg-green-500',
    talk: 'bg-yellow-400',
    'tech talk': 'bg-yellow-400',
    hackathon: 'bg-orange-400',
  };
  const labelMap = {
    project: 'Project',
    talk: 'Tech Talk',
    'tech talk': 'Tech Talk',
    hackathon: 'Hackathon',
  };

  return types.map(t => ({
    label: labelMap[t] || t.charAt(0).toUpperCase() + t.slice(1),
    bg: colorMap[t] || 'bg-green-500',
  }));
}

function getLinkIcon(label, url) {
  const l = (label || '').toLowerCase();
  const u = (url || '').toLowerCase();
  if (l.includes('github') || u.includes('github.com')) return faGithub;
  if (l.includes('medium') || u.includes('medium.com')) return faMedium;
  if (l.includes('slide')) return faPaperclip;
  if (l.includes('video')) return faVideo;
  if (l.includes('code') || l.includes('repo') || l.includes('source')) return faCode;
  if (l.includes('demo') || l.includes('live')) return faArrowUpRightFromSquare;
  return faLink;
}

export default function Projects({ data }) {
  if (!data) return null;

  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <section
      id="projects"
      className="py-16 md:py-20 scroll-mt-20 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-lg font-semibold mb-6">
          <span className="border-b-[3px] border-brand-500 pb-1">Featured Work</span>
        </h2>

        <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(2, items.length)} lg:grid-cols-${items.length === 4 ? 2 : 3} gap-4`}>
          {items.map((item, idx) => {
            const src = resolveImage(item.image);
            const badges = getCategoryBadges(item);
            const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
            const links = Array.isArray(item.links) ? item.links : [];

            return (
              <div
                key={`${item.title}-${idx}`}
                className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-500 transition-all duration-200 overflow-hidden"
              >
                {/* Category badges */}
                {badges.length > 0 && (
                  <div className="absolute top-2 left-2 z-10 flex gap-1.5">
                    {badges.map((b, i) => (
                      <span key={i} className={`${b.bg} text-white text-xs font-semibold px-2 py-0.5 rounded`}>
                        {b.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Image */}
                {src ? (
                  <div className="aspect-video">
                    <img src={src} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    No image
                  </div>
                )}

                {/* Content */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
                  {item.date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.date}</p>
                  )}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.summary && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{item.summary}</p>
                  )}

                  {links.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {links.map((lnk, i) => (
                        <a
                          key={i}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                        >
                          <span className="w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center group-hover:bg-brand-500 group-hover:-translate-y-0.5 transition-all duration-200">
                            <FontAwesomeIcon icon={getLinkIcon(lnk.label, lnk.url)} className="w-3 h-3" />
                          </span>
                          <span className="text-xs group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                            {lnk.label || 'Link'}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire Resume and Projects into `App.jsx`**

Add imports to `src/App.jsx`:

```jsx
import Resume from './components/home/Resume';
import Projects from './components/home/Projects';
```

Replace the `HomePage` function:

```jsx
function HomePage({ data, resumeData, showcaseData }) {
  return (
    <>
      <SEO />
      <Hero data={data} />
      <About data={data} />
      <Resume data={resumeData} />
      <Projects data={showcaseData} />
    </>
  );
}
```

- [ ] **Step 4: Verify all home page sections render correctly**

```bash
npm run dev
```

Open `http://localhost:5173`:
1. **Resume section** on light gray background (dark mode: dark gray):
   - Experience with timeline dots and connecting lines between entries
   - Education entries with school, degree, dates, activities
   - Technical and soft skills as pill tags with FontAwesome icons
   - Dividers between sections
2. **Projects section** on white background:
   - 2-column card grid (4 items → 2×2 layout)
   - Category badges (Project, Tech Talk, Hackathon) positioned top-left on images
   - Tags as small gray pills below each card title
   - Summary text and external link buttons with icon circles
3. **Dark mode:** All sections adapt — Resume uses darker bg, Projects cards use dark borders
4. **Mobile:** All grids collapse to single column. Timeline, skills, and cards stack vertically.
5. **Scroll spy:** As you scroll through sections, the Navbar active link updates correctly (Home → About → Resume → Projects)

- [ ] **Step 5: Commit**

```bash
git add src/components/home/Resume.jsx src/components/home/Projects.jsx src/App.jsx
git commit -m "feat: add Resume and Projects sections with Tailwind

Resume section with experience timeline, education, and skill tags.
Projects section with card grid, category badges, tags, and external
link buttons. Both responsive and dark-mode aware."
```

---

### Task 5: Remove Chakra UI and old dependencies

**Files:**
- Modify: `package.json` — remove old deps
- Delete: `src/theme.js`
- Delete: `src/components/Header.jsx`
- Delete: `src/components/About.jsx`
- Delete: `src/components/Resume.jsx`
- Delete: `src/components/Showcase.jsx`
- Delete: `src/components/Footer.jsx`
- Delete: `src/components/SocialLinks.jsx`

**Interfaces:**
- Consumes: All new components from Tasks 2–4 are in place
- Produces: Clean dependency tree with no Chakra/Emotion references

- [ ] **Step 1: Remove old component files and theme**

```bash
rm src/theme.js
rm src/components/Header.jsx
rm src/components/About.jsx
rm src/components/Resume.jsx
rm src/components/Showcase.jsx
rm src/components/Footer.jsx
rm src/components/SocialLinks.jsx
```

- [ ] **Step 2: Remove old dependencies from `package.json`**

Remove these from `dependencies`:
- `@chakra-ui/react`
- `@chakra-ui/icons`
- `@emotion/react`
- `@emotion/styled`
- `framer-motion`
- `react-awesome-reveal`
- `react-ga`

Remove the entire `overrides` section from `package.json`.

The final `dependencies` should be:

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.5.1",
    "@fortawesome/free-brands-svg-icons": "^6.5.1",
    "@fortawesome/free-solid-svg-icons": "^6.5.1",
    "@fortawesome/react-fontawesome": "^0.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  }
}
```

- [ ] **Step 3: Reinstall to clean lockfile**

```bash
npm install
```

- [ ] **Step 4: Add Google Analytics via gtag.js**

The old site used `react-ga` (GA3 wrapper) with a GA4 tracking ID `G-NB3EJY8KJL`. Replace with a standard gtag.js snippet.

Add to `index.html` inside `<head>`, after the fonts link:

```html
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NB3EJY8KJL"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NB3EJY8KJL');
    </script>
```

Remove the `define` block from `vite.config.js` since we no longer need `process.env.REACT_APP_GA_TRACKING_ID`. The updated `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  publicDir: 'public',
})
```

- [ ] **Step 5: Verify build succeeds with no Chakra references**

```bash
npm run build
```

The build should succeed with no errors. Then:

```bash
grep -r "chakra" src/ --include="*.jsx" --include="*.js"
grep -r "@emotion" src/ --include="*.jsx" --include="*.js"
grep -r "react-awesome-reveal" src/ --include="*.jsx" --include="*.js"
grep -r "react-ga" src/ --include="*.jsx" --include="*.js"
```

All grep commands should return no results.

- [ ] **Step 6: Verify site still works end-to-end**

```bash
npm run dev
```

Open `http://localhost:5173`:
1. All sections render correctly — Hero, About, Resume, Projects
2. Navigation works — smooth scroll on home, routing to /writing and /speaking
3. Dark mode toggle works
4. No console errors
5. Build output is smaller (check `npm run build` output for bundle size)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove Chakra UI, Emotion, and legacy dependencies

Remove @chakra-ui/react, @chakra-ui/icons, @emotion/react,
@emotion/styled, framer-motion, react-awesome-reveal, and react-ga.
Migrate Google Analytics to gtag.js snippet. All components now use
Tailwind CSS exclusively."
```

---

### Task 6: Writing page

**Files:**
- Modify: `public/resumeData.json` — add `writing` key with placeholder data
- Create: `src/components/shared/TagFilter.jsx`
- Create: `src/components/shared/StatsLine.jsx`
- Create: `src/components/writing/ArticleCard.jsx`
- Create: `src/components/writing/FeaturedCard.jsx`
- Create: `src/components/writing/WritingPage.jsx`
- Modify: `src/App.jsx` — wire WritingPage into /writing route

**Interfaces:**
- Consumes: `data.writing` from resumeData.json with `authored[]` and `featured[]` arrays
- Produces:
  - `<TagFilter tags={string[]} active={string} onChange={fn} />` — clickable tag pills, "All" default
  - `<StatsLine items={Array<{label: string, count: number}>} />` — "X articles, Y features" line
  - `<ArticleCard article={object} />` — rich card for authored articles
  - `<FeaturedCard article={object} />` — rich card for featured/press items
  - `<WritingPage data={object} />` — full page with stats, filters, and both sections

- [ ] **Step 1: Add writing data to `public/resumeData.json`**

Add a `"writing"` key at the top level of `resumeData.json` (after `"showcase"`):

```json
  "writing": {
    "authored": [
      {
        "title": "Building a Safety Testing Framework for Government LLM Applications",
        "date": "2025-07-10",
        "publication": "Medium",
        "summary": "How we designed a standardised safety evaluation framework covering risk taxonomy, benchmark construction, automated judging, and quantitative scoring for real-world chatbot deployments.",
        "tags": ["LLM Safety", "Evaluation", "AI Governance"],
        "url": "https://medium.com/@gohjiayi",
        "image": "images/featured/icml.jpeg"
      },
      {
        "title": "Practical Guardrails for LLM Applications",
        "date": "2025-03-15",
        "publication": "Medium",
        "summary": "A hands-on guide to building scalable custom guardrail workflows, from synthetic dataset generation to training and evaluation.",
        "tags": ["LLM Safety", "Guardrails", "MLOps"],
        "url": "https://medium.com/@gohjiayi",
        "image": ""
      }
    ],
    "featured": [
      {
        "title": "How Singapore is Testing AI Safety in Government",
        "date": "2025-08-20",
        "publication": "GovInsider",
        "context": "Quoted on the LLM safety evaluation framework for government applications",
        "url": "https://govinsider.asia",
        "image": ""
      }
    ]
  }
```

Note: These are placeholder entries. The user will replace URLs and details with real data.

- [ ] **Step 2: Create `src/components/shared/TagFilter.jsx`**

```jsx
export default function TagFilter({ tags, active, onChange }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('All')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          active === 'All'
            ? 'bg-brand-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            active === tag
              ? 'bg-brand-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/shared/StatsLine.jsx`**

```jsx
export default function StatsLine({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {items
        .filter(i => i.count > 0)
        .map(i => `${i.count} ${i.label}`)
        .join(' · ')}
    </p>
  );
}
```

- [ ] **Step 4: Create `src/components/writing/ArticleCard.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ArticleCard({ article }) {
  const { title, date, publication, summary, tags, url, image } = article;
  const hasImage = image && image.trim() !== '';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500 transition-all duration-200"
    >
      <div className={`flex flex-col ${hasImage ? 'sm:flex-row' : ''}`}>
        {hasImage && (
          <div className="sm:w-48 shrink-0">
            <div className="aspect-video sm:aspect-auto sm:h-full">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
              {title}
            </h3>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 shrink-0 mt-1 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              {publication}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
          </div>
          {summary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
              {summary}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
```

- [ ] **Step 5: Create `src/components/writing/FeaturedCard.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function FeaturedCard({ article }) {
  const { title, date, publication, context, url, image } = article;
  const hasImage = image && image.trim() !== '';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500 transition-all duration-200"
    >
      <div className={`flex flex-col ${hasImage ? 'sm:flex-row' : ''}`}>
        {hasImage && (
          <div className="sm:w-48 shrink-0">
            <div className="aspect-video sm:aspect-auto sm:h-full">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
              {title}
            </h3>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 shrink-0 mt-1 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              {publication}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
          </div>
          {context && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              {context}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
```

- [ ] **Step 6: Create `src/components/writing/WritingPage.jsx`**

```jsx
import { useState, useMemo } from 'react';
import SEO from '../layout/SEO';
import StatsLine from '../shared/StatsLine';
import TagFilter from '../shared/TagFilter';
import ArticleCard from './ArticleCard';
import FeaturedCard from './FeaturedCard';

export default function WritingPage({ data }) {
  const [activeTag, setActiveTag] = useState('All');

  const authored = data?.authored || [];
  const featured = data?.featured || [];

  const allTags = useMemo(() => {
    const tagSet = new Set();
    authored.forEach(a => (a.tags || []).forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [authored]);

  const filteredAuthored = useMemo(() => {
    if (activeTag === 'All') return authored;
    return authored.filter(a => (a.tags || []).includes(activeTag));
  }, [authored, activeTag]);

  const sortedAuthored = useMemo(
    () => [...filteredAuthored].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filteredAuthored]
  );

  const sortedFeatured = useMemo(
    () => [...featured].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [featured]
  );

  return (
    <>
      <SEO title="Writing" description="Articles and features by Goh Jia Yi" url="/writing" />
      <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">
              Writing
            </h1>
            <div className="mt-2">
              <StatsLine items={[
                { label: authored.length === 1 ? 'article' : 'articles', count: authored.length },
                { label: featured.length === 1 ? 'feature' : 'features', count: featured.length },
              ]} />
            </div>
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="mb-8">
              <TagFilter tags={allTags} active={activeTag} onChange={setActiveTag} />
            </div>
          )}

          {/* Authored articles */}
          {sortedAuthored.length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <span className="border-b-[3px] border-brand-500 pb-1">Articles</span>
              </h2>
              <div className="space-y-4">
                {sortedAuthored.map((article, i) => (
                  <ArticleCard key={`${article.title}-${i}`} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Featured in */}
          {sortedFeatured.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <span className="border-b-[3px] border-amber-500 pb-1">Featured In</span>
              </h2>
              <div className="space-y-4">
                {sortedFeatured.map((article, i) => (
                  <FeaturedCard key={`${article.title}-${i}`} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 7: Wire WritingPage into `App.jsx`**

In `src/App.jsx`, add import:

```jsx
import WritingPage from './components/writing/WritingPage';
```

Replace the inline `WritingPage` function definition that currently returns a placeholder. Update the `/writing` route element:

```jsx
<Route path="/writing" element={<WritingPage data={data.writing} />} />
```

Remove the old inline `function WritingPage()` placeholder from App.jsx.

- [ ] **Step 8: Verify writing page works**

```bash
npm run dev
```

Navigate to `http://localhost:5173/writing`:
1. Page title in browser tab: "Writing — Goh Jia Yi, Jesa"
2. Stats line shows "2 articles · 1 feature"
3. Tag filter bar shows "All", "LLM Safety", "Evaluation", "AI Governance", "Guardrails", "MLOps"
4. Clicking a tag (e.g., "LLM Safety") filters the articles list — only matching articles shown
5. Clicking "All" resets the filter
6. **Articles section:** Cards with title, publication badge (pink), date, summary, tags, external link icon. The first card has a thumbnail image (side-by-side layout on desktop).
7. **Featured In section:** Cards with amber/gold publication badge instead of pink. Context text in italics.
8. Clicking any card opens the URL in a new tab
9. **Dark mode:** Background switches, card borders/colors adapt
10. **Mobile:** Cards stack vertically. Images go above text content.
11. Navbar "Writing" link is highlighted with accent color

- [ ] **Step 9: Commit**

```bash
git add src/components/shared/TagFilter.jsx src/components/shared/StatsLine.jsx \
       src/components/writing/ src/App.jsx public/resumeData.json
git commit -m "feat: add Writing page with articles and featured sections

Writing page at /writing with stats line, tag filtering, authored
article cards and featured-in cards. Placeholder writing data added
to resumeData.json. Tag filter pills with active state. Cards have
publication badges, dates, summaries, and external link indicators."
```

---

### Task 7: Speaking page

**Files:**
- Modify: `public/resumeData.json` — add `speaking` key with placeholder data
- Create: `src/components/speaking/TalkCard.jsx`
- Create: `src/components/speaking/SpeakingPage.jsx`
- Modify: `src/App.jsx` — wire SpeakingPage into /speaking route

**Interfaces:**
- Consumes: `data.speaking` array from resumeData.json
- Produces:
  - `<TalkCard talk={object} />` — rich card for a talk/presentation
  - `<SpeakingPage data={array} />` — full page with stats, filters, and talk cards

- [ ] **Step 1: Add speaking data to `public/resumeData.json`**

Add a `"speaking"` key at the top level (after `"writing"`):

```json
  "speaking": [
    {
      "title": "Safety Testing Framework for LLM Applications",
      "event": "ICML 2025 Workshop on Technical AI Governance",
      "date": "2025-07-26",
      "summary": "Oral spotlight presentation on a safety testing framework for government LLM applications, covering risk taxonomy design, benchmark construction, automated judging methods, and quantitative scoring.",
      "tags": ["LLM Safety", "Evaluation", "AI Governance"],
      "url": "https://slideslive.com/39044601",
      "slidesUrl": "",
      "image": "images/featured/icml.jpeg"
    }
  ]
```

- [ ] **Step 2: Create `src/components/speaking/TalkCard.jsx`**

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPaperclip, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TalkCard({ talk }) {
  const { title, event, date, summary, tags, url, slidesUrl, image } = talk;
  const hasImage = image && image.trim() !== '';
  const hasRecording = url && url.trim() !== '';
  const hasSlides = slidesUrl && slidesUrl.trim() !== '';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-500 transition-all duration-200">
      <div className={`flex flex-col ${hasImage ? 'sm:flex-row' : ''}`}>
        {hasImage && (
          <div className="sm:w-48 shrink-0">
            <div className="aspect-video sm:aspect-auto sm:h-full">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="p-4 flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {event}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</span>
          </div>
          {summary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {(hasRecording || hasSlides) && (
            <div className="flex gap-3 mt-3">
              {hasRecording && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center group-hover:bg-brand-500 group-hover:-translate-y-0.5 transition-all duration-200">
                    <FontAwesomeIcon icon={faVideo} className="w-3 h-3" />
                  </span>
                  <span className="text-xs">Recording</span>
                </a>
              )}
              {hasSlides && (
                <a
                  href={slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center group-hover:bg-brand-500 group-hover:-translate-y-0.5 transition-all duration-200">
                    <FontAwesomeIcon icon={faPaperclip} className="w-3 h-3" />
                  </span>
                  <span className="text-xs">Slides</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/speaking/SpeakingPage.jsx`**

```jsx
import { useState, useMemo } from 'react';
import SEO from '../layout/SEO';
import StatsLine from '../shared/StatsLine';
import TagFilter from '../shared/TagFilter';
import TalkCard from './TalkCard';

export default function SpeakingPage({ data }) {
  const [activeTag, setActiveTag] = useState('All');

  const talks = Array.isArray(data) ? data : [];

  const allTags = useMemo(() => {
    const tagSet = new Set();
    talks.forEach(t => (t.tags || []).forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [talks]);

  const filtered = useMemo(() => {
    if (activeTag === 'All') return talks;
    return talks.filter(t => (t.tags || []).includes(activeTag));
  }, [talks, activeTag]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filtered]
  );

  return (
    <>
      <SEO title="Speaking" description="Talks and presentations by Goh Jia Yi" url="/speaking" />
      <div className="min-h-screen pt-20 pb-16 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">
              Speaking
            </h1>
            <div className="mt-2">
              <StatsLine items={[
                { label: talks.length === 1 ? 'talk' : 'talks', count: talks.length },
              ]} />
            </div>
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="mb-8">
              <TagFilter tags={allTags} active={activeTag} onChange={setActiveTag} />
            </div>
          )}

          {/* Talks */}
          {sorted.length > 0 ? (
            <div className="space-y-4">
              {sorted.map((talk, i) => (
                <TalkCard key={`${talk.title}-${i}`} talk={talk} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No talks match this filter.</p>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Wire SpeakingPage into `App.jsx`**

In `src/App.jsx`, add import:

```jsx
import SpeakingPage from './components/speaking/SpeakingPage';
```

Update the `/speaking` route element:

```jsx
<Route path="/speaking" element={<SpeakingPage data={data.speaking} />} />
```

Remove the old inline `function SpeakingPage()` placeholder from App.jsx.

- [ ] **Step 5: Verify speaking page works**

```bash
npm run dev
```

Navigate to `http://localhost:5173/speaking`:
1. Page title: "Speaking — Goh Jia Yi, Jesa"
2. Stats line shows "1 talk"
3. Tag filter bar shows "All", "LLM Safety", "Evaluation", "AI Governance"
4. Talk card shows: title, event name in purple badge, date, summary, tags
5. Recording link button (video icon + "Recording" label) links to SlideLive
6. Clicking the talk's recording link opens in a new tab
7. **Dark mode:** All elements adapt correctly
8. **Mobile:** Card image stacks above content
9. Navbar "Speaking" link is highlighted

- [ ] **Step 6: Commit**

```bash
git add src/components/speaking/ src/App.jsx public/resumeData.json
git commit -m "feat: add Speaking page with talk cards

Speaking page at /speaking with stats line, tag filtering, and talk
cards. Cards show event badge, date, summary, tags, and links to
recording/slides. Placeholder speaking data added to resumeData.json."
```

---

### Task 8: Sitemap, manifest cleanup, and final polish

**Files:**
- Create: `public/sitemap.xml`
- Modify: `public/manifest.json`
- Modify: `src/components/home/Projects.jsx` — fix dynamic grid classes

**Interfaces:**
- Consumes: all components from Tasks 1–7
- Produces: production-ready site with sitemap, corrected manifest, and polished grid

- [ ] **Step 1: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gohjiayi.github.io/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://gohjiayi.github.io/writing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gohjiayi.github.io/speaking</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Update `public/manifest.json`**

Replace the full contents:

```json
{
  "short_name": "Jia Yi",
  "name": "Goh Jia Yi, Jesa — Applied AI Engineer",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#c02559",
  "background_color": "#ffffff"
}
```

- [ ] **Step 3: Fix dynamic grid classes in Projects.jsx**

Tailwind's JIT compiler cannot detect dynamically constructed class names like `` `grid-cols-${n}` ``. Replace the dynamic grid in `src/components/home/Projects.jsx`.

Find the grid div and replace:

```jsx
<div className={`grid grid-cols-1 sm:grid-cols-${Math.min(2, items.length)} lg:grid-cols-${items.length === 4 ? 2 : 3} gap-4`}>
```

With:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

This gives a consistent 1-column mobile, 2-column desktop layout for the 4 showcase items.

- [ ] **Step 4: Run final build and verify**

```bash
npm run build
```

Build should succeed with no warnings. Then:

```bash
npm run dev
```

Final verification checklist:
1. **Home page** (`/`): Hero, About, Resume, Projects all render correctly
2. **Writing page** (`/writing`): Stats, tag filters, article cards, featured cards
3. **Speaking page** (`/speaking`): Stats, tag filters, talk cards
4. **Navigation:** All links work across all three pages
5. **Scroll spy:** Active section updates on home page scroll
6. **Dark mode:** Toggle works, persists across page reload and navigation
7. **Mobile responsive:** Test at 375px width — all layouts stack correctly
8. **External links:** All open in new tabs
9. **SEO:** Inspect page source on each route — `<title>`, `og:*` tags, canonical URL all correct
10. **Console:** No errors or warnings
11. **GitHub Pages routing:** Navigate to `/writing`, hard-refresh — page should render (via 404.html redirect)

- [ ] **Step 5: Commit**

```bash
git add public/sitemap.xml public/manifest.json src/components/home/Projects.jsx
git commit -m "chore: add sitemap, update manifest, fix grid classes

Add sitemap.xml for search engine indexing. Update manifest.json with
correct app name and brand theme color. Fix Projects grid to use static
Tailwind classes instead of dynamic interpolation."
```
