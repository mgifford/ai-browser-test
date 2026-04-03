/**
 * Pure utility functions shared between the browser demo and the Node.js test suite.
 *
 * Browser usage: <script src="lib/utils.js"></script>
 *   – functions are attached to the global scope.
 * Node.js usage: const { … } = require('./docs/lib/utils');
 */

/* eslint-disable no-var */

/**
 * Count non-empty paragraphs (sections separated by blank lines) in text.
 * @param {string} text
 * @returns {number}
 */
function paragraphCount(text) {
  if (!text) return 0;
  return text
    .split(/\n\s*\n/g)
    .map(function (part) { return part.trim(); })
    .filter(Boolean)
    .length;
}

/**
 * Count words in text (whitespace-delimited tokens).
 * @param {string} text
 * @returns {number}
 */
function wordCount(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count sentences in text (split on . ! ?).
 * @param {string} text
 * @returns {number}
 */
function sentenceCount(text) {
  return (text || "").split(/[.!?]+/).map(function (s) { return s.trim(); }).filter(Boolean).length;
}

/**
 * Return the first sentence of each paragraph, up to maxSentences entries.
 * @param {string} text
 * @param {number} [maxSentences=4]
 * @returns {string[]}
 */
function extractLeadSentences(text, maxSentences) {
  if (maxSentences === undefined) maxSentences = 4;
  var paragraphs = (text || "")
    .split(/\n\s*\n/g)
    .map(function (p) { return p.trim(); })
    .filter(Boolean);
  var leads = [];
  for (var i = 0; i < paragraphs.length; i++) {
    var para = paragraphs[i];
    var first = para.split(/(?<=[.!?])\s+/)[0] || para;
    if (first.trim()) leads.push(first.trim());
    if (leads.length >= maxSentences) break;
  }
  return leads;
}

/**
 * Pick a uniformly random element from an array.
 * Returns null when the array is empty.
 * @param {Array} array
 * @returns {*}
 */
function pickRandom(array) {
  if (!array.length) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Return a randomly shuffled subset of up to `size` elements (Fisher-Yates).
 * @param {Array} array
 * @param {number} size
 * @returns {Array}
 */
function pickRandomSubset(array, size) {
  var copy = array.slice();
  for (var i = copy.length - 1; i > 0; i -= 1) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
  }
  return copy.slice(0, size);
}

/**
 * Normalize an availability value returned by a browser AI API.
 * @param {*} rawValue
 * @returns {{ text: string, ready: boolean }}
 */
function normalizeAvailability(rawValue) {
  if (typeof rawValue === "undefined") return { text: "unknown", ready: false };
  var text = String(rawValue).toLowerCase();
  // Explicit "not available" patterns take precedence so that hyphenated forms
  // like "not-available" are not accidentally matched by the ready pattern below.
  var notReady = /\bnot[- ]available\b/.test(text);
  // Use word-boundary regex to avoid false positives
  // (e.g. "unavailable" must not match "available", "already" must not match "ready").
  var ready = !notReady && /\b(available|readily|ready|yes)\b/.test(text);
  return { text: text, ready: ready };
}

/**
 * Map a capability matrix cell value to its CSS class name.
 * @param {string} value  "Strong" | "Medium" | "Emerging" | anything else
 * @returns {string}  "ok" | "warn" | "no"
 */
function getCellClass(value) {
  if (value === "Strong") return "ok";
  if (value === "Medium" || value === "Emerging") return "warn";
  return "no";
}

/**
 * Resolve a dot-separated property path on a root object.
 * Returns undefined at the first missing segment rather than throwing.
 * @param {object} root  Starting object (e.g. window in browser context)
 * @param {string} path  Dot-separated key sequence, e.g. "ai.languageModel"
 * @returns {*}
 */
function resolveObjectPath(root, path) {
  if (!path) return root;
  return path.split(".").reduce(function (acc, key) {
    if (acc == null) return undefined;
    return acc[key];
  }, root);
}

/**
 * Build an AI-style simulated response for the prompt simulator.
 * Pure function – no DOM or global state accessed.
 *
 * @param {string} promptText   The user's prompt / source text.
 * @param {string} mode         One of "summarize" | "rewrite" | "compare".
 * @param {{ label: string, voice: string }} profile  Browser profile metadata.
 * @returns {string}
 */
function generateResponse(promptText, mode, profile) {
  var clean = promptText.replace(/\s+/g, " ").trim();
  var clipped = clean.slice(0, 140) || "the selected page";
  var leads = extractLeadSentences(promptText, 4);
  var words = wordCount(promptText);
  var paras = paragraphCount(promptText);

  if (mode === "summarize") {
    return [
      profile.label + " AI (" + profile.voice + ")",
      "Summary signal: analyzed " + words + " words across " + paras + " paragraphs.",
      "Scope: " + clipped.toLowerCase() + ".",
      "Lead points:",
      leads.map(function (line, idx) { return (idx + 1) + ") " + line; }).join("\n"),
      "Top actions:",
      "1) Capture key points into a short brief.",
      "2) Ask follow-up questions on risk, cost, and timeline.",
      "3) Save an AI-generated checklist for next steps."
    ].join("\n");
  }

  if (mode === "rewrite") {
    return [
      profile.label + " AI (" + profile.voice + ")",
      "Executive rewrite:",
      "This topic can be summarized as: " + clipped + ".",
      "Recommendation: prioritize low-risk pilots, define success metrics, and review governance before scaling.",
      "Readability target: concise language for " + (words > 700 ? "long-form" : "short-form") + " input."
    ].join("\n");
  }

  return [
    profile.label + " AI (" + profile.voice + ")",
    "Comparison output:",
    "Option A: Faster rollout, lower setup effort.",
    "Option B: Better controls, higher governance confidence.",
    "Suggested direction: start with A, then evolve toward B for long-term resilience."
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Node.js CommonJS export — ignored when loaded as a classic browser script.
// ---------------------------------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    paragraphCount,
    wordCount,
    sentenceCount,
    extractLeadSentences,
    pickRandom,
    pickRandomSubset,
    normalizeAvailability,
    getCellClass,
    resolveObjectPath,
    generateResponse
  };
}
