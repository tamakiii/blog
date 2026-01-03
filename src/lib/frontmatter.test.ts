import { describe, it, expect } from 'vitest'
import { parseFrontmatter, toMarkdownPath } from './frontmatter'

describe('parseFrontmatter', () => {
  it('parses valid frontmatter with all fields', () => {
    const content = `---
title: "Hello World"
date: "2026-01-03"
description: "A test article"
tags:
  - typescript
  - testing
---
# Content here`

    const result = parseFrontmatter(content)

    expect(result.frontmatter.title).toBe('Hello World')
    expect(result.frontmatter.date).toBe('2026-01-03')
    expect(result.frontmatter.description).toBe('A test article')
    expect(result.frontmatter.tags).toEqual(['typescript', 'testing'])
    expect(result.content).toBe('# Content here')
  })

  it('parses frontmatter with missing optional fields', () => {
    const content = `---
title: "Minimal Article"
date: "2026-01-01"
---
Some content`

    const result = parseFrontmatter(content)

    expect(result.frontmatter.title).toBe('Minimal Article')
    expect(result.frontmatter.date).toBe('2026-01-01')
    expect(result.frontmatter.tags).toBeUndefined()
    expect(result.frontmatter.description).toBeUndefined()
    expect(result.content).toBe('Some content')
  })

  it('parses frontmatter with unquoted values', () => {
    const content = `---
title: Unquoted Title
date: 2026-01-02
---
Body`

    const result = parseFrontmatter(content)

    expect(result.frontmatter.title).toBe('Unquoted Title')
    expect(result.frontmatter.date).toBe('2026-01-02')
  })

  it('returns empty frontmatter when no frontmatter markers exist', () => {
    const content = '# Just markdown content\n\nNo frontmatter here.'

    const result = parseFrontmatter(content)

    expect(result.frontmatter.title).toBe('')
    expect(result.frontmatter.date).toBe('')
    expect(result.content).toBe(content)
  })

  it('parses frontmatter with single tag', () => {
    const content = `---
title: "Single Tag"
date: "2026-01-03"
tags:
  - javascript
---
Content`

    const result = parseFrontmatter(content)

    expect(result.frontmatter.tags).toEqual(['javascript'])
  })

  it('handles empty content after frontmatter', () => {
    const content = `---
title: "Empty Body"
date: "2026-01-03"
---
`

    const result = parseFrontmatter(content)

    expect(result.frontmatter.title).toBe('Empty Body')
    expect(result.content).toBe('')
  })

  it('preserves multiline markdown content', () => {
    const content = `---
title: "Multi Line"
date: "2026-01-03"
---
# Heading

Paragraph one.

Paragraph two.`

    const result = parseFrontmatter(content)

    expect(result.content).toBe(`# Heading

Paragraph one.

Paragraph two.`)
  })

  it('removes quotes from values', () => {
    const content = `---
title: 'Single Quoted'
date: "Double Quoted"
---
Content`

    const result = parseFrontmatter(content)

    expect(result.frontmatter.title).toBe('Single Quoted')
    expect(result.frontmatter.date).toBe('Double Quoted')
  })
})

describe('toMarkdownPath', () => {
  it('converts path with leading slash', () => {
    expect(toMarkdownPath('/en_US/2026/01-03/hello')).toBe('/en_US/2026/01-03/hello.md')
  })

  it('converts path with trailing slash', () => {
    expect(toMarkdownPath('en_US/2026/01-03/hello/')).toBe('/en_US/2026/01-03/hello.md')
  })

  it('converts path with both leading and trailing slashes', () => {
    expect(toMarkdownPath('/en_US/2026/01-03/hello/')).toBe('/en_US/2026/01-03/hello.md')
  })

  it('converts path without slashes', () => {
    expect(toMarkdownPath('en_US/2026/01-03/hello')).toBe('/en_US/2026/01-03/hello.md')
  })
})
