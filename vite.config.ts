import { defineConfig } from 'vitest/config';
import { ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import path from 'path';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [
      react(),
      compression({
        algorithms: ['brotliCompress'],
        exclude: [/\.(br)$/, /\.(gz)$/],
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) return 'icons';
              if (id.includes('html2canvas')) return 'html2canvas';
              if (id.includes('jspdf') || id.includes('jspdf-autotable')) return 'pdf-lib';
              if (id.includes('supabase')) return 'supabase';
              if (id.includes('react')) return 'react-vendor';
              if (id.includes('date-fns')) return 'date-fns';
              return 'vendor';
            }
          }
        }
      },
      chunkSizeWarningLimit: 800,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test/setup.ts',
      exclude: [
        'node_modules',
        'dist',
        '.idea',
        '.git',
        '.cache',
        'tests'
      ],
      css: true,
    },
  };
});
