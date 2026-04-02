"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  paragraphCount,
  wordCount,
  sentenceCount,
  extractLeadSentences,
  pickRandom,
  pickRandomSubset,
  normalizeAvailability,
  getCellClass
} = require("../docs/lib/utils");

// ---------------------------------------------------------------------------
// paragraphCount
// ---------------------------------------------------------------------------

describe("paragraphCount", () => {
  it("returns 0 for empty string", () => {
    assert.equal(paragraphCount(""), 0);
  });

  it("returns 0 for null / undefined", () => {
    assert.equal(paragraphCount(null), 0);
    assert.equal(paragraphCount(undefined), 0);
  });

  it("returns 0 for whitespace-only string", () => {
    assert.equal(paragraphCount("   "), 0);
  });

  it("returns 1 for a single paragraph (no blank lines)", () => {
    assert.equal(paragraphCount("Hello world."), 1);
  });

  it("returns 2 for two paragraphs separated by a blank line", () => {
    assert.equal(paragraphCount("First paragraph.\n\nSecond paragraph."), 2);
  });

  it("returns 3 for three paragraphs", () => {
    const text = "Para one.\n\nPara two.\n\nPara three.";
    assert.equal(paragraphCount(text), 3);
  });

  it("ignores extra blank lines between paragraphs", () => {
    const text = "Alpha.\n\n\n\nBeta.";
    assert.equal(paragraphCount(text), 2);
  });

  it("counts a paragraph that contains embedded newlines (not blank lines)", () => {
    const text = "Line one.\nLine two.\n\nNext paragraph.";
    assert.equal(paragraphCount(text), 2);
  });

  it("handles Windows-style CRLF line endings gracefully", () => {
    const text = "First.\r\n\r\nSecond.";
    assert.equal(paragraphCount(text), 2);
  });
});

// ---------------------------------------------------------------------------
// wordCount
// ---------------------------------------------------------------------------

describe("wordCount", () => {
  it("returns 0 for empty string", () => {
    assert.equal(wordCount(""), 0);
  });

  it("returns 0 for null / undefined", () => {
    assert.equal(wordCount(null), 0);
    assert.equal(wordCount(undefined), 0);
  });

  it("returns 0 for whitespace-only string", () => {
    assert.equal(wordCount("   "), 0);
  });

  it("counts a single word", () => {
    assert.equal(wordCount("hello"), 1);
  });

  it("counts multiple words separated by single spaces", () => {
    assert.equal(wordCount("one two three"), 3);
  });

  it("handles multiple spaces between words", () => {
    assert.equal(wordCount("one  two   three"), 3);
  });

  it("handles leading and trailing whitespace", () => {
    assert.equal(wordCount("  hello world  "), 2);
  });

  it("counts newlines as whitespace separators", () => {
    assert.equal(wordCount("hello\nworld"), 2);
  });

  it("handles a longer real-world sentence", () => {
    const sentence = "The quick brown fox jumps over the lazy dog";
    assert.equal(wordCount(sentence), 9);
  });
});

// ---------------------------------------------------------------------------
// sentenceCount
// ---------------------------------------------------------------------------

describe("sentenceCount", () => {
  it("returns 0 for empty string", () => {
    assert.equal(sentenceCount(""), 0);
  });

  it("returns 0 for null / undefined", () => {
    assert.equal(sentenceCount(null), 0);
    assert.equal(sentenceCount(undefined), 0);
  });

  it("returns 1 for a single sentence ending with a period", () => {
    assert.equal(sentenceCount("Hello world."), 1);
  });

  it("returns 1 for a sentence ending with a question mark", () => {
    assert.equal(sentenceCount("How are you?"), 1);
  });

  it("returns 1 for a sentence ending with an exclamation mark", () => {
    assert.equal(sentenceCount("Watch out!"), 1);
  });

  it("returns 2 for two sentences", () => {
    assert.equal(sentenceCount("First sentence. Second sentence."), 2);
  });

  it("returns 3 for three mixed-terminator sentences", () => {
    assert.equal(sentenceCount("Yes! Really? Absolutely."), 3);
  });

  it("treats consecutive terminators as one boundary", () => {
    // "Hello..." should split into ['Hello', ''] but only the non-empty part counts
    assert.equal(sentenceCount("Hello..."), 1);
  });

  it("handles text without any sentence terminator as 1 sentence", () => {
    assert.equal(sentenceCount("No terminator here"), 1);
  });
});

