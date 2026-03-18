# STYLES.md — AI Browser Capability Demo

This file governs writing, design, and code style for both the GitHub Pages site and the repository documentation; it is intended for human contributors and AI coding agents alike.

---

## Scope: documentation files vs. the website

| Surface | Exists | Sections that apply |
|---|---|---|
| GitHub Pages site (`index.html`, `browser-ai-configuration.html`, `experiment-recipes.html`, `*.html`) | Yes — deployed at `https://mgifford.github.io/ai-browser-test/` | 1, 2, 3, 4, 5 |
| Repository documentation (`*.md` files) | Yes — source-of-truth governance docs in the repo root | 1, 2, 4, 5 |

Section 3 (design foundations) applies to the site surface only.

---

## 1. Core philosophy

1. **Runtime evidence over assertion.** Every capability claim in the UI or the docs must trace to something directly measurable in the current browser session. Do not state that a feature is available unless a live probe confirms it or the text explicitly qualifies the scope.
2. **Minimal weight, maximum clarity.** No build pipeline, no heavy framework. Every addition — script, style, or copy — must justify its page-weight cost. When a simpler alternative exists, prefer it.
3. **Accessible and transparent by default.** Accessibility controls, color contrast, and keyboard reach are non-negotiable baselines, not post-release concerns. Sustainability disclosures must be visible on every HTML page.
4. **Documentation and implementation stay in sync.** If a probe, feature, or API is added to the site, the corresponding markdown doc must be updated in the same change. Stale docs are a defect.

---

## 2. Content and voice standards

### 2.1 Voice and tone

| Context | Tone | Strategy |
|---|---|---|
| UI labels, button text, status chips | Precise and neutral | Use the exact API or feature name; avoid marketing phrasing |
| Demo instructions and talk tracks | Direct and instructional | Use numbered steps and active verbs; address the presenter in second person |
| Governance docs (`ACCESSIBILITY.md`, `SUSTAINABILITY.md`, `AGENTS.md`) | Authoritative and collegial | State commitments plainly; use bullet lists; avoid hedging |
| Error and probe result messages | Honest and informative | Report what was detected or what failed; do not soften a negative result with vague language |
| Code comments and agent instructions | Terse and imperative | One sentence per concern; no filler words |

### 2.2 Plain language and word choice

| Avoid | Use instead | Reason |
|---|---|---|
| "leverage" | "use" | Clearer; consistent with existing docs |
| "utilize" | "use" | Simpler; matches the README register |
| "functionality" | "feature" or "behavior" | More specific; avoids bureaucratic tone |
| "Please note that…" | State the fact directly | Removes filler; aligns with direct voice |
| "built-in AI abilities" | "built-in AI APIs" or "built-in AI features" | Precise; matches Chrome developer docs naming |
| "currently" (without a date or version) | Specify the version, channel, or date | Prevents stale copy that misleads |
| Passive constructions ("is shown", "is rendered") | Active constructions ("the page shows", "the matrix renders") | Matches existing README style |

### 2.3 Grammar and mechanics

- **Voice:** Prefer active voice. Use passive only when the actor is genuinely unknown or unimportant.
- **Headings:** Sentence case throughout — capitalize only the first word and proper nouns. Do not use title case.
- **Lists:** Use bullet lists for unordered items and numbered lists for sequential steps. Do not mix the two in a single list.
- **Oxford comma:** Use it. "Summarize, rewrite, and compare" — not "Summarize, rewrite and compare."
- **Numbers:** Spell out one through nine; use numerals for 10 and above. Always use numerals for measurements (350 KB, 8000, 640px).
- **Dates:** Use ISO 8601 for machine-readable dates (`2026-03-11`). Use "March 11, 2026" in prose.
- **Code and UI references:** Wrap code, file names, API names, and exact UI labels in backticks: `index.html`, `window.ai`, **Run Built-in Tests**.
- **Abbreviations:** Spell out on first use, then abbreviate: "carbon dioxide equivalent (CO2e)". Common technical abbreviations (API, HTML, CSS, JS, YAML) do not need expansion.

### 2.4 Spelling convention

American English is the default for all text in this project.

Examples: "color" not "colour"; "behavior" not "behaviour"; "summarize" not "summarise".

Derived forks that serve a regional audience may override this by adding a `LANGUAGE.md` note and updating section 2.4 in their local `STYLES.md`.

---

## 3. Design foundations (site surface only)

### 3.1 Design tokens

All tokens are defined as CSS custom properties on `:root`. A single `@media (prefers-color-scheme: dark)` block on `:root` overrides the tokens that change between modes. Do not create separate dark-mode class names or duplicate token declarations elsewhere.

| Token | Light value | Dark value | Requirement |
|---|---|---|---|
| `--bg` | `#f2efe7` | `#1a2320` | Page and outer background |
| `--text` | `#18211f` | `#ede9e0` | Primary text color |
| `--muted` | `#50615c` | `#93aaa4` | Secondary text; captions; metadata |
| `--card` | `rgba(255,255,255,0.72)` | `rgba(30,42,38,0.85)` | Card and panel background |
| `--line` | `rgba(22,32,30,0.14)` | `rgba(237,233,224,0.12)` | Borders and dividers |
| `--accent` | `#ec5f3f` | `#f07a5e` | Primary call-to-action; highlights |
| `--accent-2` | `#2b7f6d` | `#4db39e` | Secondary accent; positive states |
| `--accent-3` | `#0f5cda` | `#5590f0` | Tertiary accent; informational links |
| `--chrome` | `#4285f4` | `#4285f4` | Chrome browser brand color |
| `--firefox` | `#ff7139` | `#ff7139` | Firefox browser brand color |
| `--edge` | `#0aa7ad` | `#0aa7ad` | Edge browser brand color |
| `--shadow` | `0 20px 40px rgba(17,31,28,0.1)` | `0 20px 40px rgba(0,0,0,0.35)` | Card elevation |
| `--radius-lg` | `20px` | (same) | Large border radius |
| `--radius-md` | `14px` | (same) | Medium border radius |
| `--radius-sm` | `10px` | (same) | Small border radius |

