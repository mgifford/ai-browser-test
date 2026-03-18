# ai-instructions.md — AI agent rules for the AI Browser Capability Demo brand

This file governs how AI coding agents must behave when working in any repository that
has adopted this brand pack. It supplements (and does not replace) the repository's own
`AGENTS.md`. When the two files conflict, the repository's `AGENTS.md` takes precedence.

---

## 1. Reading order

Before making any change, read files in this order:

1. `AGENTS.md` (repository governance)
2. `STYLES.md` (writing and design standards)
3. `brand-pack/tokens.css` (token definitions)
4. `brand-pack/components.md` (component contracts)
5. `brand-pack/voice.md` (voice and spelling rules)
6. The file you intend to edit

Skipping step 1–5 is not permitted. If any of those files is absent from the target
repository, note the gap before proceeding.

---

## 2. Surface detection

Determine which surface you are editing before applying any rule:

| Surface | Files | Rules that apply |
|---|---|---|
| Site surface | `*.html` files inside `docs/` | All sections of `STYLES.md` and all brand-pack files |
| Repository documentation | `*.md` files in the repo root and subdirectories | Sections 1, 2, 4, 5 of `STYLES.md`; `voice.md`; `ai-instructions.md` |
| Brand pack itself | `brand-pack/*.{css,md}` | Minimal change; update `README.md` adoption steps when adding a new file |

Do not apply site-surface rules (design tokens, component markup) to documentation
files, and do not apply documentation-only rules to HTML.

---

## 3. Token discipline

### What tokens govern
Every visual property that has a token in `tokens.css` must reference that token.
Hard-coding the following is forbidden in component code:

- Color values (hex, rgb, rgba, hsl)
- Border-radius values
- Box-shadow values
- Font-family stacks
- Font-size values (use `var(--text-*)` tokens)

### Browser identity tokens
`--chrome`, `--firefox`, and `--edge` are non-negotiable identity colors. Their values
must never change. Do not adjust them for contrast, theming, or any other reason.
If a contrast requirement cannot be met with these colors as foreground on a given
background, solve the problem by changing the background, not the brand color.

### Adding new tokens
If a visual value is needed that has no token:

1. Add the new token to `tokens.css` with a light-mode value and, if the property
   changes in dark mode, a corresponding entry in the `@media (prefers-color-scheme: dark)`
   block.
2. Update this file (`ai-instructions.md`) to list the new token category if it
   introduces a new concept.
3. Reference the new token in the component code — never inline the raw value.

### Dark mode
Do not create separate dark-mode class names or duplicate token declarations outside
the `@media (prefers-color-scheme: dark)` block on `:root`. One override block only.

---

## 4. Accessibility non-removal rules

The following attributes and patterns must never be removed, even if they appear
redundant or unused:

| Attribute / pattern | Why it must stay |
|---|---|
| `aria-live` on probe result regions | Screen-reader users rely on this to receive dynamic updates |
| `aria-label` on icon-only or context-dependent controls | Removes accessible name if deleted |
| `role="status"` or `role="alert"` on status chips updated after probe runs | Announces state change to assistive technology |
| `scope="col"` / `scope="row"` on `<th>` elements | Required for table navigation by screen readers |
| Visible focus styles (`:focus`, `:focus-visible`) | Must not be suppressed with `outline: none` without a replacement ring meeting 3:1 contrast |
| `alt` attributes on `<img>` | Must not be removed; decorative images use `alt=""` |
| `<th>` elements in any table | Cannot be replaced with styled `<td>` elements |

If a linter or formatter flags one of these attributes as "unused" or "redundant",
the linter rule must be suppressed with an inline comment explaining why, not removed.

### aria-live region rules
- Use `aria-live="polite"` for probe results and status updates that are informational.
- Use `role="alert"` (which implies `aria-live="assertive"`) only for errors that require
  immediate attention and that interrupt the current task.
- Do not nest `aria-live` regions. One live region per logical output area.
- Do not inject content into a live region before it is in the DOM. The region must be
  present at page load (even if empty) for announcements to work reliably.

### Color contrast
- Body text (`var(--text)` on `var(--bg)`): minimum 7:1 (WCAG AAA for normal text).
- Muted text (`var(--muted)` on `var(--bg)`): minimum 4.5:1 (WCAG AA for normal text).
- Interactive focus rings: minimum 3:1 contrast ratio against adjacent surface.
- Status chip text: must meet 4.5:1 against the chip background.
- Do not modify token values to improve contrast without verifying the ratio in both
  light and dark modes.

### Touch targets
All interactive elements must have a minimum touch target of 44×44 CSS pixels on
mobile viewports. Achieve this via padding or `min-height`/`min-width`, not by
enlarging visible button size beyond design intent.

---

## 5. Scope control

- Make the smallest change that fully addresses the task.
- Do not reformat unrelated CSS declarations, reorder properties, or rename variables
  outside the explicit scope of the task.
- Do not add new dependencies (fonts, scripts, npm packages) without documenting the
  addition in `SUSTAINABILITY.md` and verifying that the page transfer size stays under
  350 KB.
- Do not remove or modify existing test infrastructure unless the task explicitly
  requires it and the change is documented in the PR description.

### What counts as in-scope
- Files named in the task or issue description.
- Files in the same component that break if the named file changes (e.g., a CSS file and
  the HTML that references its class names).
- Token additions that are directly required by the named change.

### What is out of scope
- Refactoring unrelated components or functions.
- Upgrading dependency versions not mentioned in the task.
- Changing documentation that is already accurate.
- Adding new features not described in the task.

---

## 6. Documentation parity

If you add or change a probe, API test, or UI feature in an `.html` file, update the
corresponding `.md` documentation in the same commit. Stale documentation is treated
as a defect.

Required documentation updates by change type:

| Change | Documentation to update |
|---|---|
| New API probe added to `index.html` | `BROWSER_AI_SPECIFICS.md` and the capability matrix description in `README.md` |
| New design token in `tokens.css` | `brand-pack/README.md` adoption steps if the token changes the adoption checklist |
| New component variant in `components.md` | `tokens.css` (add required tokens); `voice.md` (add status term if applicable) |
| New voice rule in `voice.md` | `ai-instructions.md` section 6 (this table) if a new parity rule is introduced |
| Change to a browser identity color | Not permitted (see section 3 — non-negotiable identity colors) |

---

## 7. Prohibited actions

The following actions are never permitted regardless of task instructions:

- Changing `--chrome`, `--firefox`, or `--edge` token values.
- Removing `aria-live`, `aria-label`, `role`, `scope`, or focus styles.
- Creating `.html` renderings of `.md` governance files (no `ACCESSIBILITY.html`, no `SUSTAINABILITY.html`).
- Committing secrets, credentials, or personally identifiable information.
- Introducing new security vulnerabilities (SQL injection, XSS, CSRF, etc.).
- Making changes in files or branches other than those specified in the task.
- Switching American English spelling to any other variant without an explicit override
  instruction from the repository owner accompanied by a `LANGUAGE.md` addition.
