# Architecture Decisions

## 2026-08-27: Use Vite + React + TypeScript
- Decision: Build the game as a Vite React + TypeScript app with local components and utilities.
- Reason: This matches the requested stack, keeps startup fast, and is straightforward to host on GitHub Pages.
- Alternatives considered: Plain JavaScript or a heavier framework such as Next.js.
- Tradeoffs: React offers good UI ergonomics, but the app remains a single-page game rather than a larger multi-page framework.
- Date: 2026-08-27

## 2026-08-27: Keep game logic separate from UI
- Decision: Put generator, solver, utilities, and validation in TypeScript modules under src, while the UI remains mostly declarative.
- Reason: This makes testing, solving, and hint generation easier and keeps the code easier to maintain.
- Alternatives considered: Putting everything into App.tsx.
- Tradeoffs: More files and some initial boilerplate, but improved separation of concerns.
- Date: 2026-08-27

## 2026-08-27: Use deterministic seed-based daily puzzles
- Decision: Daily puzzle generation uses a date-derived seed so the same date yields the same puzzle.
- Reason: This matches the daily puzzle requirement while staying deterministic and replayable.
- Alternatives considered: Storing a server-side schedule or using a real database.
- Tradeoffs: Without a backend, the daily logic is local and deterministic rather than globally centralized, but it satisfies local GitHub-ready project requirements.
- Date: 2026-08-27
