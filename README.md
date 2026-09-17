# AI Browser Capability Demo

Interactive single-page app to demonstrate AI-enabled browsing in Chrome, Firefox, and Edge, including runtime probes for built-in AI behavior.

## What this is

This repo contains a static, front-end-only demo that works locally and on GitHub Pages.
It is designed for live presentations where you need to:

- Compare browser AI positioning and strengths
- Show what built-in AI browser interfaces are actually exposed at runtime

## Project files

- `src/ai-detector.js`: Zero-dependency detector module (UMD: works as a `<script>`, CommonJS `require`, and via the ESM wrapper)
- `src/ai-detector.mjs`: Native ES module wrapper with named exports
- `src/ai-detector.d.ts`: TypeScript type definitions for the report shape
- `docs/ai-detector.html`: Interactive diagnostic dashboard (test runner) served by GitHub Pages
- `docs/lib/ai-detector.js`: Auto-synced copy of the detector for the static site (do not edit by hand)
- `scripts/sync-detector.js`: Copies `src/ai-detector.js` into `docs/lib/` and can verify they are in sync
- `docs/index.html`: Main UI and demo logic (served by GitHub Pages)
- `docs/prompt-simulator.html`: AI Prompt Simulator — locally-simulated output to set expectations before testing in a real AI-enabled browser
- `docs/browser-ai-configuration.html`: Guide for enabling/testing AI abilities in browser beta/nightly channels
- `docs/experiment-recipes.html`: Hands-on experimentation lab with copy-ready prompts and source blocks
- `docs/data/prompt-simulator.yml`: Prompt library used by the simulator shuffle feature
- `docs/data/quick-scenarios.yml`: Quick scenario cards shown in the simulator
- `docs/data/sample-corpus.yml`: Long-form source corpus for benchmark testing
- `docs/.nojekyll`: Ensures GitHub Pages serves files as-is
- `LICENSE`: GNU Affero General Public License v3.0 (AGPL-3.0)
- `ACCESSIBILITY.md`: Accessibility commitments and checklist
- `SUSTAINABILITY.md`: Sustainability goals and practices
- `DEFINITION_OF_DONE.md`: Completion criteria for report-quality deliverables
- `AGENTS.md`: Agent workflow and repository conventions

## Demo features

- Browser profile switcher for Chrome, Firefox, and Edge
- Automatic runtime detection that highlights the currently used browser in Demo Profile
- Visible runtime channel chip that calls out prerelease channels (Beta/Canary/Nightly/Dev) for AI testing
- Capability matrix for AI-related browser functionality
- Runtime-first matrix ordering where the detected browser column is shown first
- Active browser column reflects live in-page capability status where measurable
- Clickable capability names with a Feature details panel and documentation links
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
- Prompt Test Bench with local JavaScript quality analysis:
	- Evaluate Prompt Quality: shows input length, word count, paragraph count, sentence count, and mode fit
	- Run Twice Consistency Check: runs the evaluation twice and confirms identical deterministic results
	- Modes: Summarize, Rewrite for executive audience, Compare options
- Built-in assistant probe for callable capabilities and local-vs-cloud observability limits
- On-device model identity probe (best-effort, browser-dependent)
- Responsive layout for desktop and mobile
- CO2.js-powered sustainability footer on HTML pages with page-weight and estimated CO2e disclosure
- AI Prompt Simulator (`prompt-simulator.html`) for setting expectations before testing in a real browser:
	- Browser profile selector (Chrome, Firefox, Edge) with expected voice and output style
	- Run AI Demo: locally-simulated output using JavaScript text analysis (no AI model required)
	- Shuffle Prompt Idea: random prompt from the YAML library with no consecutive duplicates
	- Load Benchmark Pack: loads long-form civic content for summarization testing
	- Quick Scenarios: 4 randomly selected scenario cards that load a prompt and auto-run
	- Reshuffle: refreshes the scenario cards from the YAML library
	- Graceful empty-input handling with a helpful nudge message
	- Clear "Simulator — Not Real AI Output" disclaimer throughout

## Quick start

No build step is required.

Runtime dependencies:

- Google Fonts stylesheet
- CO2.js loaded from jsDelivr ESM CDN

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

## `ai-detector` module

`src/ai-detector.js` is a lightweight, zero-dependency module that runs a full
feature-detection, DOM-readiness, and privacy audit and returns a single
structured report. It powers the interactive dashboard at
[docs/ai-detector.html](docs/ai-detector.html) and can be reused in your own
projects.

### Import options

```js
// ES module / bundler / Node ESM
import { detectBrowserAI } from "ai-browser-test";

// CommonJS
const { detectBrowserAI } = require("ai-browser-test");
```

```html
<!-- Classic script tag / CDN: attaches window.aiDetector -->
<script src="https://cdn.jsdelivr.net/gh/mgifford/ai-browser-test/src/ai-detector.js"></script>
<script>
  window.aiDetector.detectBrowserAI().then((report) => console.log(report));
</script>
```

### Basic usage

```js
const report = await detectBrowserAI();
console.log(report.browser);                    // "Chrome" | "Edge" | "Firefox" | ...
console.log(report.chromeBuiltInAI.promptApi);  // "readily" | "after-download" | "no" | "unsupported"
console.log(report.contextReadiness.score);     // 0-100

// Optional: run a safe end-to-end "ping" of the Prompt API.
const withPing = await detectBrowserAI({ ping: true, allowDownload: false });
console.log(withPing.promptPing); // { ok, status, output? , error? }
```

