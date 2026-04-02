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
    getCellClass
  };
}
