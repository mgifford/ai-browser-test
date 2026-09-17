/* AUTO-SYNCED from src/ai-detector.js — do not edit here. Run `npm run sync:detector` after changing the source. */
/**
 * ai-detector — zero-dependency browser AI capability & readiness detector.
 *
 * Detects built-in on-device AI APIs, page context readiness for browser-level
 * assistants (Firefox/Mistral, Safari/Apple Intelligence, Edge Copilot, etc.),
 * and privacy/opt-out controls, returning a single structured report.
 *
 * Design goals:
 *   - Strict feature detection ('name' in globalThis) — never touch missing APIs.
 *   - Non-blocking async: every capability probe is awaited with a guarded
 *     try/catch so no unhandled promise rejection can escape.
 *   - Works in a page (window/document present) and in Node/worker (degrades
 *     gracefully to "unsupported" / empty DOM audit).
 *
 * Usage:
 *   ES module:   import { detectBrowserAI } from './src/ai-detector.js';
 *   CommonJS:    const { detectBrowserAI } = require('./src/ai-detector.js');
 *   Script tag:  <script src="src/ai-detector.js"></script> then
 *                window.aiDetector.detectBrowserAI()
 *
 * @typedef {'readily' | 'after-download' | 'no' | 'unsupported'} PromptApiStatus
 */

