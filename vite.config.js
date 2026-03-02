import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ── Dev server ────────────────────────────────────────────────
  server: {
    port: 5173,
    open: true,
  },

  // ── Production build ──────────────────────────────────────────
  build: {
    outDir: 'dist',
    sourcemap: false,       // disable sourcemaps in prod (smaller bundle)
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        // Split vendor libs into a separate chunk for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          axios:  ['axios'],
        },
      },
    },
    // Warn if any single chunk exceeds 500 kB
    chunkSizeWarningLimit: 500,
  },

  // ── Preview server (vite preview) ────────────────────────────
  preview: {
    port: 4173,
    open: true,
  },
})
