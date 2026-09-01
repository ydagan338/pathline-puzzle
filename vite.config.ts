import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/pathline-puzzle/',
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
  },
})
