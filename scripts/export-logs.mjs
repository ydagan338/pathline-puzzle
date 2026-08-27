import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dateStamp = new Date().toISOString().replace(/[:.]/g, '-')
const exportDir = path.join(root, 'exports')
mkdirSync(exportDir, { recursive: true })

const zipName = `project_logs_${dateStamp}.zip`
const target = path.join(exportDir, zipName)

const includeList = [
  'agent_logs',
  'README.md',
  'package.json',
  'package-lock.json',
  '.git',
  'src',
  'public',
  'scripts',
]

const items = includeList.filter((entry) => {
  const fullPath = path.join(root, entry)
  try {
    return require('node:fs').existsSync(fullPath)
  } catch {
    return false
  }
})

const manifest = [
  'Export package created by the Pathline project.',
  '',
  'Included contents:',
  ...items.map((item) => `- ${item}`),
  '',
  'This archive contains the conversation logs, development journal, project files, and current repository state.',
].join('\n')

writeFileSync(path.join(root, 'exports', 'EXPORT_MANIFEST.txt'), manifest)

const sourceArgs = items.map((entry) => path.join(root, entry)).join(' ')
execSync(`cd "${root}" && zip -r "${target}" ${sourceArgs} "exports/EXPORT_MANIFEST.txt"`, { stdio: 'inherit' })
console.log(`Export archive created: ${target}`)
