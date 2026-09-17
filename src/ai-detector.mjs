/**
 * Native ES module entry point for ai-detector.
 *
 * The implementation lives in ./ai-detector.js as a UMD module (works via
 * CommonJS `require` and a classic `<script>` tag). This thin wrapper exposes
 * named ESM exports so consumers can:
 *
 *   import { detectBrowserAI } from 'ai-browser-test';           // bundlers / Node ESM
 *   import { detectBrowserAI } from 'https://cdn/.../ai-detector.mjs'; // browser ESM
 *
 * Importing the UMD file for its side effect assigns the API to
 * globalThis.aiDetector; in Node ESM it is also available as the default import.
 */

import "./ai-detector.js";

/* global globalThis */
const api =
  (typeof globalThis !== "undefined" && globalThis.aiDetector) || {};

export const detectBrowserAI = api.detectBrowserAI;
export const detectBrowser = api.detectBrowser;
export const detectChromeBuiltInAI = api.detectChromeBuiltInAI;
export const pingPromptApi = api.pingPromptApi;
export const auditContextReadiness = api.auditContextReadiness;
export const detectExtensionContext = api.detectExtensionContext;
export const auditPrivacyControls = api.auditPrivacyControls;
export const auditWritingTools = api.auditWritingTools;
export const auditStructuredData = api.auditStructuredData;
export const isSecureContext = api.isSecureContext;
export const normalizeStatus = api.normalizeStatus;
export const computeTextToCodeRatio = api.computeTextToCodeRatio;

export default api;
