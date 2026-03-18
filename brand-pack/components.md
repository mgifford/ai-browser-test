# components.md — AI Browser Capability Demo component contracts

This file defines the concrete visual and accessibility contracts for every reusable
component in the brand. All color references use tokens from `tokens.css`. No component
may hard-code a color, radius, or shadow value that has a corresponding token.

---

## 1. Capability matrix / data table

### Purpose
Display side-by-side browser support status for multiple API features. Used as the
primary information layer on the demo site.

### Structure

```html
<div class="matrix" role="table" aria-label="Browser capability matrix">

  <!-- Header row -->
  <div role="row">
    <div role="columnheader" class="cell head" scope="col">Feature</div>
    <div role="columnheader" class="cell head" scope="col">
      <span class="swatch" style="background:var(--chrome)" aria-hidden="true"></span>Chrome
    </div>
    <div role="columnheader" class="cell head" scope="col">
      <span class="swatch" style="background:var(--firefox)" aria-hidden="true"></span>Firefox
    </div>
    <div role="columnheader" class="cell head" scope="col">
      <span class="swatch" style="background:var(--edge)" aria-hidden="true"></span>Edge
    </div>
  </div>

  <!-- Data row — status cell example -->
  <div role="row">
    <div role="rowheader" class="cell feature">Prompt API</div>
    <div role="cell" class="cell ok">✓ Available</div>
    <div role="cell" class="cell no">✗ Not available</div>
    <div role="cell" class="cell warn">⚠ Pre-release</div>
  </div>

</div>
```

When the matrix is rendered as a native `<table>`, use `<th scope="col">` and
`<th scope="row">` instead of ARIA roles. Prefer native `<table>` wherever HTML
semantics are not blocked by a grid layout requirement.

### Token usage

| Property | Token |
|---|---|
| Cell background | `rgba(255,255,255,0.65)` (light); `var(--card)` (dark) |
| Cell border | `var(--line)` |
| Header background | `rgba(255,255,255,0.88)` (light); lightened `var(--card)` (dark) |
| OK status text | `var(--status-ok)` |
| Warn status text | `var(--status-warn)` |
| No status text | `var(--status-no)` |
| Border radius (outer) | `var(--radius-lg)` |

### Accessibility requirements

- Every column with a browser name must include the browser color swatch (`aria-hidden="true"`) **and** the text name. Color is supplementary — the text name is the accessible label.
- Status cells must combine a symbol (✓ ✗ ⚠) **and** a text label (Available, Not available, Pre-release). Do not use color alone.
- The matrix must scroll horizontally on mobile viewports (overflow-x: auto) without clipping text.
- On mobile (< 640px), column widths may narrow but text must not be truncated without a tooltip or expand control.
- Header cells must remain sticky (`position: sticky; top: 0`) when the table scrolls vertically.

### Responsive behavior

| Viewport | Layout |
|---|---|
| < 640px | Horizontal scroll; matrix occupies full container width |
| ≥ 920px | All columns inline; no horizontal scroll required |

---

## 2. Cards

### Purpose
Encapsulate a self-contained information unit — hero panel, browser selector, simulator, scenario list, experiment log.

### Structure

```html
<section class="card" aria-labelledby="card-heading-id">
  <h2 id="card-heading-id">Card heading</h2>
  <p>Card body content.</p>
</section>
```

### Token usage

| Property | Token |
|---|---|
| Background | `var(--card)` |
| Border | `1px solid var(--line)` |
| Border radius | `var(--radius-lg)` |
| Box shadow | `var(--shadow)` |
| Backdrop filter | `blur(10px)` |
| Padding | `var(--space-4)` (1rem) |

### Accessibility requirements

- Every card must have a heading that acts as its accessible name, either via `aria-labelledby` referencing a visible heading, or via `aria-label` when no visible heading exists.
- Cards containing interactive controls must not trap focus. Tab order must flow through the card and continue to the next element.
- Cards with dynamic content (probe results, status updates) must wrap that content in an `aria-live="polite"` region so screen-reader users receive updates.

---

## 3. Status chips

### Purpose
Compact inline label indicating current detection or operational state.

### Variants

| Variant | Class modifier | Token | Meaning |
|---|---|---|---|
| Default | (none) | `var(--text)` on `var(--card)` | Neutral / not yet run |
| OK / available | `.ok` | `var(--status-ok)` | Confirmed available |
| Warning / pre-release | `.warn` | `var(--status-warn)` | Caution or partial support |
| Error / unavailable | `.no` | `var(--status-no)` | Not available or failed |
| Pre-release build | `.prerelease` | `var(--status-warn)` on `rgba(255,243,219,0.95)` | Experimental channel |

