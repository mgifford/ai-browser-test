# AI Generation Rules

When generating code or content for this project, the following rules are non-negotiable:

1. **Accessibility Non-Removal**: Never remove `aria-` labels, `role` attributes, or `<label>` associations to "clean up" code.
2. **Token Discipline**: All colors must use CSS variables from `tokens.css`. No hardcoded hex values except within the token definitions.
3. **Reading Order**: Ensure the DOM order matches the visual flow for screen reader compatibility.
4. **Surface Detection**: Before displaying AI controls, code must include a check for the specific Window AI API (e.g., `window.ai`).
5. **Documentation Parity**: If a new UI component is suggested, a corresponding entry must be added to `components.md`.
6. **Scope Control**: Keep logic on-device. Do not suggest external LLM providers unless explicitly requested.
