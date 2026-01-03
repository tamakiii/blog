import { describe, it, expect } from "vitest";
import { isPathWithinRoot, extractFrontmatter } from "./article";

describe("isPathWithinRoot", () => {
  it("returns true when path is within root", () => {
    const result = isPathWithinRoot("/root/article/file.md", "/root/article");
    expect(result).toBe(true);
  });

  it("returns false when path is outside root", () => {
    const result = isPathWithinRoot("/other/file.md", "/root/article");
    expect(result).toBe(false);
  });

  it("returns false for resolved path traversal attempts", () => {
    // After path.resolve(), "../secret" becomes "/root/secret"
    const result = isPathWithinRoot("/root/secret/file.md", "/root/article");
    expect(result).toBe(false);
  });

  it("returns false when path equals root without separator", () => {
    const result = isPathWithinRoot("/root/article-extra/file.md", "/root/article");
    expect(result).toBe(false);
  });
});

describe("extractFrontmatter", () => {
  it("extracts title and date from frontmatter", () => {
    const raw = `---
title: "Hello World"
date: "2026-01-03"
---

Content here`;

    const result = extractFrontmatter(raw);

    expect(result.title).toBe("Hello World");
    expect(result.date).toBe("2026-01-03");
  });

  it("extracts tags as array", () => {
    const raw = `---
title: "Test"
date: "2026-01-03"
tags:
  - typescript
  - testing
---

Content`;

    const result = extractFrontmatter(raw);

    expect(result.tags).toEqual(["typescript", "testing"]);
  });

  it("extracts description", () => {
    const raw = `---
title: "Test"
date: "2026-01-03"
description: "A test article"
---

Content`;

    const result = extractFrontmatter(raw);

    expect(result.description).toBe("A test article");
  });

  it("returns empty strings for missing required fields", () => {
    const raw = `---
---

Content`;

    const result = extractFrontmatter(raw);

    expect(result.title).toBe("");
    expect(result.date).toBe("");
  });

  it("handles content without frontmatter", () => {
    const raw = "Just content without frontmatter";

    const result = extractFrontmatter(raw);

    expect(result.title).toBe("");
    expect(result.date).toBe("");
  });
});
