# blog

Personal blog hosted at [blog.tamakiii.com](https://blog.tamakiii.com)

## Development

```bash
make dev      # Start development server
make build    # Build for production
make preview  # Preview production build
make clean    # Remove generated files
```

## Writing Articles

Articles are markdown files with YAML frontmatter:

```
article/{locale}/{year}/{mm-dd}/{slug}.md
```

Example: `article/en_US/2026/01-03/hello.md`

```markdown
---
title: "Article Title"
date: "2026-01-03"
tags:
  - tag1
  - tag2
---

# Content here...
```

## Deployment

Pushes to `main` trigger GitHub Actions to deploy to GitHub Pages.