// ---------------------------------------------------------------------------
// extractLeadSentences
// ---------------------------------------------------------------------------

describe("extractLeadSentences", () => {
  it("returns [] for empty string", () => {
    assert.deepEqual(extractLeadSentences(""), []);
  });

  it("returns [] for null / undefined", () => {
    assert.deepEqual(extractLeadSentences(null), []);
    assert.deepEqual(extractLeadSentences(undefined), []);
  });

  it("returns first sentence of a single-paragraph text", () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const leads = extractLeadSentences(text, 4);
    assert.equal(leads.length, 1);
    assert.equal(leads[0], "First sentence.");
  });

  it("returns one lead per paragraph", () => {
    const text = "Para one first. Para one more.\n\nPara two first. Para two more.";
    const leads = extractLeadSentences(text, 4);
    assert.equal(leads.length, 2);
    assert.equal(leads[0], "Para one first.");
    assert.equal(leads[1], "Para two first.");
  });

  it("respects the maxSentences cap", () => {
    const paragraphs = Array.from({ length: 6 }, (_, i) => `Paragraph ${i + 1} first. More text.`);
    const text = paragraphs.join("\n\n");
    const leads = extractLeadSentences(text, 3);
    assert.equal(leads.length, 3);
  });

  it("defaults maxSentences to 4", () => {
    const paragraphs = Array.from({ length: 6 }, (_, i) => `Paragraph ${i + 1}.`);
    const text = paragraphs.join("\n\n");
    const leads = extractLeadSentences(text);
    assert.equal(leads.length, 4);
  });

  it("falls back to full paragraph when no sentence terminator found", () => {
    const text = "No terminator here";
    const leads = extractLeadSentences(text, 4);
    assert.equal(leads.length, 1);
    assert.equal(leads[0], "No terminator here");
  });

  it("trims leading/trailing whitespace from each lead", () => {
    const text = "  Spaces around.  ";
    const leads = extractLeadSentences(text, 4);
    assert.equal(leads[0], "Spaces around.");
  });
});

// ---------------------------------------------------------------------------
// pickRandom
// ---------------------------------------------------------------------------

describe("pickRandom", () => {
  it("returns null for an empty array", () => {
    assert.equal(pickRandom([]), null);
  });

  it("returns the only element for a single-element array", () => {
    assert.equal(pickRandom(["only"]), "only");
  });

  it("always returns an element that is in the array", () => {
    const arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < 50; i++) {
      assert.ok(arr.includes(pickRandom(arr)));
    }
  });

  it("does not modify the original array", () => {
    const arr = [10, 20, 30];
    const copy = [...arr];
    pickRandom(arr);
    assert.deepEqual(arr, copy);
  });

  it("can return any element (coverage check over many calls)", () => {
    // With 3 elements and 300 draws the probability of missing any one is < 1e-43
    const arr = ["a", "b", "c"];
    const seen = new Set();
    for (let i = 0; i < 300; i++) seen.add(pickRandom(arr));
    assert.deepEqual([...seen].sort(), ["a", "b", "c"]);
  });
});

// ---------------------------------------------------------------------------
// pickRandomSubset
// ---------------------------------------------------------------------------

