export const GAME_NAME = 'Pathline'

export const BOARD_SIZES = [5, 6, 7] as const

export const DIFFICULTIES = {
  easy: { label: 'Easy', checkpoints: 5, ambiguity: 0.2 },
  medium: { label: 'Medium', checkpoints: 8, ambiguity: 0.4 },
  hard: { label: 'Hard', checkpoints: 12, ambiguity: 0.65 },
} as const

export const STORAGE_KEYS = {
  currentPuzzle: 'pathline-current-puzzle',
  stats: 'pathline-stats',
  dailySolved: 'pathline-daily-solved',
  practiceSettings: 'pathline-practice-settings',
  customPuzzle: 'pathline-custom-puzzle',
} as const

export const DAILY_PUZZLE_SEED_PREFIX = 'pathline-daily'
