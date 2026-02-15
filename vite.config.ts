import path from 'path';
import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
) as { version?: string };
const appVersion = packageJson.version || '0.0.0';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      root: 'src',
      base: '/button_builder/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: {
          overlay: false, // Disable HMR overlay that could interfere with layout
        },
      },
      build: {
        outDir: '../custom_components/button_builder/www',
        emptyOutDir: false, // Don't delete panel.html
        chunkSizeWarningLimit: 4000, // Suppress warning for large bundles (expected for this app)
        rollupOptions: {
          output: {
            entryFileNames: 'index.js',
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'index.css') return 'index.css';
              return 'assets/[name]-[hash][extname]';
            },
          },
        },
      },
      plugins: [react()],
      define: {
        __APP_VERSION__: JSON.stringify(appVersion),
        // No API keys - users provide their own via the UI (BYOK)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      }
    };
});
