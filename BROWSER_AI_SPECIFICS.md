# Browser AI Specifics: Source Map

Last updated: 2026-03-11

This document maps high-level vendor announcements to the places where concrete feature behavior and implementation details are described.

## Input links (announcement and feature pages)

- Mozilla: https://blog.mozilla.org/en/firefox/ai-window/
- Mozilla leadership post: https://blog.mozilla.org/en/mozilla/leadership/mozillas-next-chapter-anthony-enzor-demeo-new-ceo/
- Google Chrome AI landing: https://www.google.com/chrome/ai-innovations/
- Google Gemini 3 in Chrome post: https://blog.google/products-and-platforms/products/chrome/gemini-3-auto-browse/
- Microsoft Edge AI landing: https://www.microsoft.com/en-us/edge/features/ai?form=MT0160
- Microsoft Edge Copilot landing: https://www.microsoft.com/en-us/edge/features/copilot?form=MT0160

## Where the actual specifics are documented

### Mozilla (Firefox)

Primary specifics:
- Firefox AI support article: https://support.mozilla.org/kb/ai-chatbot
- Firefox AI controls article: https://blog.mozilla.org/en/firefox/how-to-use-ai-controls/
- Firefox AI product page: https://www.firefox.com/en-US/ai/

What these pages provide:
- User-facing setup and control behavior (how to enable/disable AI features)
- Privacy and control framing for AI interactions
- Product positioning and current availability direction

### Google (Chrome)

Primary specifics:
- Chrome AI docs index: https://developer.chrome.com/docs/ai
- Prompt API docs: https://developer.chrome.com/docs/ai/prompt-api
- Summarizer API docs: https://developer.chrome.com/docs/ai/summarizer-api
- Translator API docs: https://developer.chrome.com/docs/ai/translator-api
- Language detection docs: https://developer.chrome.com/docs/ai/language-detection
- End-user Gemini in Chrome help: https://support.google.com/chrome?p=gemini_in_chrome#topic=7439538

What these pages provide:
- API surface names and usage patterns for built-in AI in Chrome
- Capability-specific pages (prompting, summarizing, translation, language detection)
- Developer-focused implementation guidance and launch context
- End-user setup/help path for Gemini experiences in Chrome

### Microsoft (Edge)

Primary specifics:
- Edge AI feature page: https://www.microsoft.com/en-us/edge/features/ai?form=MT0160
- Edge Copilot feature page: https://www.microsoft.com/en-us/edge/features/copilot?form=MT0160
- Copilot Vision support article: https://support.microsoft.com/en-us/topic/using-copilot-vision-with-microsoft-copilot-3c67686f-fa97-40f6-8a3e-0e45265d425f

What these pages provide:
- User-facing feature descriptions for AI browser workflows in Edge
- Copilot-focused browsing and assistance capabilities
- Concrete support guidance for Copilot Vision usage

## Practical takeaway for this repository

For the demo in [index.html](index.html), treat announcement pages as narrative context and use the documentation/support pages above as the canonical references for feature specifics.

A good presentation flow is:
1. Show the announcement page for direction and messaging.
2. Show the specific docs/support page for concrete behavior.
3. Run the built-in test panel in the demo to validate what is actually exposed in the current browser runtime.

## Caveats

- Vendor pages change frequently, and some details move between docs, support, and marketing pages.
- Feature availability can vary by browser version, channel, geography, account, and experiment flags.
- This source map should be reviewed periodically for moved URLs and updated API naming.
