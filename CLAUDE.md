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
  - `src/lib/` - Shared library code (frontmatter parser, article filters)
  - `src/script/` - Build script implementations (testable pure functions)
  - `src/components/` - React components
  - `src/hooks/` - React hooks
- `script/` - Build script entry points (thin wrappers importing from src/script/)
- `docs/` - Generated output (git-ignored)
- `terraform/` - AWS Route53 DNS configuration
- `.github/workflows/deploy.yml` - GitHub Actions deployment
- `.github/workflows/build.yml` - PR validation workflow

## Build

```bash
make build   # Build production site to docs/
make dev     # Start dev server (via dev.mk)
make test    # Run unit tests (Vitest)
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

## Testing

Unit tests use Vitest. Test files are colocated with source:
- `src/lib/*.test.ts` - Pure function tests (frontmatter, article-filter)
- `src/script/*.test.ts` - Build script logic tests

Pattern: Extract pure functions from components/hooks into `src/lib/` for testability.

## Dependencies

Managed by Renovate (renovate.json):
- GitHub Actions versions
- Terraform AWS provider
- npm packages
