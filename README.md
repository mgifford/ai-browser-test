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
- `LICENSE`: GNU Affero General Public License v3.0 (AGPL-3.0)
- `.nojekyll`: Ensures GitHub Pages serves files as-is
- `ACCESSIBILITY.md`: Accessibility commitments and checklist
- `SUSTAINABILITY.md`: Sustainability goals and practices
- `AGENTS.md`: Agent workflow and repository conventions

## Demo features

- Browser profile switcher for Chrome, Firefox, and Edge
- Capability matrix for AI-related browser functionality
- AI prompt simulator modes:
	- Summarize
	- Rewrite for executive audience
	- Compare options
- Scenario presets:
	- Shopping assistant
	- Research sprint
	- Accessibility check
	- Security posture review
- Built-in AI API test panel with one-click detection for common interfaces:
	- Prompt API candidates
	- Summarizer API
	- Writer API
	- Rewriter API
	- Translator API
	- Language Detector API
	- On-device ML signals
- Dynamic talk track for presentation flow
- Responsive layout for desktop and mobile

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