# Sustainability

This project favors low-complexity, static delivery to reduce operational overhead and long-term maintenance burden.

## Approach

- No build pipeline required
- No runtime backend required
- No heavy framework dependencies
- Static hosting through GitHub Pages

## Sustainability goals

- Keep page weight and external dependencies minimal
- Prefer plain HTML, CSS, and JavaScript where practical
- Keep implementation readable for community maintenance
- Document deployment and governance clearly

## Operational targets

- Keep each HTML page transfer size under 350 KB (excluding browser cache effects)
- Keep third-party runtime requests to the minimum needed for demonstrable features
- Keep dynamic sustainability disclosure lightweight and text-first
- Review and refresh measured CO2/page-weight values at least quarterly

## Measurement and reporting

- Report page-weight and estimated CO2e in the page footer
- Use the SWD model through CO2.js for comparable estimates
- Document methodology and caveats for what is estimated vs directly measured
- Track notable feature additions that increase network or script cost

## Current implementation notes

- Static hosting via GitHub Pages remains low-overhead
- Runtime imports currently include:
	- Google Fonts
	- YAML parser from jsDelivr
	- CO2.js from jsDelivr
- If these external resources are unavailable, the site degrades gracefully for affected features

## Ongoing practices

- Review external assets for necessity
- Remove unused styles or scripts
- Keep docs updated as features evolve
- Encourage contributions that improve accessibility and efficiency
- Prefer local or bundled alternatives when external dependencies can be reduced
- Avoid disabling cache for static data unless there is a clear correctness requirement

## Related policy files

- [ACCESSIBILITY.md](ACCESSIBILITY.md)
- [AGENTS.md](AGENTS.md)

## Public links

- [ACCESSIBILITY.md](https://mgifford.github.io/ai-browser-test/ACCESSIBILITY.md)
- [SUSTAINABILITY.md](https://mgifford.github.io/ai-browser-test/SUSTAINABILITY.md)
- [AGENTS.md](https://agents.md/)
