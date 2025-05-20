import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: command === 'serve' ? '/' : '/thingtwin/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      external: [
        'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
        'https://assets.le5lecdn.com/2d/canvas2svg.js',
        'https://at.alicdn.com/t/c/font_4042197_vr5c62twlzh.js'
      ],
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'media';
          } else if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'imgs';
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'fonts';
          }
          return `${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@meta2d/core']
  },
  server: {
    host: true,
    port: 3000
  }
}));
