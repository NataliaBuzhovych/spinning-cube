# Proposal

## Why

The cube spins forever with no way to stop it, so the user cannot hold it still to look at a face or inspect it after dragging the view.

## What Changes

- Add a "Pause"/"Resume" button that stops and restarts the cube's automatic rotation.
- Add the Space key as a keyboard shortcut for the same toggle.
- Keep `OrbitControls` fully working while rotation is paused, so the user can still drag to orbit the view.
- Relax the "no UI overlays" out-of-scope rule to allow this single control.

## Capabilities

### New Capabilities

### Modified Capabilities

- `rotating-cube`: "Rotating Cube" gains a paused state; new requirements "Pause Control" and "Pause Keyboard Shortcut"; "Out of Scope" now permits the pause button as the only UI overlay.

## Impact

- `src/Cube.tsx`: accepts a paused flag and skips rotation while paused.
- `src/App.tsx`: owns the paused state, renders the button, listens for Space.
- `src/index.css`: styling for the button overlay.
- Tests: `src/Cube.test.tsx`, new `src/App` interaction coverage, `e2e/canvas.spec.ts`.
- No new dependencies.
