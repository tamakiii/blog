# CLAUDE.md

## Project Overview

Personal blog repository deployed to GitHub Pages at blog.tamakiii.com.

## Structure

- `article/` - Source content (Markdown files)
- `docs/` - Generated output (git-ignored, built by `make build`)
- `terraform/` - AWS Route53 DNS configuration
- `.github/workflows/deploy.yml` - GitHub Actions deployment workflow

## Build

```bash
make build   # Copies article/* and CNAME to docs/
```

## Infrastructure

Terraform manages Route53 CNAME record pointing blog.tamakiii.com to tamakiii.github.io.
State stored in S3: `terraform.s3.tamakiii.com/blog/terraform.tfstate`

## Dependencies

Managed by Renovate (renovate.json):
- GitHub Actions versions
- Terraform AWS provider
