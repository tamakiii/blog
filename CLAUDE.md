# CLAUDE.md

## Project Overview

Personal blog repository deployed to GitHub Pages at blog.tamakiii.com.

## Tech Stack

- **Vite + React + TypeScript** - Client-side rendering
- **react-markdown + remark-gfm** - Markdown rendering
- **React Router** - Client-side routing

## Structure

- `article/` - Source markdown files with frontmatter
- `src/` - React application source
- `script/` - Build scripts (generate-index.ts, generate-pages.ts)
- `docs/` - Generated output (git-ignored)
- `terraform/` - AWS Route53 DNS configuration
- `.github/workflows/deploy.yml` - GitHub Actions deployment

## Build

```bash
make build   # Build production site to docs/
make dev     # Start dev server (via dev.mk)
```

## URL Structure

- `/` - Article list
- `/{locale}/{year}/{mm-dd}/{slug}` - Article page (e.g., `/en_US/2026/01-03/hello`)
- `/tags` - Tag list
- `/tags/{tag}` - Articles by tag

## Article Format

```markdown
---
title: "Title"
date: "2026-01-03"
tags:
  - tag1
---

Content...
```

## Infrastructure

Terraform manages Route53 CNAME record pointing blog.tamakiii.com to tamakiii.github.io.
State stored in S3: `terraform.s3.tamakiii.com/blog/terraform.tfstate`

## Dependencies

Managed by Renovate (renovate.json):
- GitHub Actions versions
- Terraform AWS provider
- npm packages
