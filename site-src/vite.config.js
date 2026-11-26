import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds straight into ../docs so Vercel (vercel.json → docs) and GitHub Pages serve it unchanged.
// base './' keeps every asset path relative, so the site works at a domain root or a sub-path.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '../docs', emptyOutDir: true, assetsInlineLimit: 0 },
})
