# StageProgressCard Refactor Notes

## Context
This document explains the coordinate logic refactor and storage changes applied to `src/components/backpackCard/StageProgressCard.tsx`.

## Changes Overview

1. Pure Function Extraction
   - Added small, focused helpers for sizing and coordinate calculations:
     - `computePartBoxSizes(parts, installedSize?, uninstalledSize?)`
     - `maxBoxSize(sizes, partBoxSize)`
     - `computeOrbitRadii(planeSize, maxBox, ringPadding)`
     - `angleForIndex(i, startAngleDeg, N)`
     - `clampToContainer(left, top, w, h, cw, ch)`
     - `computePartCoordinates({ cardWidth, cardHeight, planeSize, sizes, startAngleDeg, radii })`
     - `validateCoordinates(coords, cw, ch)`
     - `toLeftTop(coords)`
   - All functions are pure and defined with explicit input/output types.

2. Type Renaming to Avoid Collision
   - Renamed internal coordinate type alias:
     - From `type PartCoordinate = { x: number; y: number }`
     - To `type PartBoxCoord = { x: number; y: number }`
   - This avoids name conflict with the component’s `const PartCoordinate = [...]` array.

3. Coordinate Storage and Rendering
   - Quantity and positions are now driven solely by the `PartCoordinate` array:
     ```ts
     const PartCoordinate = [
       { id: 1, x: 0, y: 0, active: false },
       { id: 2, x: 0, y: 0, active: false },
       { id: 3, x: 0, y: 0, active: false },
     ]
     ```
   - `partRenderData` memo switched to use `PartCoordinate` values and runtime validation:
     - Maps to `{ x, y }`
     - Validates with `validateCoordinates`
     - Converts to `{ left, top }` via `toLeftTop`
   - React keys in both installed and locked rendering branches use `PartCoordinate[idx].id` for stability.

## Compatibility
- Existing `parts` array and installed-state rendering remain unchanged; only the box count and positions are controlled by the `PartCoordinate` array.
- Runtime validation ensures coordinates remain within the container bounds.

## Rationale
- Separating logic into pure functions improves testability and clarity.
- Driving positions from a single source-of-truth (`PartCoordinate`) makes UI behavior explicit and predictable.
- Type alias renaming prevents type/variable naming collisions in TypeScript.

## Testing Notes
- Ensure the dev server is running and confirm UI positions reflect the `PartCoordinate` array values.
- Toggle `active` or change `x/y` values to verify visual updates.