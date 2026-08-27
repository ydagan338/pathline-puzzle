import type { CellCoord, GridSize } from '../types'

export const DIRECTIONS: CellCoord[] = [
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: -1 },
]

export const cellKey = ({ row, col }: CellCoord) => `${row}:${col}`

export const isInsideBoard = (row: number, col: number, size: GridSize) =>
  row >= 0 && row < size && col >= 0 && col < size

export const neighborCells = (cell: CellCoord, size: GridSize) =>
  DIRECTIONS.map((direction) => ({
    row: cell.row + direction.row,
    col: cell.col + direction.col,
  })).filter((next) => isInsideBoard(next.row, next.col, size))

export const getCellIndex = (row: number, col: number, size: GridSize) =>
  row * size + col

export const parsePath = (path: string[]) =>
  path.map((value) => {
    const [row, col] = value.split(',').map(Number)
    return { row, col }
  })

export const createBoardPath = (size: GridSize) => {
  const cells: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  return cells
}

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}
