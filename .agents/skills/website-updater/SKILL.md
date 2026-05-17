---
name: website-updater
description: Update this website when a new resume PDF is provided. Use this skill to update the resume download filename, extract content from the PDF, refresh `resume.work`, and check with the user before changing other resume-derived sections or structure.
---

# Website Updater

Use this skill to refresh the site from a new resume PDF.

Repo paths:

- Resume files: `public/files/`
- Resume JSON: `public/resumeData.json`
- Download consumer: `src/components/About.jsx`
- PDF extractor: `.agents/skills/website-updater/scripts/extract_pdf_text.js`

## Default behavior

- Update `main.resumedownload` to the new PDF filename.
- Extract text from the new PDF with:

  `node .agents/skills/website-updater/scripts/extract_pdf_text.js "public/files/<resume filename>.pdf"`

- Use the extracted text as the source of truth.
- Update `resume.work` by default.
- Ask the user before updating `main.headline`, `main.bio`, `resume.education`, `resume.technicalskills`, or `resume.softskills`.
- Ask the user before any structural change, schema change, or major reorganisation.

## Resume selection

- Inspect `public/files/` for resume PDFs.
- Use the filename date/version to determine which PDF is newest.
- If only one resume PDF exists, treat it as the current resume.
- If multiple files exist and old vs new is ambiguous, ask the user before editing or deleting anything.

## Workflow

1. Identify the new resume PDF in `public/files/`.
2. Update `public/resumeData.json` so `main.resumedownload` matches that filename exactly.
3. Run `node .agents/skills/website-updater/scripts/extract_pdf_text.js "<pdf-path>"`.
4. Update `resume.work` from the extracted resume text.
5. Ask the user before updating non-experience sections.
6. Ask the user before structural or schema changes.
7. If an older resume PDF is clearly superseded, delete it unless the user asked to keep old copies.

## Guardrails

- Keep `main.resumedownload` as a filename only, not a path.
- Do not claim the PDF cannot be read without first trying `node .agents/skills/website-updater/scripts/extract_pdf_text.js "<pdf-path>"`.
- If extraction fails or is unreliable, ask the user for the missing content instead of assuming no update is needed.
- Do not touch unrelated site content.
- Keep claims grounded in the resume or explicit user instruction.

## Expected output

Report:

- which PDF filename is now referenced
- which old PDF was removed, if any
- whether `resume.work` was updated
- which other sections were left unchanged pending user confirmation
- any assumptions or blockers