(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    // CommonJS / Node
    module.exports = api;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
      return api;
    });
  }
  // Always expose on the global for classic <script> usage. Harmless in Node.
  if (root) {
    root.aiDetector = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Environment helpers
  // ---------------------------------------------------------------------------

  /** The global object, regardless of environment. */
  const GLOBAL = typeof globalThis !== "undefined" ? globalThis : {};

  /** `window` when in a browser, otherwise the global (so `'x' in scope` is safe). */
  const scope = typeof window !== "undefined" ? window : GLOBAL;

  /** `document` when available, otherwise null. */
  const doc = typeof document !== "undefined" ? document : null;

  /**
   * Resolve a dot-separated property path without throwing on missing segments.
   * @param {object} obj
   * @param {string} path e.g. "ai.languageModel"
   * @returns {*} the value, or undefined if any segment is missing
   */
  function getPath(obj, path) {
    if (!obj || !path) return undefined;
    return path.split(".").reduce((acc, key) => {
      if (acc == null) return undefined;
      return acc[key];
    }, obj);
  }

  /**
   * Return the first defined value produced by resolving each candidate path
   * against the given scope. Used to prefer modern globals over legacy ones.
   * @param {object} obj
   * @param {string[]} paths
   * @returns {*}
   */
  function firstDefined(obj, paths) {
    for (const p of paths) {
      const value = getPath(obj, p);
      if (typeof value !== "undefined" && value !== null) return value;
    }
    return undefined;
  }

  /**
   * Normalize the many historical availability strings into the canonical
   * PromptApiStatus values.
   *
   * Chrome has used several vocabularies over time:
   *   - Current: "available" | "downloadable" | "downloading" | "unavailable"
   *   - Legacy:  "readily"   | "after-download" | "no"
   *
   * @param {unknown} raw
   * @returns {PromptApiStatus}
   */
  function normalizeStatus(raw) {
    if (typeof raw === "undefined" || raw === null) return "unsupported";
    const text = String(raw).toLowerCase().trim();
    // Order matters: check "not available" forms before "available".
    if (/\b(no|unavailable|not[- ]available)\b/.test(text)) return "no";
    if (/\b(available|readily|ready|yes)\b/.test(text)) return "readily";
    if (/\b(after[- ]download|downloadable|downloading)\b/.test(text)) {
      return "after-download";
    }
    return "no";
  }

  // ---------------------------------------------------------------------------
  // Chromium built-in AI (WICG on-device) detection
  // ---------------------------------------------------------------------------

  /**
   * Query an availability status for a built-in AI API, preferring the modern
   * global-constructor shape (e.g. `LanguageModel.availability()`) and falling
   * back to the legacy `window.ai.*` namespace with `.capabilities()`.
   *
   * @param {object} cfg
   * @param {string[]} cfg.modern  Global paths to the modern constructor, e.g. ["LanguageModel"]
   * @param {string[]} [cfg.legacy] Paths to the legacy object, e.g. ["ai.languageModel", "ai.assistant"]
   * @returns {Promise<PromptApiStatus>}
   */
  async function probeAvailability(cfg) {
    const modern = firstDefined(scope, cfg.modern || []);
    const legacy = firstDefined(scope, cfg.legacy || []);
    const target = modern || legacy;

    // Nothing present at all in this runtime.
    if (typeof target === "undefined") return "unsupported";

    try {
      // Modern surface: `availability()` returns a status string.
      if (typeof target.availability === "function") {
        const status = await target.availability();
        return normalizeStatus(status);
      }
      // Legacy surface: `capabilities()` returns { available: "readily" | ... }.
      if (typeof target.capabilities === "function") {
        const caps = await target.capabilities();
        return normalizeStatus(caps && (caps.available ?? caps.availability));
      }
      // Present but no known probe method — treat as detected-but-unknown.
      // "readily" would overstate it; report "no" (present, not usable via probe).
      return "no";
    } catch (_err) {
      // Any thrown/rejected probe (e.g. blocked in insecure context) is swallowed.
      return "no";
    }
  }

  /**
   * Detect the Prompt (language model) API status, including legacy fallbacks.
   * @returns {Promise<PromptApiStatus>}
   */
  function probePromptApi() {
    return probeAvailability({
      modern: ["LanguageModel", "ai.languageModel"],
      legacy: ["ai.assistant"]
    });
  }

  /**
   * Return true when a task-specific built-in API is present in this runtime.
   * Presence only — availability status is resolved separately when requested.
   * @param {object} cfg
   * @param {string[]} cfg.modern
   * @param {string[]} [cfg.legacy]
   * @returns {boolean}
   */
  function isPresent(cfg) {
    const modern = firstDefined(scope, cfg.modern || []);
    const legacy = firstDefined(scope, cfg.legacy || []);
    return typeof (modern || legacy) !== "undefined";
  }

  const TASK_APIS = {
    summarizer: { modern: ["Summarizer", "ai.summarizer"] },
    translator: { modern: ["Translator", "ai.translator"] },
    languageDetector: {
      modern: ["LanguageDetector", "ai.languageDetector"]
    },
    writer: { modern: ["Writer", "ai.writer"] },
    rewriter: { modern: ["Rewriter", "ai.rewriter"] }
  };

  /**
   * Detect all Chromium built-in AI capabilities.
   * @returns {Promise<import('./ai-detector').ChromeBuiltInAI>}
   */
  async function detectChromeBuiltInAI() {
    const promptApi = await probePromptApi();
    return {
      promptApi,
      summarizer: isPresent(TASK_APIS.summarizer),
      translator: isPresent(TASK_APIS.translator),
      languageDetector: isPresent(TASK_APIS.languageDetector),
      writer: isPresent(TASK_APIS.writer),
      rewriter: isPresent(TASK_APIS.rewriter)
    };
  }

  /**
   * Optional safe "ping": ask the Prompt API to echo a short token to confirm
   * end-to-end execution. Never throws; resolves to a structured result.
   *
   * Only attempts execution when the model is already "readily" available so it
   * does not trigger a large download. Pass { allowDownload: true } to permit an
   * "after-download" model to be created.
   *
   * @param {object} [opts]
   * @param {boolean} [opts.allowDownload=false]
   * @param {number} [opts.timeoutMs=8000]
   * @returns {Promise<{ ok: boolean, status: PromptApiStatus, output?: string, error?: string }>}
   */
  async function pingPromptApi(opts) {
    const options = Object.assign({ allowDownload: false, timeoutMs: 8000 }, opts);
    const status = await probePromptApi();

    if (status === "unsupported") {
      return { ok: false, status, error: "Prompt API not present in this runtime." };
    }
    if (status === "no") {
      return { ok: false, status, error: "Prompt API present but not available." };
    }
    if (status === "after-download" && !options.allowDownload) {
      return {
        ok: false,
        status,
        error: "Model requires download; pass { allowDownload: true } to proceed."
      };
    }

    const factory = firstDefined(scope, ["LanguageModel", "ai.languageModel", "ai.assistant"]);
    if (!factory || typeof factory.create !== "function") {
      return { ok: false, status, error: "No create() method on the Prompt API." };
    }

    let session;
    try {
      session = await withTimeout(factory.create(), options.timeoutMs, "create");
      const output = await withTimeout(
        session.prompt("Respond with 'OK' and nothing else."),
        options.timeoutMs,
        "prompt"
      );
      return { ok: true, status, output: String(output).trim() };
    } catch (err) {
      return { ok: false, status, error: (err && err.message) || String(err) };
    } finally {
      // Best-effort cleanup — supported on modern sessions.
      try {
        if (session && typeof session.destroy === "function") session.destroy();
      } catch (_e) {
        /* ignore */
      }
    }
  }

  /**
   * Reject a promise if it does not settle within `ms` milliseconds.
   * @template T
   * @param {Promise<T>} promise
   * @param {number} ms
   * @param {string} label
   * @returns {Promise<T>}
   */
  function withTimeout(promise, ms, label) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timed out after ${ms}ms during ${label}.`));
      }, ms);
      Promise.resolve(promise).then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Page context readiness (Firefox/Mistral Smart Window, sidebar assistants)
  // ---------------------------------------------------------------------------

  /**
   * Score how easily a browser-level context engine can extract the main
   * content of this page. Pure DOM inspection — no AI required.
   *
   * The score (0-100) rewards semantic structure that context extractors rely
   * on: a single <main>, article landmarks, a sane heading hierarchy, ARIA
   * landmarks, and a healthy text-to-markup ratio.
   *
   * @param {Document|null} [document_=doc]
   * @returns {import('./ai-detector').ContextReadiness}
   */
  function auditContextReadiness(document_) {
    const d = typeof document_ !== "undefined" ? document_ : doc;
    if (!d || typeof d.querySelectorAll !== "function") {
      return {
        score: 0,
        hasSemanticMain: false,
        hasAriaLandmarks: false,
        headingCount: 0,
        landmarkCount: 0,
        textToCodeRatio: 0
      };
    }

    const mains = d.querySelectorAll("main, [role='main']");
    const articles = d.querySelectorAll("article");
    const headings = d.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const landmarks = d.querySelectorAll(
      "main, nav, header, footer, aside, section[aria-label], section[aria-labelledby], " +
        "[role='main'], [role='navigation'], [role='banner'], [role='contentinfo'], " +
        "[role='complementary'], [role='region'], [role='article'], [role='search']"
    );
    const h1Count = d.querySelectorAll("h1").length;

    const hasSemanticMain = mains.length > 0;
    const hasAriaLandmarks = landmarks.length > 0;
    const textToCodeRatio = computeTextToCodeRatio(d);

    // Scoring rubric (weights sum to 100).
    let score = 0;
    if (hasSemanticMain) score += 25; // single clear content region
    if (mains.length === 1) score += 5; // exactly one <main> is ideal
    if (articles.length > 0) score += 10;
    if (headings.length > 0) score += 10;
    if (h1Count === 1) score += 10; // exactly one top-level heading
    else if (h1Count > 1) score += 3; // multiple h1s are usable but noisier
    if (hasAriaLandmarks) score += 15;
    if (landmarks.length >= 3) score += 5; // richly landmarked page
    // Text-to-code ratio: reward content-dense pages (up to 20 points).
    score += Math.round(Math.min(textToCodeRatio, 0.5) / 0.5 * 20);

    return {
      score: Math.max(0, Math.min(100, score)),
      hasSemanticMain,
      hasAriaLandmarks,
      headingCount: headings.length,
      landmarkCount: landmarks.length,
      textToCodeRatio: Number(textToCodeRatio.toFixed(3))
    };
  }

  /**
   * Ratio of visible text length to total serialized HTML length (0-1).
   * A higher ratio means less markup overhead per unit of content — easier for
   * sidebar assistants and reader/summarization engines to extract.
   * @param {Document} d
   * @returns {number}
   */
  function computeTextToCodeRatio(d) {
    try {
      const body = d.body;
      if (!body) return 0;
      const text = (body.textContent || "").replace(/\s+/g, " ").trim();
      const html = body.innerHTML || "";
      if (!html.length) return 0;
      return text.length / html.length;
    } catch (_e) {
      return 0;
    }
  }

  /**
   * Detect extension / sidebar context readiness. Only meaningful when this
   * code runs inside a WebExtension context; on a normal page these are absent.
   * @returns {import('./ai-detector').ExtensionContext}
   */
  function detectExtensionContext() {
    const browserNs = firstDefined(scope, ["browser", "chrome"]);
    const hasSidebarAction =
      typeof getPath(browserNs, "sidebarAction") !== "undefined" ||
      typeof getPath(browserNs, "sidePanel") !== "undefined";
    const hasRuntimeMessaging =
      typeof getPath(browserNs, "runtime.sendMessage") === "function";
    return {
      inExtensionContext: hasSidebarAction || hasRuntimeMessaging,
      hasSidebarAction,
      hasRuntimeMessaging
    };
  }

  // ---------------------------------------------------------------------------
  // Privacy / assistant opt-out controls
  // ---------------------------------------------------------------------------

  /**
   * Audit page-level directives that control assistant/AI access to content:
   *   - <meta name="robots" content="noai, noimageai"> (opt-out signals)
   *   - data-nosnippet attributes on elements
   *
   * @param {Document|null} [document_=doc]
   * @returns {import('./ai-detector').PrivacyControls}
   */
  function auditPrivacyControls(document_) {
    const d = typeof document_ !== "undefined" ? document_ : doc;
    if (!d || typeof d.querySelectorAll !== "function") {
      return {
        noAiMeta: false,
        noImageAiMeta: false,
        noSnippetMeta: false,
        noSnippetElements: 0,
        robotsContent: ""
      };
    }

    let robotsContent = "";
    const metas = d.querySelectorAll(
      "meta[name='robots'], meta[name='googlebot'], meta[name='ai'], meta[name='ai-content-declaration']"
    );
    metas.forEach((m) => {
      const content = (m.getAttribute("content") || "").toLowerCase();
      if (content) robotsContent += (robotsContent ? "; " : "") + content;
    });

    const noAiMeta = /\bnoai\b/.test(robotsContent);
    const noImageAiMeta = /\bnoimageai\b/.test(robotsContent);
    const noSnippetMeta = /\bnosnippet\b/.test(robotsContent);
    const noSnippetElements = d.querySelectorAll("[data-nosnippet]").length;

    return {
      noAiMeta,
      noImageAiMeta,
      noSnippetMeta,
      noSnippetElements,
      robotsContent
    };
  }

  // ---------------------------------------------------------------------------
  // Safari / Apple Intelligence & schema.org audits
  // ---------------------------------------------------------------------------

  /**
   * Audit input elements for Writing Tools compatibility. Apple Intelligence
   * Writing Tools bulk-replace text; well-behaved fields must fire standard
   * `input`/`change` events so frameworks stay in sync. This audit reports the
   * counts and flags plausibly risky fields (contenteditable without a role).
   *
   * It does not synthesize events — it inventories the editable surfaces.
   *
   * @param {Document|null} [document_=doc]
   * @returns {import('./ai-detector').WritingToolsAudit}
   */
  function auditWritingTools(document_) {
    const d = typeof document_ !== "undefined" ? document_ : doc;
    if (!d || typeof d.querySelectorAll !== "function") {
      return { textInputs: 0, textAreas: 0, contentEditables: 0, riskyContentEditables: 0 };
    }
    const textInputs = d.querySelectorAll(
      "input[type='text'], input[type='search'], input[type='email'], input[type='url'], input:not([type])"
    ).length;
    const textAreas = d.querySelectorAll("textarea").length;
    const editables = d.querySelectorAll("[contenteditable='true'], [contenteditable='']");
    let riskyContentEditables = 0;
    editables.forEach((el) => {
      // A contenteditable region with no textbox role is harder for assistive
      // tech and for frameworks tracking programmatic edits.
      const role = (el.getAttribute("role") || "").toLowerCase();
      if (role !== "textbox") riskyContentEditables += 1;
    });
    return {
      textInputs,
      textAreas,
      contentEditables: editables.length,
      riskyContentEditables
    };
  }

  /**
   * Audit structured-data markup used by Safari Highlights / summarization and
   * other reader engines: JSON-LD blocks, microdata (itemscope), and RDFa.
   * @param {Document|null} [document_=doc]
   * @returns {import('./ai-detector').StructuredDataAudit}
   */
  function auditStructuredData(document_) {
    const d = typeof document_ !== "undefined" ? document_ : doc;
    if (!d || typeof d.querySelectorAll !== "function") {
      return { jsonLdBlocks: 0, microdataItems: 0, rdfaItems: 0, hasStructuredData: false };
    }
    const jsonLdBlocks = d.querySelectorAll("script[type='application/ld+json']").length;
    const microdataItems = d.querySelectorAll("[itemscope]").length;
    const rdfaItems = d.querySelectorAll("[typeof], [property]").length;
    return {
      jsonLdBlocks,
      microdataItems,
      rdfaItems,
      hasStructuredData: jsonLdBlocks + microdataItems + rdfaItems > 0
    };
  }

  // ---------------------------------------------------------------------------
  // Browser + environment identification
  // ---------------------------------------------------------------------------

  /**
   * Best-effort browser family from the user agent. Order matters: brand-check
   * the more specific engines before the generic ones.
   * @returns {string}
   */
  function detectBrowser() {
    const nav = typeof navigator !== "undefined" ? navigator : null;
    const ua = (nav && nav.userAgent) || "";
    if (!ua) return "unknown";
    if (/\bEdg(A|iOS|)?\//.test(ua)) return "Edge";
    if (/\bOPR\/|\bOpera\b/.test(ua)) return "Opera";
    if (/\bBrave\b/.test(ua) || (nav && nav.brave)) return "Brave";
    if (/\bArc\b/.test(ua)) return "Arc";
    if (/\bFirefox\/|\bFxiOS\//.test(ua)) return "Firefox";
    if (/\bChrome\/|\bCriOS\//.test(ua)) return "Chrome";
    if (/\bSafari\//.test(ua) && /\bVersion\//.test(ua)) return "Safari";
    return "unknown";
  }

  /**
   * Whether the current context is a secure context (https or localhost).
   * Built-in AI APIs require a secure context; this flags a common failure mode.
   * @returns {boolean}
   */
  function isSecureContext() {
    if (typeof scope.isSecureContext === "boolean") return scope.isSecureContext;
    const loc = typeof location !== "undefined" ? location : null;
    if (!loc) return false;
    return (
      loc.protocol === "https:" ||
      loc.hostname === "localhost" ||
      loc.hostname === "127.0.0.1" ||
      loc.hostname === "[::1]"
    );
  }

  // ---------------------------------------------------------------------------
  // Main entry point
  // ---------------------------------------------------------------------------

  /**
   * Run the full detection suite and return a structured report.
   *
   * @param {object} [options]
   * @param {boolean} [options.ping=false]  Also run a safe Prompt API "ping".
   * @param {boolean} [options.allowDownload=false]  Permit ping to download a model.
   * @param {Document} [options.document]  DOM to audit (defaults to the live document).
   * @returns {Promise<import('./ai-detector').AIBrowserReport>}
   */
  async function detectBrowserAI(options) {
    const opts = options || {};
    const targetDoc = opts.document || doc;

    const chromeBuiltInAI = await detectChromeBuiltInAI();

    /** @type {import('./ai-detector').AIBrowserReport} */
    const report = {
      browser: detectBrowser(),
      secureContext: isSecureContext(),
      timestamp: new Date().toISOString(),
      chromeBuiltInAI,
      contextReadiness: auditContextReadiness(targetDoc),
      extensionContext: detectExtensionContext(),
      privacyControls: auditPrivacyControls(targetDoc),
      writingTools: auditWritingTools(targetDoc),
      structuredData: auditStructuredData(targetDoc)
    };

    if (opts.ping) {
      report.promptPing = await pingPromptApi({ allowDownload: !!opts.allowDownload });
    }

    return report;
  }

  return {
    detectBrowserAI,
    // Granular exports for targeted use / testing.
    detectBrowser,
    detectChromeBuiltInAI,
    pingPromptApi,
    auditContextReadiness,
    detectExtensionContext,
    auditPrivacyControls,
    auditWritingTools,
    auditStructuredData,
    isSecureContext,
    // Low-level helpers (exported to keep them unit-testable).
    normalizeStatus,
    computeTextToCodeRatio
  };
});
