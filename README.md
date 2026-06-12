# Zhixian Yang — Academic Homepage

Modern bilingual academic site built with **Astro 6**, content collections, and **Supabase** authenticated comments.

## Stack

- [Astro 6](https://astro.build) — static site + View Transitions
- Content collections — `research`, `ideas`, `blog` (MDX + Zod schema)
- i18n — English at `/`, Chinese at `/zh/`
- [Supabase](https://supabase.com) — magic link / Google auth + Postgres comments (RLS)
- GitHub Pages — deploy via GitHub Actions

## Local development

```bash
npm install
cp .env.example .env   # add Supabase keys when ready
npm run dev
```

Open http://localhost:4321

## Adding content

| Type | Path | Notes |
|------|------|-------|
| Research project | `src/content/research/en/<slug>.mdx` + `zh/` | `translationKey` pairs EN/ZH |
| Research idea | `src/content/ideas/en/<slug>.mdx` | status: seed / exploring / parked |
| Blog post | `src/content/blog/en/<slug>.mdx` | appears in `/rss.xml` (EN) |

Set `draft: true` to hide from build.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor
3. Enable **Email** and **Google** providers under Authentication → Providers
4. Add redirect URLs:
   - `http://localhost:4321/auth/callback`
   - `https://koar-create.github.io/auth/callback`
5. Copy **Project URL** and **anon key** to `.env` (local) and GitHub repo **Secrets**:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`

## Deploy

Push to `main`/`master`. Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes `dist/` to GitHub Pages.

Enable GitHub Pages: **Settings → Pages → Source: GitHub Actions**.

## Project structure

```
src/
  content/          # research, ideas, blog (en/zh MDX)
  components/       # Nav, Sidebar, Comments island, …
  layouts/          # Base, PageLayout, EntryLayout
  lib/              # i18n, content helpers, supabase client
  pages/            # routes (+ zh/ mirror)
public/
  assets/           # images, PDFs
  cafe/             # standalone coffee club pages
```

## Side project

Coffee club static pages live at `/cafe/` (unchanged from previous site).
