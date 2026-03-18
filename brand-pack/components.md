# Component Contracts

### 1. Comparison Matrix (Table)
- **Visuals**: Use `var(--color-surface)` with `var(--shadow-card)`.
- **Accessibility**: 
  - Must use `scope="col"` and `scope="row"`.
  - Background must maintain 4.5:1 contrast for text.
  - Sticky headers for long agent lists.

### 2. Status Chips
- **Neutral**: `background: #eee; color: #333;`
- **Active AI**: `background: var(--color-accent-teal); color: white;`
- **Error**: `background: var(--color-accent-coral); color: white;`
- **A11y**: Status must be signaled via text ("Available") or icon, not just color. Use `aria-live="polite"` for dynamic updates.

### 3. Browser Identity Cards
- **Contract**: Border-top must use the specific browser token (Chrome/Firefox/Edge).
- **Elevation**: `var(--shadow-card)` on hover with a 2px lift.
- **Typography**: Display font for H3, Mono for versioning/technical specs.

### 4. Action Buttons (CTA)
- **Primary**: `background: var(--color-accent-coral);`
- **Ghost**: `border: 2px solid var(--color-accent-teal); color: var(--color-accent-teal);`
- **Focus State**: `outline: 3px solid var(--color-accent-blue); outline-offset: 2px;`
