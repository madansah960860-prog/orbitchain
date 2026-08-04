import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA build: emits dist/index.html plus hashed assets under dist/assets.
// Deployed to Apache alongside the .htaccess in public/ (copied verbatim to dist).
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // React + router are needed to render anything, so they stay
          // in the critical path. GSAP/Lenis are deliberately NOT listed:
          // src/lib/motion.js imports them dynamically, so Rollup splits
          // them into their own chunk that loads after first paint.
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
