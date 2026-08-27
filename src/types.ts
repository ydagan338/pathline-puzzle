export type GridSize = 5 | 6 | 7

export type Difficulty = 'easy' | 'medium' | 'hard'

export type BoardMode = 'daily' | 'practice' | 'custom'

export type CellCoord = {
  row: number
  col: number
}

export type PathCell = CellCoord & {
  value: number
}

export type PuzzleDefinition = {
  id: string
  boardSize: GridSize
  difficulty: Difficulty
  mode: BoardMode
  solution: string[]
  checkpoints: number[]
  checkpointCells?: string[]
  createdAt: string
  dateKey?: string
}

export type GameStats = {
  gamesPlayed: number
  gamesCompleted: number
  currentStreak: number
  bestStreak: number
  averageCompletionTime: number
  fastestCompletionTime: number
  averageMoves: number
  hintsUsed: number
  dailyHistory: string[]
}

export type HintType = 'checkpoint' | 'next-step' | 'warning' | 'route'

export type HintResult = {
  type: HintType
  coords: CellCoord[]
  message: string
}
