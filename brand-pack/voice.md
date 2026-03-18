# voice.md — AI Browser Capability Demo writing voice

This file defines tone, word choice, grammar rules, and spelling conventions for all
text in the project — UI copy, documentation, code comments, and error messages alike.
It is authoritative for both human contributors and AI coding agents.

---

## 1. Tone by context

| Surface | Tone | Strategy |
|---|---|---|
| UI labels, button text, status chips | Precise and neutral | Use the exact API or feature name; avoid marketing phrasing. State what the control does, not how impressive it is. |
| Demo instructions and talk tracks | Direct and instructional | Use numbered steps and active verbs. Address the presenter in second person ("Open DevTools", "Select the Chrome tab"). |
| Governance docs (`ACCESSIBILITY.md`, `SUSTAINABILITY.md`, `AGENTS.md`, `STYLES.md`) | Authoritative and collegial | State commitments plainly. Use bullet lists. Avoid hedging language ("we hope to", "ideally", "maybe"). |
| Error messages and probe failure results | Honest and informative | Report exactly what was detected or what failed. Do not soften a negative result with vague language. "Prompt API not available in this session" — not "This feature may not be fully supported yet." |
| Code comments and agent instructions | Terse and imperative | One sentence per concern. No filler words. Prefer imperative mood: "Return token list." not "This function should return a token list." |
| README and onboarding content | Welcoming and practical | Assume technical literacy (the audience is developers). Skip motivation; go straight to steps. |

---

## 2. Word substitutions

These rules apply to all surfaces. When a prohibited word appears in existing content
you are editing, replace it.

| Avoid | Use instead | Reason |
|---|---|---|
| "leverage" | "use" | Clearer; consistent with existing documentation |
| "utilize" | "use" | Simpler; matches the README register |
| "functionality" | "feature" or "behavior" | More specific; avoids bureaucratic tone |
| "Please note that…" | State the fact directly | Removes filler; aligns with direct voice |
| "built-in AI abilities" | "built-in AI APIs" or "built-in AI features" | Precise; matches Chrome developer documentation naming |
| "currently" (without a date or version) | Specify the version, channel, or date | Prevents stale copy that misleads readers |
| "empower" | Describe the concrete action | Marketing language; too vague for a technical audience |
| "seamless" | Omit or be specific | Meaningless marketing filler |
| "robust" | Omit or be specific | Overused; never tells readers what changed |
| "simple" / "easy" / "just" | Omit or rephrase | Excludes readers who find the task hard |
| "support for X" (ambiguous) | "X available" or "X not available" | Status language must match the chip/matrix vocabulary |
| Passive: "is shown", "is rendered" | Active: "the page shows", "the matrix renders" | Matches existing README style; preferred throughout |
| "N/A" in status cells | "Not available" (full text) | Screen readers announce the expansion; abbreviation is ambiguous |
| "TBD" | Remove the cell or note the open question explicitly | Placeholder text ships to production unresolved |

---

## 3. Grammar and mechanics

### Voice
Prefer active voice. Use passive only when the actor is genuinely unknown or unimportant
(e.g., "Flags must be enabled in `chrome://flags`" — the user or admin enables them,
so passive is acceptable here).

### Headings
Sentence case throughout — capitalize only the first word and proper nouns.
Do not use title case in any `.md` or `.html` file.

- **Correct:** "Browser capability matrix"
- **Incorrect:** "Browser Capability Matrix"

### Lists
Use bullet lists for unordered items and numbered lists for sequential steps.
Do not mix the two in a single list block.

### Oxford comma
Always use the Oxford (serial) comma before the final item in a list of three or more.

- **Correct:** "Chrome, Firefox, and Edge"
- **Incorrect:** "Chrome, Firefox and Edge"

### Numbers
Spell out one through nine; use numerals for 10 and above. Always use numerals for
measurements, regardless of magnitude: 350 KB, 8000 tokens, 640px, 44×44 CSS pixels.

### Dates
Use ISO 8601 for machine-readable dates: `2026-03-18`.
Use "March 18, 2026" in prose.

### Code and UI references
Wrap code, file names, API names, and exact UI labels in backticks.

Examples: `index.html`, `window.ai`, `chrome://flags`, **Run built-in tests**.

### Abbreviations
Spell out on first use, then abbreviate: "carbon dioxide equivalent (CO2e)".
Common technical abbreviations (API, HTML, CSS, JS, YAML, URL, DOM) do not need expansion.
Browser names (Chrome, Firefox, Edge) are always capitalized proper nouns.

### Error and status text
Match the vocabulary used in status chips and the capability matrix:
- "Available" (confirmed by probe)
- "Not available" (probe returned negative or threw)
- "Pre-release" (flag-gated, experimental channel only)
- "Unknown" (probe could not run — permissions error, timeout, etc.)

Do not invent new status terms. Adding a new term requires updating `components.md`
and `tokens.css` at the same time.

---

## 4. Spelling convention

American English is the default for all text in this project.

| American (use) | British (avoid) |
|---|---|
| color | colour |
| behavior | behaviour |
| summarize | summarise |
| recognize | recognise |
| center | centre |
| license (noun) | licence |
| program | programme |
| favor | favour |

Derived forks that serve a regional audience may override this by adding a `LANGUAGE.md`
note and updating section 4 in their local `voice.md`.

---

## 5. Developer-audience conventions

This project is addressed to developers evaluating browser AI support. The following
conventions are specific to that audience.

- Use exact API names as they appear in the browser specification or developer documentation: `LanguageModel`, `window.ai.languageModel`, `Summarizer`, `Writer`, `Rewriter`.
- When referencing browser flags, always give the exact flag path: `chrome://flags/#prompt-api-for-gemini-nano`.
- When describing browser version requirements, include both the channel and the version number: "Chrome 129 Canary" — not "a recent Chrome version".
- Code samples in documentation must be immediately runnable. Do not include pseudocode in samples that appear in technical sections.
- Distinguish between detection (does the API exist in this session?) and availability (is a model ready to use?). Do not conflate the two.
