# Design

## Context

`Cube` rotates its mesh in a `useFrame` callback (`src/Cube.tsx`). `App` renders a full-screen `Canvas` with lights, `Cube` and `OrbitControls` (`src/App.tsx`). `OrbitControls` moves the camera, not the cube, so it is independent of the cube's own rotation. `src/index.css` makes the root fill the viewport with `overflow: hidden`.

## Goals / Non-Goals

**Goals:**

- One shared paused state driving both the button and Space.
- Resume without a visual jump.
- No change to `OrbitControls` behavior.

**Non-Goals:**

- Persisting the paused state across reloads.
- Speed controls, or pausing other scene elements.
- Rotating the mesh itself on drag; "drag to rotate" is the existing camera orbit.

## Decisions

- **State lives in `App.tsx`** (`useState`) and is passed to `Cube.tsx` as a `paused` prop; `Cube` stops auto-rotating while `paused` is true. Alternative: a store (zustand) — overkill for one boolean.
- **The button is a separate component in its own file, `src/PauseButton.tsx`**, taking `paused: boolean` and `onClick: () => void` props. It is plain DOM rendered by `App` over the canvas, outside `Canvas`, so no extra R3F/drei dependency is needed. It renders a `type="button"` with the label "Pause"/"Resume" and `aria-pressed={paused}` (true while paused). Keeping it presentational makes it unit-testable without a WebGL canvas.
- **Pause by skipping the increment in `useFrame`**, not by stopping the render loop or `frameloop="never"`. Because rotation is delta-based, resuming continues from the current orientation with no jump, and `OrbitControls` keeps rendering and damping.
- **Space handling**: a `keydown` listener on `window` registered in `App`'s effect. It calls `preventDefault()` (stops page scroll and the browser's synthetic button click on keyup) and ignores `event.repeat` so holding the key toggles once. With the button focused, `preventDefault` on keydown suppresses the native click, so exactly one toggle occurs.
- **Styling** is a small fixed-position control in `index.css`.
- **Dragging never touches the paused state**: `OrbitControls` only moves the camera and nothing in `App` listens to pointer events, so a drag cannot reset `paused`.

## Risks / Trade-offs

- [Global Space listener could hijack typing in future inputs] → Ignore events whose target is an editable element (`input`, `textarea`, `contenteditable`); none exist today.
- [`preventDefault` on keydown for the focused button breaks native activation] → Intended; the handler is the single source of toggling.
- [Existing e2e tests use a frozen fake clock] → New e2e tests must use the same helper so frame comparisons stay deterministic.
