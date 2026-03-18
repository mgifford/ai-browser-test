# brand-pack/README.md

This brand pack makes the AI Browser Capability Demo visual identity portable.
Copy the five files in this directory into any repository to replicate the design
language, component contracts, voice rules, and AI-agent guardrails of the demo site.

---

## What is included

| File | Purpose |
|---|---|
| `tokens.css` | All design tokens as CSS custom properties — colors, typography, spacing, radius, elevation, breakpoints |
| `components.md` | Concrete contracts for every reusable UI component: matrix/table, cards, status chips, CTA buttons, notices |
| `voice.md` | Tone rules by context, word substitutions, grammar mechanics, and spelling convention |
| `ai-instructions.md` | Rules for AI coding agents: reading order, surface detection, token discipline, accessibility non-removal, scope control, documentation parity |
| `README.md` (this file) | Adoption steps and adoption checklist |

---

## Quick-start adoption

Follow these steps to adopt the brand pack in a new repository.

### Step 1 — Copy the brand pack

```bash
# From your new repository root
mkdir -p brand-pack
cp /path/to/ai-browser-test/brand-pack/*.{css,md} brand-pack/
```

Or copy the files manually from
`https://github.com/mgifford/ai-browser-test/tree/main/brand-pack`.

### Step 2 — Load Google Fonts

The brand uses two typefaces served by Google Fonts. Add these `<link>` tags to the
`<head>` of every HTML page, before any other stylesheets:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Space+Grotesk:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

Both fonts use `display=swap` to prevent render-blocking.

### Step 3 — Import the token file

Reference `tokens.css` before any component stylesheet:

```html
<link rel="stylesheet" href="brand-pack/tokens.css" />
```

Or, if you use a CSS bundler, import it at the top of your entry stylesheet:

```css
@import "brand-pack/tokens.css";
```

### Step 4 — Apply the shell constraint

Wrap your page content in a container that uses the shell token:

```css
.shell {
  width: min(var(--shell-max), calc(100% - var(--shell-gutter)));
  margin: 2rem auto 4rem;
}
```

```html
<main class="shell">
  <!-- page content -->
</main>
```

### Step 5 — Set up the gradient background

Apply the characteristic radial-gradient body background:

```css
body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  background:
    radial-gradient(circle at 8% 12%,  rgba(236, 95, 63, 0.2),  transparent 26%),
    radial-gradient(circle at 80% 14%, rgba(15, 92, 218, 0.16), transparent 24%),
    radial-gradient(circle at 70% 82%, rgba(43, 127, 109, 0.16), transparent 28%),
    var(--bg);
  font-family: var(--font-body);
  line-height: var(--lh-body);
  overflow-x: hidden;
}
```

### Step 6 — Apply display typography

Use the display font stack and fluid scale for top-level headings:

```css
h1, h2, h3 {
  font-family: var(--font-display);
  margin: 0;
  letter-spacing: -0.02em;
}

h1 {
  font-size: var(--text-display);
  line-height: var(--lh-display);
}
```

### Step 7 — Add aria-live regions for dynamic content

Any area of the page that receives dynamically injected content (probe results,
status updates) must have a live region present at page load:

```html
<div aria-live="polite" aria-atomic="true" id="probe-results">
  <!-- probe output injected here by JavaScript -->
</div>
```

### Step 8 — Implement components from contracts

For each UI component you need, follow the contract in `components.md`:

- Copy the example markup structure.
- Apply class names and token references as specified.
- Verify accessibility requirements (see the "Accessibility requirements" section in each component).

### Step 9 — Configure AI agents

If your repository uses AI coding agents, copy `ai-instructions.md` into your
repository root or reference it from your `AGENTS.md`:

```markdown
## Additional agent rules

See [brand-pack/ai-instructions.md](brand-pack/ai-instructions.md) for token discipline,
accessibility non-removal rules, and scope control requirements.
```

### Step 10 — Verify the adoption checklist

Run through this checklist before considering adoption complete:

- [ ] `tokens.css` is loaded before any component stylesheet
- [ ] Google Fonts preconnect hints are in every HTML `<head>`
- [ ] `--chrome`, `--firefox`, and `--edge` values match the token file exactly
- [ ] No component hard-codes a color, radius, or shadow that has a corresponding token
- [ ] Every `<table>` has `<th scope="col">` or `<th scope="row">` headers
- [ ] Every status chip combines a symbol and a text label (no color-only status)
- [ ] Every interactive element has a visible focus style meeting 3:1 contrast
- [ ] `aria-live` regions are in the DOM at page load
- [ ] All dynamic status chips carry `role="status"` or are inside a live region
- [ ] CTA buttons use `<button type="button">` — not `<div>` or `<a>`
- [ ] Disabled buttons have both `disabled` and `aria-disabled="true"`
- [ ] Minimum touch target of 44×44 CSS pixels on mobile viewports
- [ ] The `prefers-reduced-motion` safety net from `tokens.css` is in effect
- [ ] Page content width is constrained to `min(1120px, calc(100% - 2rem))`
- [ ] All body copy is in American English

---

## Customization rules

### Permitted overrides

- Brand-neutral accent colors (`--accent`, `--accent-2`, `--accent-3`) may be changed
  if the adopting project has its own palette, provided contrast ratios are re-verified
  after any change.
- Status semantic colors (`--status-ok`, `--status-warn`, `--status-no`) may be
  adjusted for local contrast requirements.
- Spacing tokens (`--space-*`) may be scaled up or down uniformly.

### Non-negotiable values

The following must not change in any derivative:

| Token | Value | Reason |
|---|---|---|
| `--chrome` | `#4285f4` | Google Chrome official brand color |
| `--firefox` | `#ff7139` | Mozilla Firefox official brand color |
| `--edge` | `#0aa7ad` | Microsoft Edge official brand color |
| `--font-display` | `"Fraunces", Georgia, serif` | Visual identity of the brand |
| `--font-body` | `"Space Grotesk", "Segoe UI", sans-serif` | Readability baseline for the developer audience |

---

## Maintenance notes

When updating this brand pack:

1. Change the token in `tokens.css` first.
2. Update the affected component contract in `components.md` if the change affects a component.
3. Update `ai-instructions.md` section 3 if a new token category is added.
4. Update the adoption checklist in this file if a new adoption step is required.
5. Bump the comment at the top of `tokens.css` with the change date.

Do not silently rename tokens. Renaming a token is a breaking change for any
repository that has already adopted the brand pack. Add the new token name as an alias
and document the old name as deprecated in a code comment.

---

## License

This brand pack is released under the same license as the
[ai-browser-test repository](https://github.com/mgifford/ai-browser-test).
See `LICENSE` in the repository root.
