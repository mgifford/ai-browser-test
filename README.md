# AI Browser Capability Demo

Interactive single-page app to demonstrate AI-enabled browsing in Chrome, Firefox, and Edge, including runtime probes for built-in AI behavior.

## What this is

This repo contains a static, front-end-only demo that works locally and on GitHub Pages.
It is designed for live presentations where you need to:

- Compare browser AI positioning and strengths
- Run the same prompt flow across browser profiles
- Show what built-in AI browser interfaces are actually exposed at runtime

## Project files

- `docs/index.html`: Main UI and demo logic (served by GitHub Pages)
- `docs/browser-ai-configuration.html`: Guide for enabling/testing AI abilities in browser beta/nightly channels
- `docs/experiment-recipes.html`: Hands-on experimentation lab with copy-ready prompts and source blocks
- `docs/data/prompt-simulator.yml`: Randomized starter prompts and calls to action for AI Prompt Simulator
- `docs/data/quick-scenarios.yml`: Randomized Quick Scenarios shown on load
- `docs/data/sample-corpus.yml`: Local long-form source documents (5+ paragraphs) used for summarize testing
- `docs/.nojekyll`: Ensures GitHub Pages serves files as-is
- `LICENSE`: GNU Affero General Public License v3.0 (AGPL-3.0)
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
- Clickable capability names with a Feature details panel and documentation links
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
- Language Detector Playground with randomized multilingual samples and custom whole-page text testing
- Built-in assistant probe for callable capabilities and local-vs-cloud observability limits
- On-device model identity probe (best-effort, browser-dependent)
- Dynamic talk track for presentation flow
- Responsive layout for desktop and mobile
- CO2.js-powered sustainability footer on HTML pages with page-weight and estimated CO2e disclosure

## Quick start

No build step is required.

Runtime dependencies:

- Google Fonts stylesheet
- CO2.js loaded from jsDelivr ESM CDN
- YAML parser loaded from jsDelivr ESM CDN

If external CDNs are blocked/offline, the app remains usable with reduced functionality for those features.

1. Clone this repository.
2. Open `docs/index.html` in a browser.

Optional local server:

```bash
cd /workspaces/ai-browser-test
python3 -m http.server 8000
```

Then visit `http://localhost:8000/docs/`.

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
4. Includes feature-level probes for built-in assistant behavior and on-device model identity

## Customizing prompt and scenario content

You can edit sample content without touching JavaScript:

1. Update [docs/data/prompt-simulator.yml](docs/data/prompt-simulator.yml) to add or revise starter prompts and calls to action.
2. Update [docs/data/quick-scenarios.yml](docs/data/quick-scenarios.yml) to add or revise scenario cards.
3. Update [docs/data/sample-corpus.yml](docs/data/sample-corpus.yml) with richer source text for deeper summary tests.
4. Reload the page to see different randomized selections.

For summarize mode, the app now auto-injects a random local 5+ paragraph source document when a prompt is too short.

For guided testing and copy-ready assets, use:

- [docs/experiment-recipes.html](docs/experiment-recipes.html)

## Feature details and limits

The Feature details panel in [docs/index.html](docs/index.html):

1. Explains what each capability means in practice
2. Links to vendor docs/support pages for feature specifics
3. Exposes local probes where available

Important scope limits for browser-page probing:

- Exact cloud provider routing is usually not exposed to normal webpage JavaScript
- Model identity may be hidden even when local inference is available
- Assistant surface internals (for example, full Copilot UI behavior) are not fully introspectable from page scope

For setup guidance before testing, use:

- [docs/browser-ai-configuration.html](docs/browser-ai-configuration.html)

## GitHub Pages deployment

This repository is ready for GitHub Pages as a static site served from the `docs/` folder.

1. Push `main` to GitHub.
2. In GitHub, go to **Settings > Pages**.
3. Under **Build and deployment**, choose:
	 - **Source**: Deploy from a branch
	 - **Branch**: `main`, folder `/docs`
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
- [STYLES.md](STYLES.md)

## AI disclosure

This section discloses every AI tool used in this project — how it was used to build the project, whether AI runs during normal use, and which browser-based AI is invoked by the demo itself.

### AI used to build this project

| AI tool | Role |
|---|---|
| **GitHub Copilot** | Used as a coding assistant throughout development — generating code, writing and editing documentation, and implementing new features via Copilot-driven pull requests. |

### AI invoked when running the demo

The demo application itself probes and optionally invokes browser-built-in AI APIs when a user clicks test or run buttons. No AI runs automatically in the background; all invocations require an explicit user action.

| Browser / AI | When invoked |
|---|---|
| **Chrome Gemini Nano** (Prompt API, Summarizer API, Writer API, Rewriter API, Translator API, Language Detector API) | When a user clicks **Run Built-in Tests** or an individual API test button in Chrome with the relevant origin trial or flag enabled. |
| **Firefox AI** | When a user runs the built-in test panel in Firefox with AI features enabled in browser settings. |
| **Microsoft Edge Copilot** | When a user runs the built-in test panel in Edge; Copilot surface introspection is limited to what the browser exposes to page-scope JavaScript. |

### Browser-based AI: scope and limits

- All browser AI calls are made from page-scope JavaScript; cloud routing and model identity are not always exposed.
- The demo cannot access browser AI surfaces that are restricted to browser-internal or extension scope.
- Model identity probes are best-effort and browser-dependent; results may vary by version, channel, geography, account, and experiment flags.

## Research notes

- [BROWSER_AI_SPECIFICS.md](BROWSER_AI_SPECIFICS.md)