describe("pickRandomSubset", () => {
  it("returns [] for an empty array", () => {
    assert.deepEqual(pickRandomSubset([], 3), []);
  });

  it("returns [] when size is 0", () => {
    assert.deepEqual(pickRandomSubset([1, 2, 3], 0), []);
  });

  it("returns the full array when size equals length", () => {
    const arr = [1, 2, 3];
    const result = pickRandomSubset(arr, 3);
    assert.equal(result.length, 3);
    assert.deepEqual([...result].sort((a, b) => a - b), [1, 2, 3]);
  });

  it("returns a subset of the requested size", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = pickRandomSubset(arr, 3);
    assert.equal(result.length, 3);
    result.forEach((el) => assert.ok(arr.includes(el)));
  });

  it("does not return duplicates within the subset", () => {
    const arr = [10, 20, 30, 40, 50];
    for (let i = 0; i < 20; i++) {
      const result = pickRandomSubset(arr, 3);
      const unique = new Set(result);
      assert.equal(unique.size, 3);
    }
  });

  it("does not modify the original array", () => {
    const arr = [1, 2, 3, 4];
    const copy = [...arr];
    pickRandomSubset(arr, 2);
    assert.deepEqual(arr, copy);
  });

  it("returns all elements when size exceeds array length", () => {
    const arr = [1, 2];
    const result = pickRandomSubset(arr, 10);
    assert.equal(result.length, 2);
  });
});

// ---------------------------------------------------------------------------
// normalizeAvailability
// ---------------------------------------------------------------------------

describe("normalizeAvailability", () => {
  it("returns { text: 'unknown', ready: false } for undefined", () => {
    assert.deepEqual(normalizeAvailability(undefined), { text: "unknown", ready: false });
  });

  it("marks 'available' as ready", () => {
    const r = normalizeAvailability("available");
    assert.equal(r.ready, true);
  });

  it("marks 'readily' as ready", () => {
    const r = normalizeAvailability("readily");
    assert.equal(r.ready, true);
  });

  it("marks 'ready' as ready", () => {
    const r = normalizeAvailability("ready");
    assert.equal(r.ready, true);
  });

  it("marks 'yes' as ready", () => {
    const r = normalizeAvailability("yes");
    assert.equal(r.ready, true);
  });

  it("does NOT match 'unavailable' as ready (word boundary guard)", () => {
    const r = normalizeAvailability("unavailable");
    assert.equal(r.ready, false);
  });

  it("does NOT match 'already' as ready (word boundary guard)", () => {
    const r = normalizeAvailability("already");
    assert.equal(r.ready, false);
  });

  it("marks 'not-available' as not ready (hyphenated negation guard)", () => {
    const r = normalizeAvailability("not-available");
    assert.equal(r.ready, false);
  });

  it("marks 'not available' (space) as not ready", () => {
    const r = normalizeAvailability("not available");
    assert.equal(r.ready, false);
  });

  it("returns lowercased text", () => {
    const r = normalizeAvailability("Available");
    assert.equal(r.text, "available");
    assert.equal(r.ready, true);
  });

  it("marks 'no' as not ready", () => {
    const r = normalizeAvailability("no");
    assert.equal(r.ready, false);
  });

  it("marks numeric 0 as not ready", () => {
    const r = normalizeAvailability(0);
    assert.equal(r.ready, false);
  });

  it("marks null as not ready (stringifies to 'null')", () => {
    const r = normalizeAvailability(null);
    assert.equal(r.text, "null");
    assert.equal(r.ready, false);
  });
});

// ---------------------------------------------------------------------------
// getCellClass
// ---------------------------------------------------------------------------

describe("getCellClass", () => {
  it("returns 'ok' for 'Strong'", () => {
    assert.equal(getCellClass("Strong"), "ok");
  });

  it("returns 'warn' for 'Medium'", () => {
    assert.equal(getCellClass("Medium"), "warn");
  });

  it("returns 'warn' for 'Emerging'", () => {
    assert.equal(getCellClass("Emerging"), "warn");
  });

  it("returns 'no' for unknown values", () => {
    assert.equal(getCellClass("Weak"), "no");
    assert.equal(getCellClass(""), "no");
    assert.equal(getCellClass(undefined), "no");
    assert.equal(getCellClass(null), "no");
  });

  it("is case-sensitive (lowercase 'strong' returns 'no')", () => {
    assert.equal(getCellClass("strong"), "no");
  });
});
