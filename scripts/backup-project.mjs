import { execSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const exportDir = path.join(root, 'exports')
mkdirSync(exportDir, { recursive: true })

const dateStamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupFile = path.join(exportDir, `pathline-backup-${dateStamp}.zip`)

const excludes = [
  '-x',
  'node_modules',
  '-x',
  'dist',
  '-x',
  '.git',
  '-x',
  '*.tmp',
  '-x',
  '*.log',
  '-x',
  '.env',
  '-x',
  '.env.*',
]

execSync(`cd "${root}" && zip -r "${backupFile}" . ${excludes.join(' ')}`, { stdio: 'inherit' })
console.log(`Backup archive created: ${backupFile}`)
