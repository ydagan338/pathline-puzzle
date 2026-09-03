# Pathline Submission

## Public game URL

https://ydagan338.github.io/pathline-puzzle/

This is the signed-out GitHub Pages project URL.

## Repository and source

https://github.com/ydagan338/pathline-puzzle

The main game is in `src/App.tsx`, with styling in `src/App.css` and deployment in `.github/workflows/deploy-pages.yml`.

## Four-sentence specification and definition of done

Pathline is a single-route maze puzzle where the player starts at the 1 cell and traces a continuous line through every grid cell exactly once. The line must remain connected and pass numbered checkpoints in ascending order. A puzzle ends when the player reaches the final cell, records a time, and displays the completed route. Done means the borderless board supports drag movement, shows progress and time, provides restart and new-puzzle actions, and works from the public signed-out URL.

## Concise AI/build log

- Implemented the React/Vite Pathline game loop and borderless grid board.
- Added Hamiltonian-style route generation, checkpoint ordering, timers, rankings, and restart/new-puzzle actions.
- Preserved continuous pointer dragging so the route line follows the player across adjacent cells.
- Configured GitHub Pages deployment through `.github/workflows/deploy-pages.yml`.
- Human verification: opened the public URL while signed out and checked that the game page loads.
- Automated verification: `npm test` passed 9/9 tests; `npm run build` completed successfully.

## Unfamiliar-user test note

Observed friction: during a silent test, the route line did not consistently continue when the user dragged across the board, making it unclear whether movement was being recorded. Verified revision: the final restored version uses the borderless board and continuous pointer handlers in `src/App.tsx`, with the route line rendered by the `route-overlay` in `src/App.tsx`.