### Structure

```html
<span class="chip ok" role="status">
  <span aria-hidden="true">✓</span>
  <span>Available</span>
</span>
```

### Token usage

| Property | Token |
|---|---|
| Border | `1px solid var(--line)` |
| Border radius | `var(--radius-pill)` |
| Padding | `0.32rem 0.6rem` |
| Background (default) | `var(--surface-chip)` |
| Font size | `var(--text-sm)` |
| Status text color | see Variants table above |

### Accessibility requirements

- The chip must include a text label. The icon or symbol prefix must be `aria-hidden="true"`.
- When the chip value is updated dynamically (after a probe runs), it must be inside an `aria-live="polite"` region or carry `role="status"` itself so the change is announced.
- Status must never be conveyed by color alone. The symbol (✓ ✗ ⚠) and text label together form the accessible signal.

---

## 4. CTA buttons

### Variants

| Variant | Class | Background | Text color | Use |
|---|---|---|---|---|
| Primary | `.cta` | `var(--accent)` | `#ffffff` | Single dominant action per section |
| Secondary | `.cta-secondary` | `rgba(255,255,255,0.92)` | `var(--text)` | Supporting actions alongside a primary CTA |

### Structure

```html
<!-- Primary -->
<button type="button" class="cta">Run built-in tests</button>

<!-- Secondary -->
<button type="button" class="cta-secondary">Copy results</button>

<!-- Disabled state -->
<button type="button" class="cta" disabled aria-disabled="true">Run built-in tests</button>
```

### Token usage

| Property | Token |
|---|---|
| Primary background | `var(--accent)` |
| Primary text | `var(--color-white)` |
| Secondary background | `var(--surface-btn-secondary)` |
| Secondary border | `1px solid var(--line)` |
| Secondary text | `var(--text)` |
| Border radius | `var(--radius-md)` (`14px`) |
| Padding | `0.58rem 0.78rem` (secondary); `0.68rem 0.95rem` (primary) |
| Font weight | `700` |
| Disabled opacity | `0.6` |

### Accessibility requirements

- Every button must have a visible text label or an `aria-label` that describes the action. Icon-only buttons are not permitted without supplementary text.
- Minimum touch target: `44×44 CSS pixels` on mobile viewports. Achieve this via `min-height: 44px; min-width: 44px` or `padding` that produces equivalent size.
- Disabled buttons must set both the `disabled` HTML attribute and `aria-disabled="true"`. The cursor must change to `not-allowed`.
- Focus styles must not be suppressed. The visible focus ring must meet a 3:1 contrast ratio against adjacent background colors.
- Do not use `<div>` or `<a>` as buttons. Use `<button type="button">` for non-form actions.

### Hover / focus transitions

```css
.cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}
/* Respect reduced-motion preference — tokens.css safety net applies */
```

---

## 5. Notices

### Purpose
Communicate contextual information, warnings, errors, or confirmation states inline within the page.

### Variants

| Variant | Class | Background token | Border-left color | Use |
|---|---|---|---|---|
| Informational | `.notice-info` | `var(--notice-info-bg)` | `var(--accent-3)` | Context, documentation references |
| Warning | `.notice-warn` | `var(--notice-warn-bg)` | `var(--status-warn)` | Partial support, required browser flags |
| Success / available | `.notice-ok` | `var(--notice-ok-bg)` | `var(--accent-2)` | Feature confirmed available |
| Error | `.notice-error` | `var(--notice-error-bg)` | `var(--status-no)` | Probe failed, API unavailable |

### Structure

```html
<div class="notice notice-warn" role="note">
  <strong>Chrome 129+ required.</strong>
  Enable the Prompt API flag at <code>chrome://flags</code> to use this feature.
</div>
```

For dynamically injected notices (probe results), use `role="alert"` (for errors) or
`role="status"` (for success/info) instead of `role="note"`, so the content is
announced by screen readers without requiring user focus.

### Token usage

| Property | Token |
|---|---|
| Background | see Variants table |
| Border-left | `3px solid <accent or status token>` |
| Border radius | `0 var(--radius-sm) var(--radius-sm) 0` |
| Padding | `0.6rem 0.75rem` |
| Font size | `var(--text-sm)` |

### Accessibility requirements

- A notice must not rely on background color alone to convey its type. The text content or heading must identify the notice category (e.g., "Required:" or "Error:").
- Dynamically injected notices must use `aria-live="polite"` (for non-urgent updates) or `role="alert"` (for errors) so assistive technology announces the update.
- Do not auto-dismiss notices that contain actionable content. If a notice disappears automatically, the timeout must be at least 5 seconds and must pause on keyboard focus or hover.
