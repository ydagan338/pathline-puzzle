import type { PuzzleDefinition } from './types'
import { parsePath } from './utils/path'

export const isAdjacentKey = (first: string, second: string) => {
  const firstCell = parsePath([first])[0]
  const secondCell = parsePath([second])[0]
  const rowDistance = Math.abs(firstCell.row - secondCell.row)
  const colDistance = Math.abs(firstCell.col - secondCell.col)
  return rowDistance + colDistance === 1
}

export const validatePath = (route: string[], solution: string[]) => {
  if (route.length > solution.length) {
    return false
  }

  return route.every((cell, index) => cell === solution[index])
}

export const checkPuzzleValidity = (puzzle: PuzzleDefinition) => {
  if (!puzzle.solution.length) {
    return false
  }

  const checkpointNumbers = [...puzzle.checkpoints].sort((a, b) => a - b)
  const uniqueCheckpoints = new Set(checkpointNumbers)

  if (checkpointNumbers.length !== uniqueCheckpoints.size) {
    return false
  }

  return checkpointNumbers.every((value, index) => {
    if (index === 0) {
      return value >= 1 && value <= puzzle.solution.length
    }

    return value > checkpointNumbers[index - 1] && value <= puzzle.solution.length
  })
}

export const detectWin = (route: string[], puzzle: PuzzleDefinition) => {
  if (route.length !== puzzle.solution.length) {
    return false
  }

  return route.every((cell, index) => cell === puzzle.solution[index])
}

export const findHint = (route: string[], puzzle: PuzzleDefinition) => {
  const nextIndex = route.length
  const nextCell = puzzle.solution[nextIndex]

  if (!nextCell) {
    return { type: 'route', coords: parsePath(puzzle.solution), message: 'The puzzle is complete.' }
  }

  const checkpointValue = puzzle.checkpoints.find((value) => value === nextIndex + 1)
  const message = checkpointValue
    ? `Next checkpoint: ${checkpointValue}`
    : 'Continue the route along the current neighboring branch.'

  return {
    type: checkpointValue ? 'checkpoint' : 'next-step',
    coords: [parsePath([nextCell])[0]],
    message,
  }
}

export const solvePuzzle = (puzzle: PuzzleDefinition) => {
  if (!checkPuzzleValidity(puzzle)) {
    return null
  }

  return puzzle.solution
}

export const checkImpossibleState = (route: string[], puzzle: PuzzleDefinition) => {
  if (!route.length) {
    return false
  }

  const expected = puzzle.solution[route.length - 1]
  if (route[route.length - 1] !== expected) {
    return true
  }

  for (let index = 0; index < route.length; index += 1) {
    if (route[index] !== puzzle.solution[index]) {
      return true
    }
  }

  return false
}

export const generateShareText = (game: {
  boardSize: number
  elapsedSeconds: number
  moves: number
  hintsUsed: number
  completed: boolean
  dateKey?: string
}) => {
  const title = 'Pathline'
  const stamp = game.dateKey ? `${game.dateKey}` : new Date().toISOString().slice(0, 10)
  return [
    title,
    stamp,
    `${game.boardSize} by ${game.boardSize}`,
    game.completed ? 'Completed' : 'In progress',
    `Time: ${Math.floor(game.elapsedSeconds / 60)}:${String(game.elapsedSeconds % 60).padStart(2, '0')}`,
    `Moves: ${game.moves}`,
    `Hints: ${game.hintsUsed}`,
  ].join('\n')
}

export const isCheckpointCell = (puzzle: PuzzleDefinition, cell: string) => {
  const cellIndex = puzzle.solution.indexOf(cell)
  if (cellIndex === -1) {
    return false
  }

  return puzzle.checkpoints.includes(cellIndex + 1)
}

export const getCellPosition = (cell: string) => {
  const [row, col] = cell.split(',').map(Number)
  return { row, col }
}

export const cellLabel = (cell: string, puzzle: PuzzleDefinition) => {
  const index = puzzle.solution.indexOf(cell)
  return index >= 0 ? index + 1 : null
}

export const checkPathOrder = (route: string[], puzzle: PuzzleDefinition) =>
  route.every((cell, index) => cell === puzzle.solution[index])
