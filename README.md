# Pathline

Pathline is a polished local logic game inspired by the classic path-fill puzzle style. The player traces a single continuous route through a square grid, starting at 1 and moving through every cell exactly once while following numbered checkpoints in ascending order.

The project uses React, TypeScript, Vite, and local storage so it runs locally in VS Code and is easy to publish to GitHub Pages.

## Game rules

- Start from the number 1 cell.
- Continue through each numbered checkpoint in order.
- Fill every cell exactly once.
- Keep the route continuous and connected.
- Finish the puzzle by reaching the final cell with a valid full path.

## Features

- 5x5, 6x6, and 7x7 boards
- daily puzzle mode with deterministic generation
- practice mode with random puzzles
- custom puzzle support
- hint system and undo/restart controls
- local statistics persistence
- responsive layout for desktop and mobile
- export and backup scripts for project packaging
- GitHub Pages deployment workflow

## Installation

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
cd pathline-puzzle
npm install
```

## Run locally

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Run tests

```bash
npm test
```

## Build production files

```bash
npm run build
```

## Export logs

```bash
npm run export
```

This creates an archive under the `exports` folder containing the conversation and development logs.

## Create a project backup

```bash
npm run backup
```

This creates a zip archive of the full project excluding build output, node_modules, git metadata, and sensitive files.

## Deploy to GitHub Pages

1. Push the project to a GitHub repository.
2. In the repository settings, open Pages.
3. Set the source to GitHub Actions.
4. The provided workflow in `.github/workflows/deploy-pages.yml` will build and publish the site on push to `main`.

## Project architecture

```text
src/
  components/
  config.ts
  generator.ts
  solver.ts
  tests/
  types.ts
  utils/
  App.tsx
  App.css
agent_logs/
  agent_conversation.md
  agent_conversation.json
  development_log.md
  decisions.md
scripts/
  export-logs.mjs
  backup-project.mjs
```

## Puzzle generation logic

The game generates a Hamiltonian-style path that covers every square exactly once, then chooses numbered checkpoints along that route. Difficulty controls the number and spacing of checkpoints, which influences the uniqueness and challenge of the puzzle.

## Solver logic

The solver validates puzzle structure, confirms route correctness, detects impossible states, and provides hints by comparing the player path with the generated solution.

## Future improvements

- richer custom puzzle editor
- stronger uniqueness checks for generated puzzles
- animated route tracing
- leaderboard and daily history analytics
- stronger accessibility and keyboard navigation

## License

This project is licensed under the MIT license.
