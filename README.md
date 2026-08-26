# PagePulse

A small accessibility + render-performance auditor for React component libraries. It mounts a
handful of demo components, runs [axe-core](https://github.com/dequelabs/axe-core) against the live
DOM they produce, measures each one's mount/update commit cost with React's built-in
[Profiler API](https://react.dev/reference/react/Profiler), and turns both into one scored, graded
report per component.

```
npm install
npm run dev      # http://localhost:5173
npm test         # vitest
npm run lint
npm run build
```

## Why this exists

Accessibility and performance regressions in a frontend codebase are rarely abstract — a missing
form label or a component that re-renders too often is a real bug, just one that's easy to miss
because nothing crashes. That kind of check usually happens by hand, in code review, if it happens
at all. This project turns that instinct into something automatic and reusable: run it against a
component library and get a report instead of relying on someone noticing.

It's deliberately scoped small. Rather than trying to audit arbitrary external URLs (which needs a
server-side fetch, and runs into CORS the moment the target site doesn't cooperate), it audits a
local registry of components — the same shape of problem a team would actually want solved for its
own design system, without the extra infrastructure.

## How the score is built

`src/audit/score.ts` is the only part of this project with no DOM and no dependencies — plain,
synchronous functions over plain data, which is what makes it unit-testable in isolation
(`score.test.ts`):

- **Accessibility score** starts at 100 and deducts points per axe-core violation, weighted by
  axe's own impact levels (`critical` costs far more than `minor`) — one blocking issue should
  visibly tank the score rather than get smoothed out by unrelated passing checks.
- **Performance score** treats a 16ms commit (one 60fps frame) as "free," treats 200ms+ as fully
  janky, and scores linearly in between.
- **Overall score** weights accessibility at 60% and performance at 40% — reflecting that an
  accessibility failure is usually a harder bug to *notice* than a slow render, even though both are
  real regressions.

These weights and thresholds are judgment calls, not universal constants — the point of keeping the
scoring logic pure and separate from the DOM/React parts is that they're easy to see, argue with, and
change in one place.

## How a component gets audited

Each demo is mounted inside a React `<Profiler>` (`src/components/ComponentPreview.tsx`), which
reports real commit durations for the initial mount and one forced update. Once both are captured,
`axe-core` runs against the mounted DOM node. Nothing here is mocked or hand-typed: the accessibility
issues listed for each component are whatever axe-core actually finds when the component renders in
your browser.

The three demo components (`src/demos/`) each ship a small number of *intentional* accessibility
issues — a form input with no label, an icon-only button with no accessible name, a duplicate `id` —
documented in a comment at the top of each file, so the audit's output can be checked against what's
actually there.

## Design decisions worth knowing about

**Serializing the audits.** All three demo components trigger their audit within milliseconds of
each other. The first version of this project ran `axe.run()` for each one independently, and two
of the three would hang forever — axe-core's own docs note it does not support overlapping
concurrent runs. The fix (`src/audit/accessibility.ts`) is a small promise-based queue: every
caller's `axe.run()` is chained onto the previous call's completion, so only one audit ever executes
at a time, regardless of how many components mount together. This is the one part of the project
that isn't "wire up a library and show the result" — it's a real concurrency bug, diagnosed from a
symptom (some cards stuck on "auditing…") rather than an error message, and fixed with a queue
rather than a workaround like an artificial delay.

**Why the scoring logic has zero imports.** `score.ts` never touches the DOM, React, or axe — it's
plain functions over plain data (issue lists in, a graded score out). That's what makes it possible
to unit-test the scoring rules directly (`score.test.ts`) without mounting anything or mocking
axe-core. Everything that *does* need the DOM (`accessibility.ts`, `ComponentPreview.tsx`) is kept
on the other side of that boundary, and is exercised by running the app itself instead.

## What's tested, and what isn't

- `score.ts` has full unit coverage of the scoring math, including edge cases (no issues, many
  severe issues, the performance floor/ceiling).
- `IssuesList` has a component-level test (`@testing-library/react`) covering the empty state and
  the rendered-issue state.
- The axe-core integration and the Profiler-based timing are exercised by running the app itself —
  they depend on a real DOM and real paint timing in a way that's better verified by hand (`npm run
  dev`) than by a brittle mock.

## Possible next steps

- Point the registry at a real shared component library instead of the three demos.
- Add a CLI mode (headless browser via Playwright) so this can run in CI against every PR, failing
  the build below a chosen grade.
- Track score history over time per component, not just a snapshot.
