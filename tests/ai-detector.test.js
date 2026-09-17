"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const detector = require("../src/ai-detector");
const {
  normalizeStatus,
  computeTextToCodeRatio,
  auditContextReadiness,
  auditPrivacyControls,
  auditWritingTools,
  auditStructuredData,
  detectExtensionContext,
  detectChromeBuiltInAI,
  pingPromptApi,
  detectBrowserAI
} = detector;

// ---------------------------------------------------------------------------
// Minimal fake document. Selectors are matched against a flat list of fake
// elements by a tiny matcher covering only the selector forms the module uses.
// ---------------------------------------------------------------------------

/**
 * @param {Array<{tag:string, attrs?:object}>} elements
 * @param {{ text?: string, html?: string }} [body]
 */
function makeDoc(elements, body) {
  const els = elements.map((e) => makeEl(e.tag, e.attrs || {}));

  function matchesSimple(el, sel) {
    sel = sel.trim();
    // Attribute-only: [attr] or [attr='v']
    let m = sel.match(/^\[([a-zA-Z-]+)(?:=['"]([^'"]*)['"])?\]$/);
    if (m) {
      const [, name, val] = m;
      if (!(name in el.attrs)) return false;
      return typeof val === "undefined" ? true : String(el.attrs[name]) === val;
    }
    // tag[attr] or tag[attr='v'] or tag:not([type])
    m = sel.match(/^([a-zA-Z0-9]+)\[([a-zA-Z-]+)(?:=['"]([^'"]*)['"])?\]$/);
    if (m) {
      const [, tag, name, val] = m;
      if (el.tag !== tag.toLowerCase()) return false;
      if (!(name in el.attrs)) return false;
      return typeof val === "undefined" ? true : String(el.attrs[name]) === val;
    }
    m = sel.match(/^([a-zA-Z0-9]+):not\(\[([a-zA-Z-]+)\]\)$/);
    if (m) {
      const [, tag, name] = m;
      return el.tag === tag.toLowerCase() && !(name in el.attrs);
    }
    // Plain tag
    if (/^[a-zA-Z0-9]+$/.test(sel)) return el.tag === sel.toLowerCase();
    return false;
  }

  function querySelectorAll(selector) {
    const parts = selector.split(",").map((s) => s.trim());
    const matched = els.filter((el) => parts.some((p) => matchesSimple(el, p)));
    matched.forEach = Array.prototype.forEach.bind(matched);
    return matched;
  }

  return {
    querySelectorAll,
    body: body
      ? { textContent: body.text || "", innerHTML: body.html || "" }
      : { textContent: "", innerHTML: "" }
  };
}

function makeEl(tag, attrs) {
  return {
    tag: tag.toLowerCase(),
    attrs,
    getAttribute(name) {
      return name in attrs ? String(attrs[name]) : null;
    }
  };
}

// ---------------------------------------------------------------------------
// normalizeStatus
// ---------------------------------------------------------------------------

describe("normalizeStatus", () => {
  it("returns 'unsupported' for undefined/null", () => {
    assert.equal(normalizeStatus(undefined), "unsupported");
    assert.equal(normalizeStatus(null), "unsupported");
  });

  it("maps modern 'available' to 'readily'", () => {
    assert.equal(normalizeStatus("available"), "readily");
  });

  it("maps legacy 'readily' to 'readily'", () => {
    assert.equal(normalizeStatus("readily"), "readily");
  });

  it("maps 'downloadable'/'downloading' to 'after-download'", () => {
    assert.equal(normalizeStatus("downloadable"), "after-download");
    assert.equal(normalizeStatus("downloading"), "after-download");
    assert.equal(normalizeStatus("after-download"), "after-download");
  });

  it("maps 'unavailable'/'no'/'not-available' to 'no'", () => {
    assert.equal(normalizeStatus("unavailable"), "no");
    assert.equal(normalizeStatus("no"), "no");
    assert.equal(normalizeStatus("not-available"), "no");
  });

  it("does not confuse 'unavailable' with 'available'", () => {
    assert.notEqual(normalizeStatus("unavailable"), "readily");
  });
});

// ---------------------------------------------------------------------------
// computeTextToCodeRatio
// ---------------------------------------------------------------------------

describe("computeTextToCodeRatio", () => {
  it("returns 0 when there is no body", () => {
    assert.equal(computeTextToCodeRatio({}), 0);
  });

  it("returns 0 for empty html", () => {
    const d = makeDoc([], { text: "", html: "" });
    assert.equal(computeTextToCodeRatio(d), 0);
  });

  it("computes a ratio of text length to html length", () => {
    const d = makeDoc([], { text: "hello", html: "<p>hello</p>" });
    // 5 / 12
    assert.ok(Math.abs(computeTextToCodeRatio(d) - 5 / 12) < 1e-9);
  });
});

// ---------------------------------------------------------------------------
// auditContextReadiness
// ---------------------------------------------------------------------------

