import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

const gitRev = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    __GIT_REV__: JSON.stringify(gitRev),
  },
})
