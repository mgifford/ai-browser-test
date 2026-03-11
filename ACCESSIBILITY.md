# Accessibility

This project is designed to be understandable, operable, and testable across modern browsers.

## Scope

- Static demo site in [index.html](index.html)
- Browser comparison and built-in AI capability test UI
- Content intended for public web delivery via GitHub Pages

## Commitments

- Keep semantic HTML structure
- Preserve keyboard access for all interactive controls
- Maintain sufficient color contrast for key text and controls
- Support responsive layouts for mobile and desktop
- Keep dynamic status updates visible on screen
- Keep interactive probe results understandable to screen-reader users
- Avoid motion-heavy interactions that could reduce usability

## Test checklist

- Verify keyboard navigation through all controls
- Verify form labels and button labels are present
- Verify visible focus styles are not removed
- Verify readable layout at small viewport widths
- Verify no critical issues in browser accessibility tooling
- Verify dynamically injected controls (scenario buttons, feature probes) are keyboard reachable
- Verify probe result changes are announced by assistive technologies where relevant (`aria-live` regions)
- Verify click targets remain usable at mobile widths (minimum practical touch target sizing)
- Verify color-only status indicators are paired with text labels
- Verify reduced-motion preference does not block reading or interaction flow

## Implementation-specific areas to retest

- Capability matrix with runtime-first reordering
- Feature details panel and probe output region
- Tab Context Probe result updates
- Built-in assistant and on-device model probe outputs
- Prompt simulator randomized content loading

## Related policy files

- [SUSTAINABILITY.md](SUSTAINABILITY.md)
- [AGENTS.md](AGENTS.md)

## Public links

- [ACCESSIBILITY.md](https://mgifford.github.io/ai-browser-test/ACCESSIBILITY.md)
- [SUSTAINABILITY.md](https://mgifford.github.io/ai-browser-test/SUSTAINABILITY.md)
- [AGENTS.md](https://agents.md/)
