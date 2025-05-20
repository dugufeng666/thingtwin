import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/thingtwin/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      external: [
        'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
        'https://assets.le5lecdn.com/2d/canvas2svg.js',
        'https://at.alicdn.com/t/c/font_4042197_vr5c62twlzh.js'
      ],
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'meta2d': ['@meta2d/core'],
          'vue-vendor': ['vue', 'vue-router'],
        }
      }
    }
  },
  publicDir: 'public'
}));
