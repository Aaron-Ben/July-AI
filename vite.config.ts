import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true
  },
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: 'src/sidebar/index.html',
        floatingBall: 'src/floatingBall.js'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        format: 'es',
        inlineDynamicImports: false
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});