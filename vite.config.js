import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    clean: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      }
    },
    manifest: true,
    assetsInlineLimit: 0,
    publicDir: 'public',
    base: '/'
  },
  server: {
    hmr: {
      overlay: true,
    },
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  worker: {
    enabled: false
  }
})
