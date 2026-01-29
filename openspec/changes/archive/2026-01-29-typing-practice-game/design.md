## Context

This is a greenfield project with no existing code. We're building a browser-based typing speed test that measures WPM and accuracy. The application must work without a server (static files only) and have no external dependencies.

## Goals / Non-Goals

**Goals:**
- Provide a simple, functional typing speed test
- Calculate accurate WPM and accuracy metrics
- Work in any modern browser without installation
- Keep the codebase minimal and maintainable

**Non-Goals:**
- User accounts or authentication
- Persistent storage of results across sessions
- Multiple test modes or difficulty levels
- Leaderboards or social features
- Mobile-optimized experience

## Decisions

### Single-page architecture
Use a single HTML file with embedded or linked CSS/JS. This keeps deployment simple (just serve static files) and avoids build tooling complexity.

**Alternatives considered:**
- Multi-page app: Unnecessary for this scope
- Framework (React/Vue): Overkill for a simple typing test

### Character-by-character comparison
Compare user input to target text character by character in real-time. This enables immediate visual feedback on errors.

**Alternatives considered:**
- Word-by-word comparison: Less precise, harder to show exactly where errors occurred
- Post-submission comparison: No real-time feedback, worse UX

### Standard WPM calculation
Use the standard formula: (characters typed / 5) / minutes elapsed. This is the industry standard and allows comparison with other typing tests.

**Alternatives considered:**
- Raw character count: Not comparable to other tests
- Actual word count: Varies too much based on word length

### Timer starts on first keystroke
Begin timing when the user types their first character, not when the page loads. This gives users time to read the passage before starting.

**Alternatives considered:**
- Countdown timer: Adds complexity, may cause anxiety
- Manual start button: Extra click, slightly worse UX

## Risks / Trade-offs

**[Risk] No persistence** → Users lose results on page refresh. Acceptable for MVP; localStorage could be added later.

**[Risk] Single passage** → May get repetitive. Mitigated by having a few built-in passages to randomly select from.

**[Trade-off] No backspace handling** → Allowing backspace makes accuracy calculation more complex. Initial version will count backspaced characters as errors.
