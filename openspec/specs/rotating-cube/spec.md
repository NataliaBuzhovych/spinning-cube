# Rotating Cube Specification

## Purpose

A single rotating cube rendered in a full-screen canvas, built with React Three Fiber and drei.

## Requirements

### Requirement: Rotating Cube

The system SHALL render exactly one cube, centered in the scene, that rotates continuously on its own.

#### Scenario: Cube rotates without input

- GIVEN the app is loaded
- WHEN time passes and the user does nothing
- THEN the single cube, centered in the scene, keeps rotating

### Requirement: Full-Screen Canvas

The system SHALL render the canvas so that it fills the entire viewport, with no scrollbars and no margins, and SHALL resize it with the window.

#### Scenario: Canvas fills the viewport

- GIVEN the app is loaded
- WHEN the page is displayed
- THEN the canvas covers the whole viewport
- AND there are no scrollbars or margins

#### Scenario: Window is resized

- GIVEN the app is loaded
- WHEN the browser window is resized
- THEN the canvas resizes to fill the new viewport

### Requirement: Orbit Controls

The system SHALL let the user rotate the view with the mouse via drei's `OrbitControls`.

#### Scenario: Drag to orbit

- GIVEN the app is loaded
- WHEN the user drags the mouse on the canvas
- THEN the view orbits around the cube

### Requirement: React Three Fiber Implementation

The system MUST be built with React Three Fiber and drei.

#### Scenario: Scene is declared with R3F

- GIVEN the source code
- WHEN the scene is inspected
- THEN it is a React Three Fiber `Canvas` using drei components

### Requirement: Out of Scope

The system SHALL NOT include multiple objects, textures, UI overlays or physics.

#### Scenario: Scene content is limited

- GIVEN the app is loaded
- WHEN the scene is inspected
- THEN it contains only the cube, the lights and the orbit controls
