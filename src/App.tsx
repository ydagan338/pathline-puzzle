import { useEffect, useMemo, useState, type PointerEvent } from 'react'
import './App.css'
import { loadJson, saveJson } from './utils/storage'

type Puzzle = {
  id: string
  solution: string[]
  checkpointCount: number
  difficulty: number
}

type Ranking = {
  puzzleId: string
  difficulty: number
  timeMs: number
  completedAt: string
}

const BOARD_SIZE = 5
const MIN_CHECKPOINTS = 5
const MAX_CHECKPOINTS = 8
const RANKINGS_KEY = 'pathline-rankings'
const THEMES = {
  ocean: 'Ocean',
  sunset: 'Sunset',
  meadow: 'Meadow',
  night: 'Night',
} as const
type Theme = keyof typeof THEMES

const keyFrom = (row: number, col: number) => `${row},${col}`

const coordsFrom = (key: string) => {
  const [row, col] = key.split(',').map(Number)
  return { row, col }
}

const isAdjacent = (first: string, second: string) => {
  const a = coordsFrom(first)
  const b = coordsFrom(second)
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1
}

const keyboardDirections = {
  ArrowUp: { row: -1, col: 0 },
  ArrowRight: { row: 0, col: 1 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
} as const

const makeMazePath = () => {
  const start = keyFrom(0, 0)
  const route = [start]
  const visited = new Set([start])

  const search = (): boolean => {
    if (route.length === BOARD_SIZE * BOARD_SIZE) {
      return true
    }

    const current = coordsFrom(route[route.length - 1])
    const neighbors = [
      [current.row - 1, current.col],
      [current.row, current.col + 1],
      [current.row + 1, current.col],
      [current.row, current.col - 1],
    ]
      .filter(([row, col]) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE)
      .sort(() => Math.random() - 0.5)

    for (const [row, col] of neighbors) {
      const next = keyFrom(row, col)
      if (visited.has(next)) {
        continue
      }

      visited.add(next)
      route.push(next)
      if (search()) {
        return true
      }
      route.pop()
      visited.delete(next)
    }

    return false
  }

  search()
  return route
}

const buildPuzzle = (): Puzzle => {
  const solution = makeMazePath()
  const checkpointCount = Math.floor(Math.random() * (MAX_CHECKPOINTS - MIN_CHECKPOINTS + 1)) + MIN_CHECKPOINTS
  let turns = 0

  for (let index = 1; index < solution.length - 1; index += 1) {
    const previous = coordsFrom(solution[index - 1])
    const next = coordsFrom(solution[index + 1])
    if (previous.row !== next.row && previous.col !== next.col) {
      turns += 1
    }
  }

  const difficulty = Math.min(10, Math.max(1, 1 + (checkpointCount - MIN_CHECKPOINTS) + Math.round((turns / (solution.length - 2)) * 5)))

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    solution,
    checkpointCount,
    difficulty,
  }
}

