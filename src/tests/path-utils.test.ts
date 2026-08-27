import { describe, expect, it } from 'vitest'
import { cellKey, formatDuration, getCellIndex, isInsideBoard, neighborCells } from '../utils/path'

describe('path utilities', () => {
  it('detects valid board positions', () => {
    expect(isInsideBoard(0, 0, 5)).toBe(true)
    expect(isInsideBoard(4, 4, 5)).toBe(true)
    expect(isInsideBoard(5, 0, 5)).toBe(false)
    expect(isInsideBoard(0, 5, 5)).toBe(false)
  })

  it('builds neighbor cells within board bounds', () => {
    expect(neighborCells({ row: 1, col: 1 }, 5)).toHaveLength(4)
    expect(cellKey({ row: 1, col: 1 })).toBe('1:1')
  })

  it('maps cell indices consistently', () => {
    expect(getCellIndex(0, 0, 5)).toBe(0)
    expect(getCellIndex(2, 3, 5)).toBe(13)
  })

  it('formats durations', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(7)).toBe('0:07')
  })
})
