import { DIFFICULTIES, DAILY_PUZZLE_SEED_PREFIX } from './config'
import type { CellCoord, Difficulty, GridSize, PuzzleDefinition } from './types'
import { cellKey, isInsideBoard, neighborCells } from './utils/path'

const hashString = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash >>> 0)
}

const mulberry32 = (seed: number) => {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const getRouteByDepthFirstSearch = (size: GridSize, start: CellCoord): CellCoord[] | null => {
  const totalCells = size * size
  const visited = new Set<string>([cellKey(start)])
  const route: CellCoord[] = [start]

  const search = (current: CellCoord): boolean => {
    if (route.length === totalCells) {
      return true
    }

    const nextOptions = neighborCells(current, size)
      .filter((candidate) => !visited.has(cellKey(candidate)))
      .map((candidate) => ({
        cell: candidate,
        options: neighborCells(candidate, size).filter(
          (next) => !visited.has(cellKey(next)) && isInsideBoard(next.row, next.col, size),
        ).length,
      }))
      .sort((a, b) => a.options - b.options)

    for (const option of nextOptions) {
      const { cell } = option
      visited.add(cellKey(cell))
      route.push(cell)
      if (search(cell)) {
        return true
      }
      route.pop()
      visited.delete(cellKey(cell))
    }

    return false
  }

  if (!search(start)) {
    return null
  }

  return route
}

export const generateHamiltonianPath = (size: GridSize): CellCoord[] => {
  const starts: CellCoord[] = [
    { row: 0, col: 0 },
    { row: 0, col: size - 1 },
    { row: size - 1, col: 0 },
    { row: size - 1, col: size - 1 },
  ]

  for (const start of starts) {
    const path = getRouteByDepthFirstSearch(size, start)
    if (path && path.length === size * size) {
      return path
    }
  }

  return [{ row: 0, col: 0 }]
}

const buildCheckpointIndices = (solutionLength: number, targetCount: number, seed: number) => {
  const random = mulberry32(seed)
  const indices = new Set<number>()
  const maxStart = Math.max(0, solutionLength - 1)

  if (solutionLength <= 2) {
    return [0, solutionLength - 1]
  }

  const spacing = Math.max(1, Math.floor(solutionLength / Math.max(1, targetCount + 1)))
  let nextIndex = 0

  while (indices.size < Math.min(targetCount, solutionLength)) {
    const jitter = Math.round((random() - 0.5) * spacing)
    const candidate = Math.max(0, Math.min(maxStart, nextIndex + jitter))
    indices.add(candidate)
    nextIndex += spacing + 1
    if (nextIndex >= solutionLength) {
      break
    }
  }

  const sorted = Array.from(indices).sort((a, b) => a - b)
  if (!sorted.includes(0)) {
    sorted.unshift(0)
  }
  if (!sorted.includes(solutionLength - 1)) {
    sorted.push(solutionLength - 1)
  }

  return sorted.filter((value, index, allValues) => allValues.indexOf(value) === index)
}

const toRouteStrings = (path: CellCoord[]) => path.map(({ row, col }) => `${row},${col}`)

export const generatePuzzle = ({
  boardSize,
  difficulty,
  mode,
  dateKey,
}: {
  boardSize: GridSize
  difficulty: Difficulty
  mode: PuzzleDefinition['mode']
  dateKey?: string
}): PuzzleDefinition => {
  const solutionPath = generateHamiltonianPath(boardSize)
  const route = toRouteStrings(solutionPath)
  const targetCheckpoints = Math.min(
    DIFFICULTIES[difficulty].checkpoints,
    Math.max(4, Math.floor((boardSize * boardSize) / 3)),
  )

  const seedSource = dateKey
    ? `${DAILY_PUZZLE_SEED_PREFIX}:${dateKey}:${boardSize}:${difficulty}`
    : `${boardSize}:${difficulty}:${mode}:${Math.random().toString(36).slice(2)}`
  const seed = hashString(seedSource)
  const checkpointIndices = buildCheckpointIndices(route.length, targetCheckpoints, seed)
  const checkpointNumbers = checkpointIndices.map((index) => index + 1)

  return {
    id: `${mode}-${boardSize}-${difficulty}-${seedSource}`,
    boardSize,
    difficulty,
    mode,
    solution: route,
    checkpoints: checkpointNumbers,
    checkpointCells: checkpointIndices.map((index) => route[index]),
    createdAt: new Date().toISOString(),
    dateKey,
  }
}

export const generateCustomPuzzleFromRoute = (
  route: string[],
  boardSize: GridSize,
  difficulty: Difficulty,
  mode: PuzzleDefinition['mode'] = 'custom',
): PuzzleDefinition => {
  const trimmedRoute = route.length ? Array.from(new Set(route)) : ['0,0']
  const checkpointIndices = buildCheckpointIndices(trimmedRoute.length, Math.min(DIFFICULTIES[difficulty].checkpoints, trimmedRoute.length), hashString(trimmedRoute.join('|')))
  const checkpointNumbers = checkpointIndices.map((index) => index + 1)

  return {
    id: `custom-${boardSize}-${difficulty}-${trimmedRoute.length}`,
    boardSize,
    difficulty,
    mode,
    solution: trimmedRoute,
    checkpoints: checkpointNumbers,
    checkpointCells: checkpointIndices.map((index) => trimmedRoute[index]),
    createdAt: new Date().toISOString(),
  }
}

export const getDailyPuzzleKey = (date = new Date()) => date.toISOString().slice(0, 10)

export const getDailyPuzzle = (boardSize: GridSize, difficulty: Difficulty = 'easy') =>
  generatePuzzle({
    boardSize,
    difficulty,
    mode: 'daily',
    dateKey: getDailyPuzzleKey(),
  })

export const getPracticePuzzle = (boardSize: GridSize, difficulty: Difficulty = 'easy') =>
  generatePuzzle({
    boardSize,
    difficulty,
    mode: 'practice',
  })
