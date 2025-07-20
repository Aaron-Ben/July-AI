import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
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
        floatingBall: 'src/floatingBall.js',
        ask: 'src/ask.js'
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