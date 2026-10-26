# Tasks

## 1. Cube pause support

- [x] 1.1 Add a `paused` prop (default `false`) to `Cube` in `src/Cube.tsx` so `useFrame` skips rotation while paused. Verify with new `src/Cube.test.tsx` cases: no rotation change across frames when paused; rotation continues from the same value (no jump) after unpausing; existing cases still pass.

## 2. PauseButton component

- [x] 2.1 Create `src/PauseButton.tsx`: a `type="button"` taking `paused` and `onClick` props, labelled "Pause" when not paused and "Resume" when paused, with `aria-pressed={paused}`; style it as a fixed-position overlay in `src/index.css`. Verify by `npm run typecheck` and the tests in 2.2.
- [x] 2.2 Create `src/PauseButton.test.tsx` (Vitest + Testing Library). Verify it covers: the label is "Pause" for `paused={false}` and "Resume" for `paused={true}`; `onClick` fires once per click; `aria-pressed` is `"false"` when running and `"true"` when paused. `npm test` passes.

## 3. App state and Space shortcut

- [x] 3.1 In `src/App.tsx`, hold `paused` state (initially `false`), pass it to `Cube`, and render `PauseButton` with a toggling `onClick`. Verify with `src/App.test.tsx` (R3F `Canvas` stubbed): clicking the button toggles its label, and `Cube` receives the matching `paused` value.
- [x] 3.2 Add the Space key handler: a `window` `keydown` listener in `App` that calls `preventDefault`, ignores `event.repeat` and editable targets, and toggles `paused` once. Verify in `src/App.test.tsx`: Space toggles the label; Space with the button focused toggles exactly once; a repeated keydown does not toggle; the default is prevented; the listener is removed on unmount.

## 4. End-to-end

- [x] 4.1 Add a Playwright test in `e2e/` (using the frozen-clock helper from `e2e/canvas.spec.ts`, extracted into a shared helper if needed) checking the button label changes "Pause" → "Resume" after a click and again after pressing Space, and back on a second toggle. Verify with `npm run e2e`.
- [x] 4.2 Add Playwright tests that frames are identical across `runFor` while paused and differ after resume, that dragging while paused changes the frame, and that the label is still "Resume" after the drag. Verify with `npm run e2e`.

## 5. Gates

- [x] 5.1 Run `npm run lint`, `npm run typecheck`, `npm run test:coverage` and `npm run format:check`; raise coverage thresholds in `vite.config.ts` if measured coverage improved (never lower them).

## Workflow follow-up

- Archive with `/opsx:archive` once implemented, merging the delta into `openspec/specs/rotating-cube/`.
