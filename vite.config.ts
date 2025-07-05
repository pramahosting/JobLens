import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      stream: 'stream-browserify',
      process: 'process/browser',
    },
    mainFields: ['browser', 'module', 'main'],
  },
  define: {
    global: 'globalThis',
    'process.env': {}, // ensures process.env doesn't crash build
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'stream'],
  },
});
