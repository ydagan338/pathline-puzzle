# Pathline Submission

## Public game URL

https://ydagan338.github.io/pathline-puzzle/

This is the signed-out GitHub Pages project URL.

## Repository and source

https://github.com/ydagan338/pathline-puzzle

The main game lives in `src/App.tsx`; styling is in `src/App.css`; puzzle generation and validation are in `src/generator.ts` and `src/solver.ts`. Deployment is configured in `.github/workflows/deploy-pages.yml`.

## Four-sentence specification and definition of done

Pathline is a single-route maze puzzle where the player starts at the 1 cell and traces a continuous line through every grid cell exactly once. The line must remain connected, respect walls, and pass numbered checkpoints in ascending order. A puzzle ends when the player reaches the final cell, records a time, shows completion feedback, and advances to a new puzzle. Done means the game supports drag and arrow-key movement, displays progress and time, provides restart and new-puzzle actions, and works from the public signed-out URL.

## Concise AI/build log

- Generated the original Pathline concept and implemented the React/Vite game loop.
- Added Hamiltonian-style puzzle generation, checkpoint ordering, wall constraints, timers, rankings, and restart/new-puzzle actions.
- Added keyboard arrow movement alongside pointer dragging.
- Added a celebratory completion popup before the next puzzle appears.
- Removed stale hint UI and hint-related documentation from the final game surface.
- Configured Vite for the GitHub Pages project path with `base: '/pathline-puzzle/'`.
- Human verification: opened the public URL while signed out and confirmed it returns the game page rather than a GitHub Pages 404.
- Automated verification: `npm test` passed 9/9 tests; `npm run build` completed successfully.

## Unfamiliar-user test note

Observed friction: during a silent test, the route line did not consistently continue when the user dragged across the board, making it unclear whether movement was being recorded. Verified revision: keyboard arrow movement was added as a second input path, and the completion state now shows a visible celebratory popup; both changes appear in `src/App.tsx`, with popup styling in `src/App.css`.
