# AI Browser Capability Demo

Interactive single-page app to demonstrate AI-enabled browsing in Chrome, Firefox, and Edge, including visible built-in AI API detection tests.

## What this is

This repo contains a static, front-end-only demo that works locally and on GitHub Pages.
It is designed for live presentations where you need to:

- Compare browser AI positioning and strengths
- Run the same prompt flow across browser profiles
- Show what built-in AI browser interfaces are actually exposed at runtime

## Project files

- `index.html`: Main UI and demo logic
- `browser-ai-configuration.html`: Guide for enabling/testing AI abilities in browser beta/nightly channels
- `data/prompt-simulator.yml`: Randomized starter prompts and calls to action for AI Prompt Simulator
- `data/quick-scenarios.yml`: Randomized Quick Scenarios shown on load
- `data/sample-corpus.yml`: Local long-form source documents (5+ paragraphs) used for summarize testing
- `LICENSE`: GNU Affero General Public License v3.0 (AGPL-3.0)
- `.nojekyll`: Ensures GitHub Pages serves files as-is
- `ACCESSIBILITY.md`: Accessibility commitments and checklist
- `SUSTAINABILITY.md`: Sustainability goals and practices
- `AGENTS.md`: Agent workflow and repository conventions

## Demo features

- Browser profile switcher for Chrome, Firefox, and Edge
- Automatic runtime detection that highlights the currently used browser in Demo Profile
- Visible runtime channel chip that calls out prerelease channels (Beta/Canary/Nightly/Dev) for AI testing
- Capability matrix for AI-related browser functionality
- Runtime-first matrix ordering where the detected browser column is shown first
- Active browser column reflects live in-page capability status where measurable
- Local Tab Context Probe for same-origin tab count, related-tab detection, and heuristic high-tab energy risk
- AI prompt simulator modes:
	- Summarize
	- Rewrite for executive audience
	- Compare options
- YAML-backed randomized starter prompts with different calls to action on each load
- Editable prompt workflow that encourages users to cut/paste and refine their own content in the textarea
- Scenario presets:
	- Randomized from YAML content pools on each load
- Built-in AI API test panel with one-click detection for common interfaces:
	- Prompt API candidates
	- Summarizer API
	- Writer API
	- Rewriter API
	- Translator API
	- Language Detector API
	- On-device ML signals
- Live runtime capability probe that checks API readiness state
- One-click local API test runners for detected and ready interfaces
- Dynamic talk track for presentation flow
- Responsive layout for desktop and mobile
- CO2.js-powered sustainability footer on HTML pages with page-weight and estimated CO2e disclosure

## Quick start

No build step or dependencies are required.

1. Clone this repository.
2. Open `index.html` in a browser.

Optional local server:

```bash
cd /workspaces/ai-browser-test
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Built-in browser AI tests

To compare popular browsers directly:

1. Open the same hosted page in Chrome.
2. Click **Run Built-in Tests** and review detected interfaces.
3. Repeat in Firefox.
4. Repeat in Edge.

The results are rendered directly on the page so you can show them live.

The page now includes a local AI lab that:

1. Probes runtime readiness (not just global presence)
2. Exposes per-API test buttons only when runnable
3. Runs in-browser test calls for available built-in APIs

## Customizing prompt and scenario content

You can edit sample content without touching JavaScript:

1. Update [data/prompt-simulator.yml](data/prompt-simulator.yml) to add or revise starter prompts and calls to action.
2. Update [data/quick-scenarios.yml](data/quick-scenarios.yml) to add or revise scenario cards.
3. Update [data/sample-corpus.yml](data/sample-corpus.yml) with richer source text for deeper summary tests.
4. Reload the page to see different randomized selections.

For summarize mode, the app now auto-injects a random local 5+ paragraph source document when a prompt is too short.

## Tab context awareness validation

The demo includes a local Tab Context Probe in [index.html](index.html) that can:

1. Count same-origin tabs open with the demo (via BroadcastChannel)
2. Detect related tabs using title/path token overlap
3. Show a heuristic high-tab energy risk hint (including 100+ tab warning)

Important limitation: a normal webpage cannot enumerate all browser tabs globally. Full tab inventory requires extension-level APIs.

For setup guidance before testing, use:

- [browser-ai-configuration.html](browser-ai-configuration.html)

## GitHub Pages deployment

This repository is ready for GitHub Pages as a static site.

1. Push `main` to GitHub.
2. In GitHub, go to **Settings > Pages**.
3. Under **Build and deployment**, choose:
	 - **Source**: Deploy from a branch
	 - **Branch**: `main` / `/ (root)`
4. Save and wait for publishing.
5. Open your Pages URL and run the demo in each browser.

No extra bundling, frameworks, or server-side code is required.

## License

This project is licensed under the GNU Affero General Public License v3.0.
See `LICENSE` for full text.

## Governance and policy docs

- [ACCESSIBILITY.md](ACCESSIBILITY.md)
- [SUSTAINABILITY.md](SUSTAINABILITY.md)
- [AGENTS.md](AGENTS.md)

## Research notes

- [BROWSER_AI_SPECIFICS.md](BROWSER_AI_SPECIFICS.md)