### Report shape

```ts
interface AIBrowserReport {
  browser: string;
  secureContext: boolean;               // built-in AI requires https/localhost
  timestamp: string;                    // ISO time the report was produced
  chromeBuiltInAI: {
    promptApi: "readily" | "after-download" | "no" | "unsupported";
    summarizer: boolean;
    translator: boolean;
    languageDetector: boolean;
    writer: boolean;
    rewriter: boolean;
  };
  contextReadiness: {
    score: number;                      // 0-100
    hasSemanticMain: boolean;
    hasAriaLandmarks: boolean;
    headingCount: number;
    landmarkCount: number;
    textToCodeRatio: number;            // 0-1
  };
  extensionContext: {
    inExtensionContext: boolean;
    hasSidebarAction: boolean;
    hasRuntimeMessaging: boolean;
  };
  privacyControls: {
    noAiMeta: boolean;
    noImageAiMeta: boolean;
    noSnippetMeta: boolean;
    noSnippetElements: number;
    robotsContent: string;
  };
  writingTools: {
    textInputs: number;
    textAreas: number;
    contentEditables: number;
    riskyContentEditables: number;      // contenteditable without role="textbox"
  };
  structuredData: {
    jsonLdBlocks: number;
    microdataItems: number;
    rdfaItems: number;
    hasStructuredData: boolean;
  };
  promptPing?: { ok: boolean; status: string; output?: string; error?: string };
}
```

### API reference

| Export | Returns | Purpose |
|---|---|---|
| `detectBrowserAI(options?)` | `Promise<AIBrowserReport>` | Run the full suite. Options: `{ ping, allowDownload, document }`. |
| `detectBrowser()` | `string` | Best-effort browser family from the user agent. |
| `detectChromeBuiltInAI()` | `Promise<ChromeBuiltInAI>` | Built-in AI capability block only. |
| `pingPromptApi(options?)` | `Promise<PromptPingResult>` | Safe execution test of the Prompt API. |
| `auditContextReadiness(document?)` | `ContextReadiness` | DOM semantic-density score. |
| `detectExtensionContext()` | `ExtensionContext` | WebExtension / sidebar signals. |
| `auditPrivacyControls(document?)` | `PrivacyControls` | `noai`/`nosnippet` opt-out audit. |
| `auditWritingTools(document?)` | `WritingToolsAudit` | Editable-surface inventory (Apple Intelligence). |
| `auditStructuredData(document?)` | `StructuredDataAudit` | schema.org / microdata / RDFa audit. |
| `isSecureContext()` | `boolean` | Whether AI APIs can run in this context. |

### Design notes

- **Strict feature detection.** APIs are resolved by presence
  (`'LanguageModel' in window`) and never touched when missing.
- **Current API surface with legacy fallback.** Modern global constructors
  (`LanguageModel`, `Summarizer`, `Translator`, `LanguageDetector`, `Writer`,
  `Rewriter`) with `.availability()` are probed first; the older
  `window.ai.*` / `window.ai.assistant` namespace with `.capabilities()` is a
  fallback. Status strings from both eras normalize to the same four values.
- **Non-blocking and safe.** Every probe is awaited inside `try/catch`, so a
  blocked or rejecting API cannot produce an unhandled promise rejection. The
  optional ping has a timeout and cleans up its session.
- **Secure-context aware.** Built-in AI requires https or localhost; the report
  flags this so `http` failures are explained rather than silent.

### Browser AI capability matrix

Feature detection targets these surfaces. Availability varies by browser,
version, channel, region, account, and experiment flags.

| Browser / assistant | What `ai-detector` checks |
|---|---|
| **Chrome / Edge (built-in on-device)** | Prompt, Summarizer, Translator, Language Detector, Writer, Rewriter APIs; availability status; optional execution ping |
| **Firefox (AI Window / Mistral)** | Context-readiness score, semantic landmarks, extension/sidebar hooks, AI opt-out directives |
| **Safari (Apple Intelligence)** | Writing Tools editable-surface audit, schema.org / microdata for Highlights & summarization |
| **Edge Copilot / Brave Leo / Opera Aria / Arc** | `data-nosnippet` and `noai`/`noimageai` meta controls, text-to-code ratio for sidebar extraction |

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
- [DEFINITION_OF_DONE.md](DEFINITION_OF_DONE.md)
- [AGENTS.md](AGENTS.md)
- [STYLES.md](STYLES.md)

## AI disclosure

This section discloses every AI tool used in this project — how it was used to build the project, whether AI runs during normal use, and which browser-based AI is invoked by the demo itself.

### AI used to build this project

| AI tool | Role |
|---|---|
| **GitHub Copilot** | Used as a coding assistant throughout development — generating code, writing and editing documentation, and implementing new features via Copilot-driven pull requests. |
| **Claude Code (Claude Opus)** | Used to build the `src/ai-detector.js` detection module, its TypeScript types, the `docs/ai-detector.html` dashboard, unit and end-to-end tests, and related documentation. No external code was copied; all implementations are original. |

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