describe("auditContextReadiness", () => {
  it("returns a zero report for a null document", () => {
    const r = auditContextReadiness(null);
    assert.equal(r.score, 0);
    assert.equal(r.hasSemanticMain, false);
    assert.equal(r.hasAriaLandmarks, false);
  });

  it("scores a bare page low", () => {
    const d = makeDoc([{ tag: "div" }], { text: "x", html: "<div>x</div>" });
    const r = auditContextReadiness(d);
    assert.equal(r.hasSemanticMain, false);
    assert.ok(r.score < 30);
  });

  it("rewards a semantic, landmarked, content-dense page", () => {
    const d = makeDoc(
      [
        { tag: "main" },
        { tag: "article" },
        { tag: "nav" },
        { tag: "header" },
        { tag: "footer" },
        { tag: "h1" },
        { tag: "h2" },
        { tag: "h2" }
      ],
      { text: "a".repeat(60), html: "<main>" + "a".repeat(60) + "</main>" }
    );
    const r = auditContextReadiness(d);
    assert.equal(r.hasSemanticMain, true);
    assert.equal(r.hasAriaLandmarks, true);
    assert.equal(r.headingCount, 3);
    assert.ok(r.landmarkCount >= 4);
    assert.ok(r.score >= 70, `expected high score, got ${r.score}`);
  });

  it("gives partial credit for multiple h1s", () => {
    const one = auditContextReadiness(
      makeDoc([{ tag: "main" }, { tag: "h1" }], { text: "x", html: "<main>x</main>" })
    );
    const two = auditContextReadiness(
      makeDoc([{ tag: "main" }, { tag: "h1" }, { tag: "h1" }], {
        text: "x",
        html: "<main>x</main>"
      })
    );
    assert.ok(one.score > two.score, "single h1 should score higher than two h1s");
  });

  it("clamps score to 0-100", () => {
    const d = makeDoc(
      [{ tag: "main" }, { tag: "article" }, { tag: "nav" }, { tag: "h1" }],
      { text: "a".repeat(500), html: "<main>" + "a".repeat(500) + "</main>" }
    );
    const r = auditContextReadiness(d);
    assert.ok(r.score >= 0 && r.score <= 100);
  });
});

// ---------------------------------------------------------------------------
// auditPrivacyControls
// ---------------------------------------------------------------------------

describe("auditPrivacyControls", () => {
  it("returns a false/zero report for a null document", () => {
    const r = auditPrivacyControls(null);
    assert.equal(r.noAiMeta, false);
    assert.equal(r.noSnippetElements, 0);
  });

  it("detects noai / noimageai / nosnippet in robots meta", () => {
    const d = makeDoc([
      { tag: "meta", attrs: { name: "robots", content: "noai, noimageai, nosnippet" } }
    ]);
    const r = auditPrivacyControls(d);
    assert.equal(r.noAiMeta, true);
    assert.equal(r.noImageAiMeta, true);
    assert.equal(r.noSnippetMeta, true);
  });

  it("counts data-nosnippet elements", () => {
    const d = makeDoc([
      { tag: "span", attrs: { "data-nosnippet": "" } },
      { tag: "div", attrs: { "data-nosnippet": "" } },
      { tag: "p" }
    ]);
    const r = auditPrivacyControls(d);
    assert.equal(r.noSnippetElements, 2);
  });

  it("reports no opt-out when robots meta is a plain index directive", () => {
    const d = makeDoc([
      { tag: "meta", attrs: { name: "robots", content: "index, follow" } }
    ]);
    const r = auditPrivacyControls(d);
    assert.equal(r.noAiMeta, false);
    assert.equal(r.noSnippetMeta, false);
  });
});

// ---------------------------------------------------------------------------
// auditWritingTools
// ---------------------------------------------------------------------------

describe("auditWritingTools", () => {
  it("returns zeros for a null document", () => {
    const r = auditWritingTools(null);
    assert.equal(r.textInputs, 0);
    assert.equal(r.contentEditables, 0);
  });

  it("counts inputs, textareas and contenteditables", () => {
    const d = makeDoc([
      { tag: "input", attrs: { type: "text" } },
      { tag: "input", attrs: {} }, // no type -> text-like
      { tag: "input", attrs: { type: "checkbox" } }, // not text-like
      { tag: "textarea" },
      { tag: "div", attrs: { contenteditable: "true" } }
    ]);
    const r = auditWritingTools(d);
    assert.equal(r.textInputs, 2);
    assert.equal(r.textAreas, 1);
    assert.equal(r.contentEditables, 1);
  });

  it("flags contenteditable regions without a textbox role as risky", () => {
    const d = makeDoc([
      { tag: "div", attrs: { contenteditable: "true" } },
      { tag: "div", attrs: { contenteditable: "true", role: "textbox" } }
    ]);
    const r = auditWritingTools(d);
    assert.equal(r.contentEditables, 2);
    assert.equal(r.riskyContentEditables, 1);
  });
});

// ---------------------------------------------------------------------------
// auditStructuredData
// ---------------------------------------------------------------------------

