# Rotating Cube Specification

## Purpose

A single rotating cube rendered in a full-screen canvas, built with React Three Fiber and drei.

## Requirements

### Requirement: Rotating Cube

The system SHALL render exactly one cube, centered in the scene, that rotates continuously on its own unless the user has paused it.

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

The system SHALL NOT include multiple objects, textures, physics or UI overlays other than the pause button.

#### Scenario: Scene content is limited

- GIVEN the app is loaded
- WHEN the scene is inspected
- THEN it contains only the cube, the lights and the orbit controls
- AND the only UI overlay is the pause button

### Requirement: Pause Control

The system SHALL provide a button that toggles the cube's automatic rotation between running and paused. The button label SHALL read "Pause" while the cube rotates and "Resume" while it is paused. The cube SHALL rotate on load.

#### Scenario: Pause stops the rotation

- **GIVEN** the app is loaded and the cube is rotating
- **WHEN** the user clicks the "Pause" button
- **THEN** the cube stops rotating
- **AND** the button label changes to "Resume"

#### Scenario: Resume restarts the rotation

- **GIVEN** the cube is paused
- **WHEN** the user clicks the "Resume" button
- **THEN** the cube continues rotating from the orientation it had when paused, without a jump
- **AND** the button label changes to "Pause"

### Requirement: Pause Keyboard Shortcut

The system SHALL toggle the paused state when the user presses the Space key, with the same effect as clicking the pause button. A single Space press SHALL toggle exactly once, including when the button has keyboard focus.

#### Scenario: Space toggles rotation

- **GIVEN** the app is loaded and the cube is rotating
- **WHEN** the user presses Space
- **THEN** the cube stops rotating and the button reads "Resume"
- **AND** pressing Space again resumes the rotation and the button reads "Pause"

#### Scenario: Space with the button focused

- **GIVEN** the pause button has keyboard focus
- **WHEN** the user presses Space once
- **THEN** the paused state changes exactly once

#### Scenario: Space does not scroll the page

- **GIVEN** the app is loaded
- **WHEN** the user presses Space
- **THEN** the page does not scroll

### Requirement: Orbit While Paused

The system SHALL keep the orbit controls fully functional while the rotation is paused.

#### Scenario: Drag while paused

- **GIVEN** the cube is paused
- **WHEN** the user drags the mouse on the canvas
- **THEN** the view orbits around the cube
- **AND** the cube's own rotation stays paused

#### Scenario: Dragging does not reset the pause state

- **GIVEN** the cube is paused and the button reads "Resume"
- **WHEN** the user drags the mouse on the canvas and releases
- **THEN** the cube is still paused
- **AND** the button still reads "Resume"
