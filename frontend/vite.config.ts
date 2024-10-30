import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'ES2020',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        background: './src/background_scripts/background.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          switch (chunk.name) {
            case 'background':
              return '[name].js';
            default:
              return 'assets/[name].[hash].js';
          }
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
