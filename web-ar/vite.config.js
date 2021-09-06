import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      
    },
    hmr: {
      overlay: true,
    },
    // open: true,
  },
  resolve: {
    alias: {
      '/@': path.resolve(__dirname, '.', 'src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: [],
  },
  plugins: [vue(), vueJsx(), styleImport({
    libs: [
      {
        libraryName: 'vant',
        esModule: true,
        resolveStyle: (name) => `vant/es/${name}/style`,
      },
    ],
  }),],
})
