import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      "@": path.resolve(__dirname, "./src"),
    },
    mainFields: ['browser', 'module', 'main'],  // Prioritize browser field
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true, process: true }),
        NodeModulesPolyfillPlugin()
      ].filter(Boolean)
    }
  }
}));