describe("auditStructuredData", () => {
  it("returns a false report for a null document", () => {
    const r = auditStructuredData(null);
    assert.equal(r.hasStructuredData, false);
  });

  it("counts JSON-LD, microdata and RDFa", () => {
    const d = makeDoc([
      { tag: "script", attrs: { type: "application/ld+json" } },
      { tag: "div", attrs: { itemscope: "" } },
      { tag: "span", attrs: { property: "og:title" } }
    ]);
    const r = auditStructuredData(d);
    assert.equal(r.jsonLdBlocks, 1);
    assert.equal(r.microdataItems, 1);
    assert.equal(r.rdfaItems, 1);
    assert.equal(r.hasStructuredData, true);
  });
});

// ---------------------------------------------------------------------------
// detectExtensionContext (no extension globals in Node -> all false)
// ---------------------------------------------------------------------------

describe("detectExtensionContext", () => {
  it("reports no extension context in a plain Node runtime", () => {
    const r = detectExtensionContext();
    assert.equal(r.inExtensionContext, false);
    assert.equal(r.hasSidebarAction, false);
    assert.equal(r.hasRuntimeMessaging, false);
  });
});

// ---------------------------------------------------------------------------
// detectChromeBuiltInAI (no AI globals in Node -> unsupported / false)
// ---------------------------------------------------------------------------

describe("detectChromeBuiltInAI", () => {
  it("reports unsupported/false when no AI APIs are present", async () => {
    const r = await detectChromeBuiltInAI();
    assert.equal(r.promptApi, "unsupported");
    assert.equal(r.summarizer, false);
    assert.equal(r.translator, false);
    assert.equal(r.writer, false);
    assert.equal(r.rewriter, false);
  });

  it("detects a mocked modern LanguageModel as readily", async () => {
    globalThis.LanguageModel = {
      availability: async () => "available"
    };
    globalThis.Summarizer = { availability: async () => "downloadable" };
    try {
      const r = await detectChromeBuiltInAI();
      assert.equal(r.promptApi, "readily");
      assert.equal(r.summarizer, true);
    } finally {
      delete globalThis.LanguageModel;
      delete globalThis.Summarizer;
    }
  });

  it("swallows a throwing availability() and reports 'no'", async () => {
    globalThis.LanguageModel = {
      availability: async () => {
        throw new Error("blocked in insecure context");
      }
    };
    try {
      const r = await detectChromeBuiltInAI();
      assert.equal(r.promptApi, "no");
    } finally {
      delete globalThis.LanguageModel;
    }
  });
});

// ---------------------------------------------------------------------------
// pingPromptApi
// ---------------------------------------------------------------------------

describe("pingPromptApi", () => {
  it("reports unsupported when no Prompt API exists", async () => {
    const r = await pingPromptApi();
    assert.equal(r.ok, false);
    assert.equal(r.status, "unsupported");
  });

  it("refuses to download when availability is after-download and allowDownload is false", async () => {
    globalThis.LanguageModel = {
      availability: async () => "downloadable",
      create: async () => ({ prompt: async () => "OK" })
    };
    try {
      const r = await pingPromptApi({ allowDownload: false });
      assert.equal(r.ok, false);
      assert.equal(r.status, "after-download");
    } finally {
      delete globalThis.LanguageModel;
    }
  });

  it("executes a ping against a ready mocked model", async () => {
    let destroyed = false;
    globalThis.LanguageModel = {
      availability: async () => "available",
      create: async () => ({
        prompt: async (text) => (text.includes("OK") ? "OK" : "?"),
        destroy: () => {
          destroyed = true;
        }
      })
    };
    try {
      const r = await pingPromptApi();
      assert.equal(r.ok, true);
      assert.equal(r.output, "OK");
      assert.equal(destroyed, true, "session should be destroyed after ping");
    } finally {
      delete globalThis.LanguageModel;
    }
  });
});

// ---------------------------------------------------------------------------
// detectBrowserAI (integration shape)
// ---------------------------------------------------------------------------

describe("detectBrowserAI", () => {
  it("returns a fully-shaped report", async () => {
    const d = makeDoc([{ tag: "main" }, { tag: "h1" }], {
      text: "hello world",
      html: "<main><h1>hello world</h1></main>"
    });
    const r = await detectBrowserAI({ document: d });
    assert.equal(typeof r.browser, "string");
    assert.equal(typeof r.secureContext, "boolean");
    assert.ok(r.timestamp);
    assert.ok(r.chromeBuiltInAI);
    assert.ok(r.contextReadiness);
    assert.ok(r.privacyControls);
    assert.ok(r.writingTools);
    assert.ok(r.structuredData);
    assert.equal(r.contextReadiness.hasSemanticMain, true);
    assert.equal("promptPing" in r, false, "ping omitted by default");
  });

  it("includes a ping result when ping:true", async () => {
    globalThis.LanguageModel = {
      availability: async () => "available",
      create: async () => ({ prompt: async () => "OK", destroy() {} })
    };
    try {
      const r = await detectBrowserAI({ document: makeDoc([]), ping: true });
      assert.ok(r.promptPing);
      assert.equal(r.promptPing.ok, true);
    } finally {
      delete globalThis.LanguageModel;
    }
  });
});