Browser brand tokens (`--chrome`, `--firefox`, `--edge`) are identity colors and must not be changed.

### 3.2 Typography

| Property | Value |
|---|---|
| Body font stack | `"Space Grotesk", "Segoe UI", sans-serif` |
| Display / heading font stack | `"Fraunces", Georgia, serif` |
| Body line height | `1.45` |
| Heading line height | `1.05` (display) |
| Display heading scale | `clamp(1.8rem, 4.1vw, 3rem)` using CSS `clamp()` |
| Prose line length | `65ch` maximum |
| Font loading | Via Google Fonts with `<link rel="preconnect">` preconnect hints; `display=swap` required |

Use `clamp()` for fluid type scaling on display headings. Use `rem` for component-level font sizes; do not use `px` for text.

### 3.3 Responsive design

Mobile-first breakpoints (max-width overrides applied in order):

| Breakpoint | Width | Layout change |
|---|---|---|
| Default (mobile base) | < 640px | Single-column layout; full-width controls and CTAs; matrix scrolls horizontally |
| Medium | ≤ 920px | Two-column grid collapses to one column; matrix narrows column widths |
| Wide (desktop) | > 920px | Full multi-column grid; matrix displays all columns inline |

The content shell is constrained to `min(1120px, calc(100% - 2rem))` at all widths.

### 3.4 User-preference media queries

| Query | Status | Implementation |
|---|---|---|
| `prefers-color-scheme: dark` | Tokens defined — not yet in CSS | Override `:root` tokens (see section 3.1); do not invert images or browser brand colors |
| `prefers-reduced-motion` | Committed | Disable or shorten `transition` and `@keyframes` animations; do not remove content or interactive controls |
| `prefers-contrast: more` | Aspirational | Increase `--muted` contrast ratio; thicken `--line` borders |

---

## 4. Accessibility and semantic logic

These rules apply to both the site surface and repository documentation.

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<section>`, `<table>`) rather than `<div>` with role attributes wherever the native element is available.
- Every interactive control must have an accessible name — either visible label text or `aria-label`. Do not rely on placeholder text or icon-only buttons without supplementary text.
- Focus styles must remain visible and must not be suppressed with `outline: none` without a replacement style. The focus ring must meet a 3:1 contrast ratio against adjacent colors.
- Use `aria-live` regions for dynamically injected probe results and status updates so screen-reader users receive the same information as sighted users.
- Color must never be the sole means of conveying information (for example, status cells in the capability matrix must use text labels alongside color coding).
- Minimum touch target size for interactive elements: 44×44 CSS pixels on mobile viewports.
- Reduced-motion preference must not block reading or interacting with any content (see section 3.4).
- All `<table>` elements in the site must include `<th scope="col">` or `<th scope="row">` headers.
- Alt text for images must describe the content or function. Decorative images use `alt=""`.

See [ACCESSIBILITY.md](ACCESSIBILITY.md) for the full commitment and test checklist.

---

## 5. AI agent instructions

Agents working in this repository must follow these rules in addition to [AGENTS.md](AGENTS.md):

1. **Read first.** Before making any change, read `AGENTS.md`, this file (`STYLES.md`), and the file you intend to edit.
2. **Identify the surface.** Determine whether you are editing the site surface (`.html` files) or repository documentation (`.md` files) before applying style rules.
3. **Never override design tokens.** Do not change the values of `--bg`, `--text`, `--accent`, `--chrome`, `--firefox`, or `--edge` without an explicit instruction from the repository owner.
4. **Never remove accessibility attributes.** Do not remove `aria-live`, `aria-label`, `role`, `scope`, or visible focus styles, even if they appear redundant.
5. **Language and spelling.** All generated text must use American English spelling (see section 2.4). Do not switch to British or Canadian spelling.
6. **Scope discipline.** Make the smallest change that fully addresses the task. Do not reformat unrelated code, reorder CSS declarations, or rename variables outside the scope of the task.
7. **Documentation parity.** If you add or change a probe, API test, or UI feature in an `.html` file, update the corresponding `.md` documentation in the same change.
8. **No HTML renderings of markdown docs.** Do not create `.html` versions of `.md` governance files (such as `ACCESSIBILITY.html` or `SUSTAINABILITY.html`). Keep policy docs in `.md` format only.
9. **Headings use sentence case.** When writing or editing any heading in a `.md` or `.html` file, use sentence case — capitalize only the first word and proper nouns.
10. **Commit messages.** Use the imperative mood and keep the subject line under 72 characters.

---

## 6. References

- [STYLES.md open standard](https://github.com/mgifford/STYLES.md) — the defining repository for the machine-readable style standard this file follows
- [AGENTS.md](AGENTS.md)
- [ACCESSIBILITY.md](ACCESSIBILITY.md) — full accessibility commitment and test checklist
- [SUSTAINABILITY.md](SUSTAINABILITY.md) — sustainability goals and operational targets
- [Google Fonts — Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
- [Google Fonts — Fraunces](https://fonts.google.com/specimen/Fraunces)
- [WCAG 2.1 quick reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [CO2.js documentation](https://developers.thegreenwebfoundation.org/co2js/overview/)
- [Chrome built-in AI developer docs](https://developer.chrome.com/docs/ai)
