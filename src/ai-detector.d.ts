/**
 * Type definitions for ai-detector.
 * Zero-dependency browser AI capability & readiness detector.
 */

/** Canonical availability status for the built-in Prompt (language model) API. */
export type PromptApiStatus = "readily" | "after-download" | "no" | "unsupported";

/** Chromium built-in (on-device, WICG) AI capabilities. */
export interface ChromeBuiltInAI {
  /** Prompt / LanguageModel availability, including legacy fallbacks. */
  promptApi: PromptApiStatus;
  /** Whether the Summarizer API is present in this runtime. */
  summarizer: boolean;
  /** Whether the Translator API is present in this runtime. */
  translator: boolean;
  /** Whether the LanguageDetector API is present in this runtime. */
  languageDetector: boolean;
  /** Whether the Writer API is present in this runtime. */
  writer: boolean;
  /** Whether the Rewriter API is present in this runtime. */
  rewriter: boolean;
}

/** DOM readiness for browser-level context extraction (Firefox/Mistral, sidebars). */
export interface ContextReadiness {
  /** Overall readiness score, 0-100 (higher is easier to extract). */
  score: number;
  /** True when the page exposes a <main> or role="main" region. */
  hasSemanticMain: boolean;
  /** True when the page exposes at least one ARIA/HTML landmark. */
  hasAriaLandmarks: boolean;
  /** Number of heading elements (h1-h6). */
  headingCount: number;
  /** Number of landmark regions found. */
  landmarkCount: number;
  /** Ratio of visible text length to serialized HTML length (0-1). */
  textToCodeRatio: number;
}

/** WebExtension / sidebar context signals (only meaningful inside an extension). */
export interface ExtensionContext {
  /** True when this code appears to run inside an extension context. */
  inExtensionContext: boolean;
  /** True when a sidebar/side-panel API is exposed. */
  hasSidebarAction: boolean;
  /** True when extension runtime messaging is exposed. */
  hasRuntimeMessaging: boolean;
}

/** Page-level directives controlling assistant/AI access to content. */
export interface PrivacyControls {
  /** True when a robots meta contains "noai". */
  noAiMeta: boolean;
  /** True when a robots meta contains "noimageai". */
  noImageAiMeta: boolean;
  /** True when a robots meta contains "nosnippet". */
  noSnippetMeta: boolean;
  /** Count of elements carrying the data-nosnippet attribute. */
  noSnippetElements: number;
  /** Combined content of relevant robots/ai meta tags (lowercased). */
  robotsContent: string;
}

/** Writing Tools (Apple Intelligence) editable-surface inventory. */
export interface WritingToolsAudit {
  /** Number of single-line text-like inputs. */
  textInputs: number;
  /** Number of <textarea> elements. */
  textAreas: number;
  /** Number of contenteditable regions. */
  contentEditables: number;
  /** contenteditable regions lacking a textbox role (higher-risk for sync/AT). */
  riskyContentEditables: number;
}

/** Structured-data markup used by reader/summarization/highlights engines. */
export interface StructuredDataAudit {
  /** Number of <script type="application/ld+json"> blocks. */
  jsonLdBlocks: number;
  /** Number of microdata items (itemscope). */
  microdataItems: number;
  /** Number of RDFa items (typeof/property). */
  rdfaItems: number;
  /** True when any structured data is present. */
  hasStructuredData: boolean;
}

/** Result of an optional safe Prompt API "ping". */
export interface PromptPingResult {
  /** True when the ping executed and returned output. */
  ok: boolean;
  /** The resolved availability status at ping time. */
  status: PromptApiStatus;
  /** The model output, when ok. */
  output?: string;
  /** The failure reason, when not ok. */
  error?: string;
}

/** Full structured detection report. */
export interface AIBrowserReport {
  /** Best-effort browser family (Chrome, Edge, Firefox, Safari, Brave, Opera, Arc, unknown). */
  browser: string;
  /** Whether the current context is secure (https/localhost) — required by built-in AI. */
  secureContext: boolean;
  /** ISO timestamp of when the report was produced. */
  timestamp: string;
  chromeBuiltInAI: ChromeBuiltInAI;
  contextReadiness: ContextReadiness;
  extensionContext: ExtensionContext;
  privacyControls: PrivacyControls;
  writingTools: WritingToolsAudit;
  structuredData: StructuredDataAudit;
  /** Present only when detectBrowserAI was called with { ping: true }. */
  promptPing?: PromptPingResult;
}

/** Options for the main detection entry point. */
export interface DetectOptions {
  /** Also run a safe Prompt API "ping" to verify end-to-end execution. */
  ping?: boolean;
  /** Permit the ping to download an "after-download" model. */
  allowDownload?: boolean;
  /** DOM to audit; defaults to the live document. */
  document?: Document;
}

/** Options for the standalone Prompt API ping. */
export interface PingOptions {
  allowDownload?: boolean;
  timeoutMs?: number;
}

export function detectBrowserAI(options?: DetectOptions): Promise<AIBrowserReport>;
export function detectBrowser(): string;
export function detectChromeBuiltInAI(): Promise<ChromeBuiltInAI>;
export function pingPromptApi(options?: PingOptions): Promise<PromptPingResult>;
export function auditContextReadiness(document?: Document | null): ContextReadiness;
export function detectExtensionContext(): ExtensionContext;
export function auditPrivacyControls(document?: Document | null): PrivacyControls;
export function auditWritingTools(document?: Document | null): WritingToolsAudit;
export function auditStructuredData(document?: Document | null): StructuredDataAudit;
export function isSecureContext(): boolean;
export function normalizeStatus(raw: unknown): PromptApiStatus;
export function computeTextToCodeRatio(document: Document): number;

declare const _default: {
  detectBrowserAI: typeof detectBrowserAI;
  detectBrowser: typeof detectBrowser;
  detectChromeBuiltInAI: typeof detectChromeBuiltInAI;
  pingPromptApi: typeof pingPromptApi;
  auditContextReadiness: typeof auditContextReadiness;
  detectExtensionContext: typeof detectExtensionContext;
  auditPrivacyControls: typeof auditPrivacyControls;
  auditWritingTools: typeof auditWritingTools;
  auditStructuredData: typeof auditStructuredData;
  isSecureContext: typeof isSecureContext;
  normalizeStatus: typeof normalizeStatus;
  computeTextToCodeRatio: typeof computeTextToCodeRatio;
};
export default _default;