const formatTime = (timeMs: number) => {
  const totalSeconds = Math.floor(timeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const tenths = Math.floor((timeMs % 1000) / 100)
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`
}

function App() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => buildPuzzle())
  const [path, setPath] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [pointerPoint, setPointerPoint] = useState<string | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [rankings, setRankings] = useState<Ranking[]>(() => loadJson<Ranking[]>(RANKINGS_KEY, []))
  const [lastResult, setLastResult] = useState<{ difficulty: number; timeMs: number; rank: number } | null>(null)
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('pathline-theme') as Theme | null
    return savedTheme && savedTheme in THEMES ? savedTheme : 'ocean'
  })

  useEffect(() => {
    localStorage.setItem('pathline-theme', theme)
  }, [theme])

  useEffect(() => {
    if (startedAt === null || completed) {
      return
    }
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAt), 100)
    return () => window.clearInterval(timer)
  }, [startedAt, completed])

  useEffect(() => {
    const stopDragging = () => {
      setDragging(false)
      setPointerPoint(null)
    }
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
    return () => {
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
    }
  }, [])

  const boardStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
    }),
    [],
  )

  const routePoints = path
    .map((cell) => {
      const { row, col } = coordsFrom(cell)
      return `${((col + 0.5) / BOARD_SIZE) * 100},${((row + 0.5) / BOARD_SIZE) * 100}`
    })
    .join(' ')
  const visibleRoutePoints = pointerPoint && dragging
    ? `${routePoints} ${pointerPoint}`
    : routePoints

  const checkpointNumbers = useMemo(
    () => new Map(
      Array.from({ length: puzzle.checkpointCount }, (_, index) => [
        puzzle.solution[Math.round(index * (puzzle.solution.length - 1) / (puzzle.checkpointCount - 1))],
        index + 1,
      ]),
    ),
    [puzzle],
  )

  const rankingDifficulty = lastResult?.difficulty ?? puzzle.difficulty
  const visibleRankings = rankings
    .filter((ranking) => ranking.difficulty === rankingDifficulty)
    .slice(0, 5)

  const resetPuzzle = (nextPuzzle = buildPuzzle()) => {
    setPuzzle(nextPuzzle)
    setPath([])
    setDragging(false)
    setPointerPoint(null)
    setElapsedMs(0)
    setStartedAt(null)
    setCompleted(false)
  }

  const addStep = (cell: string) => {
    setPath((currentPath) => {
      const existingIndex = currentPath.indexOf(cell)
      if (existingIndex !== -1) {
        if (existingIndex < currentPath.length - 1) {
          return currentPath.slice(0, existingIndex + 1)
        }
        return currentPath
      }

      const lastCell = currentPath[currentPath.length - 1]

      if (!lastCell) {
        if (cell !== puzzle.solution[0]) {
          return currentPath
        }
        return [...currentPath, cell]
      }

      if (!isAdjacent(lastCell, cell)) {
        return currentPath
      }

      const nextCheckpoint = currentPath.reduce(
        (highest, visitedCell) => Math.max(highest, checkpointNumbers.get(visitedCell) ?? 0),
        0,
      ) + 1
      const checkpoint = checkpointNumbers.get(cell)
      if (checkpoint && checkpoint !== nextCheckpoint) {
        return currentPath
      }

      const nextPath = [...currentPath, cell]
      if (nextPath.length === puzzle.solution.length) {
        const completionTime = startedAt === null ? 0 : Date.now() - startedAt
        const newRanking: Ranking = {
          puzzleId: puzzle.id,
          difficulty: puzzle.difficulty,
          timeMs: completionTime,
          completedAt: new Date().toISOString(),
        }
        const nextRankings = [...rankings, newRanking].sort((first, second) => {
          if (first.difficulty !== second.difficulty) {
            return first.difficulty - second.difficulty
          }
          return first.timeMs - second.timeMs
        })
        const difficultyRankings = nextRankings.filter((ranking) => ranking.difficulty === puzzle.difficulty)
        setRankings(nextRankings)
        saveJson(RANKINGS_KEY, nextRankings)
        setLastResult({
          difficulty: puzzle.difficulty,
          timeMs: completionTime,
          rank: difficultyRankings.findIndex((ranking) => ranking.puzzleId === puzzle.id) + 1,
        })
        setCompleted(true)
        window.setTimeout(() => {
          resetPuzzle(buildPuzzle())
        }, 2200)
      } else {
      }

      return nextPath
    })
  }

  const handleRestart = () => {
    setPath([])
    setDragging(false)
    setElapsedMs(0)
    setStartedAt(null)
    setCompleted(false)
  }

  const moveWithKeyboard = (key: keyof typeof keyboardDirections) => {
    if (completed) {
      return
    }

    const currentCell = path[path.length - 1] ?? puzzle.solution[0]
    const direction = keyboardDirections[key]
    const current = coordsFrom(currentCell)
    const nextRow = current.row + direction.row
    const nextCol = current.col + direction.col

    if (nextRow < 0 || nextRow >= BOARD_SIZE || nextCol < 0 || nextCol >= BOARD_SIZE) {
      return
    }

    const nextCell = keyFrom(nextRow, nextCol)
    if (!isAdjacent(currentCell, nextCell)) {
      return
    }

    if (path.length === 0) {
      setPath([puzzle.solution[0]])
      setStartedAt(Date.now())
    }

    addStep(nextCell)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.matches('input, select, textarea')) {
        return
      }

      const key = event.key as keyof typeof keyboardDirections
      if (!keyboardDirections[key]) {
        return
      }

      event.preventDefault()
      moveWithKeyboard(key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [completed, path, puzzle])

  const handlePointerDown = (cell: string) => {
    if (path.length === 0 && cell !== puzzle.solution[0]) {
      return
    }
    setDragging(true)
    if (path.length === 0) {
      setStartedAt(Date.now())
    }
    const { row, col } = coordsFrom(cell)
    setPointerPoint(`${((col + 0.5) / BOARD_SIZE) * 100},${((row + 0.5) / BOARD_SIZE) * 100}`)
    addStep(cell)
  }

  const handlePointerEnter = (cell: string) => {
    if (!dragging) {
      return
    }
    addStep(cell)
  }

  const handlePointerUp = () => {
    setDragging(false)
    setPointerPoint(null)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) {
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setPointerPoint(`${x},${y}`)
  }

  return (
    <main className={`maze-app theme-${theme}`}>
      <header className="maze-topbar">
        <div>
          <p className="eyebrow">Maze path</p>
          <h1>Pathline</h1>
        </div>
        <div className="action-row">
          <button type="button" onClick={handleRestart}>Restart</button>
          <button type="button" className="primary" onClick={() => resetPuzzle(buildPuzzle())}>New puzzle</button>
        </div>
      </header>

      <section className="stats-bar">
        <div className="stat-card">
          <span>Progress</span>
          <strong>{path.length}/{BOARD_SIZE * BOARD_SIZE}</strong>
        </div>
        <div className="stat-card">
          <span>Time</span>
          <strong>{formatTime(elapsedMs)}</strong>
        </div>
        <div className="stat-card">
          <span>Difficulty</span>
          <strong>{puzzle.difficulty}/10</strong>
        </div>
        <label className="theme-picker">
          <span>Theme</span>
          <select value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
            {Object.entries(THEMES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="maze-panel">
        <div className="board-shell">
          <div className="board-stage" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
            <svg className="route-overlay" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1769e8" />
                  <stop offset="100%" stopColor="#6434c9" />
                </linearGradient>
              </defs>
              <polyline points={visibleRoutePoints} fill="none" stroke="url(#route-gradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" />
            </svg>
            <div className="board" style={boardStyle}>
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
              const row = Math.floor(index / BOARD_SIZE)
              const col = index % BOARD_SIZE
              const key = keyFrom(row, col)
              const number = checkpointNumbers.get(key)
              const isVisited = path.includes(key)
              const isCurrent = path[path.length - 1] === key
              return (
                <button
                  key={key}
                  type="button"
                  className={`maze-cell ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''}`}
                  onPointerDown={() => handlePointerDown(key)}
                  onPointerEnter={() => handlePointerEnter(key)}
                  onPointerUp={handlePointerUp}
                  aria-label={number ? `Checkpoint ${number}` : 'Maze cell'}
                >
                  <span className="cell-value">{number ?? ''}</span>
                </button>
              )
            })}
            </div>
          </div>
        </div>

      </section>

      <section className="rankings-panel">
        <div className="rankings-heading">
          <div>
            <span className="section-label">Rankings</span>
            <h2>Difficulty {rankingDifficulty}/10</h2>
          </div>
          {lastResult && <p>Your last time: <strong>{formatTime(lastResult.timeMs)}</strong> · Rank #{lastResult.rank}</p>}
        </div>
        {visibleRankings.length > 0 ? (
          <ol className="ranking-list">
            {visibleRankings.map((ranking, index) => (
              <li key={`${ranking.puzzleId}-${ranking.completedAt}`}>
                <span>#{index + 1}</span>
                <strong>{formatTime(ranking.timeMs)}</strong>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-rankings">Complete this difficulty to set a time.</p>
        )}
      </section>
    </main>
  )
}

export default App
