import { describe, expect, it } from 'vitest'
import { generatePuzzle, generateHamiltonianPath } from '../generator'
import { checkImpossibleState, checkPuzzleValidity, detectWin, findHint, solvePuzzle, validatePath } from '../solver'

describe('generator and solver', () => {
  it('generates a full Hamiltonian path for 5x5 boards', () => {
    const path = generateHamiltonianPath(5)
    expect(path.length).toBe(25)
    expect(new Set(path.map(({ row, col }) => `${row}:${col}`)).size).toBe(25)
  })

  it('builds a valid puzzle definition with checkpoint order', () => {
    const puzzle = generatePuzzle({ boardSize: 5, difficulty: 'easy', mode: 'practice' })
    expect(puzzle.solution.length).toBe(25)
    expect(checkPuzzleValidity(puzzle)).toBe(true)
    expect([...puzzle.checkpoints].sort((a, b) => a - b)).toEqual(puzzle.checkpoints.slice().sort((a, b) => a - b))
  })

  it('solves a puzzle when the route follows the generated solution', () => {
    const puzzle = generatePuzzle({ boardSize: 5, difficulty: 'medium', mode: 'practice' })
    expect(solvePuzzle(puzzle)).toEqual(puzzle.solution)
    expect(validatePath(puzzle.solution, puzzle.solution)).toBe(true)
    expect(detectWin(puzzle.solution, puzzle)).toBe(true)
  })

  it('detects impossible routes', () => {
    const puzzle = generatePuzzle({ boardSize: 5, difficulty: 'easy', mode: 'practice' })
    const brokenPath = [...puzzle.solution.slice(0, 3), '3,3']
    expect(checkImpossibleState(brokenPath, puzzle)).toBe(true)
  })

  it('creates hints for the next required step', () => {
    const puzzle = generatePuzzle({ boardSize: 5, difficulty: 'easy', mode: 'practice' })
    const hint = findHint([puzzle.solution[0]], puzzle)
    expect(hint.message.length).toBeGreaterThan(0)
    expect(hint.coords.length).toBeGreaterThan(0)
  })
})
