# Agents Guide — gohjiayi.github.io

Personal website built with React + Vite + Tailwind CSS, deployed on GitHub Pages.

## Project Structure

```
public/
  resumeData.json      # Primary data source for all site content
  archivedData.json    # Archived entries (shown when ?archived=true)
  images/              # Static images (profile, project thumbnails)
  files/               # Downloadable files (resume PDF)
src/
  App.jsx              # Router and data fetching
  components/
    home/              # Homepage sections (Landing, About, Resume, Projects, WritingPreview, SpeakingPreview)
    writing/           # /writing page (WritingPage, ArticleCard, PublicationCard)
    speaking/          # /speaking page (SpeakingPage, TalkCard)
    layout/            # Navbar, Footer, SEO
    shared/            # Reusable components (FadeIn, SocialLinks)
  hooks/               # Custom hooks (useScrollSpy, useShowArchived)
  styles/              # Tailwind entry CSS
```

## How to Update Content

All site content lives in `public/resumeData.json`. No code changes needed for content updates.

### Add a blog post / article
Add an entry to `writing.authored[]` (newest first):
```json
{
  "title": "Article Title",
  "date": "YYYY-MM-DD",
  "publication": "blog.ai.gov.sg",
  "summary": "One-line description.",
  "url": "https://...",
  "image": "https://... or empty string"
}
```

### Add a publication
Add an entry to `writing.publications[]`:
```json
{
  "title": "Paper Title",
  "authors": "JY Goh, ...",
  "venue": "Conference/Journal Name",
  "date": "YYYY",
  "url": "https://... or empty string"
}
```

### Add a speaking engagement
Add an entry to `speaking[]` (newest first):
```json
{
  "title": "Talk Title",
  "type": "Talk | Panel | Paper",
  "event": "Event Name",
  "date": "YYYY-MM-DD",
  "summary": "One-line description.",
  "url": "https://... or empty string",
  "image": ""
}
```

### Update resume / work experience
Edit `resume.work[]`, `resume.education[]`, `resume.technicalskills[]`, etc.

### Update bio / social links
Edit `main.bio[]`, `main.social`, `main.headline`.

### Archive content
Move entries from `resumeData.json` to the corresponding section in `public/archivedData.json`. Archived items are auto-stamped with `archived: true` at runtime and only shown when the `?archived=true` query param is set.

## Development

```bash
bun install
bun run dev        # Local dev server
bun run build      # Production build to dist/
```

Deployed via GitHub Pages from the `dist/` folder or GitHub Actions.
