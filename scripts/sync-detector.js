#!/usr/bin/env node
"use strict";

/**
 * Copy the canonical detector source into docs/lib so the GitHub Pages site
 * (which serves only docs/) can load it via a relative <script> tag.
 *
 *   node scripts/sync-detector.js          # write the copy
 *   node scripts/sync-detector.js --check  # exit non-zero if out of sync
 */

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "src", "ai-detector.js");
const dest = path.join(root, "docs", "lib", "ai-detector.js");

const banner =
  "/* AUTO-SYNCED from src/ai-detector.js — do not edit here. " +
  "Run `npm run sync:detector` after changing the source. */\n";

const src = fs.readFileSync(source, "utf8");
const expected = banner + src;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(dest) ? fs.readFileSync(dest, "utf8") : "";
  if (current !== expected) {
    console.error(
      "docs/lib/ai-detector.js is out of sync with src/ai-detector.js.\n" +
        "Run: npm run sync:detector"
    );
    process.exit(1);
  }
  console.log("docs/lib/ai-detector.js is in sync.");
  process.exit(0);
}

fs.writeFileSync(dest, expected);
console.log("Wrote " + path.relative(root, dest));
