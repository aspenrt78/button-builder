import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/button_builder/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir: 'custom_components/button_builder/www',
        emptyOutDir: false, // Don't delete panel.html
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
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
