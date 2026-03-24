import { defineConfig, ConfigEnv, UserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import path from 'path';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [
      react({
        // Se estiver usando Vite 6+, o plugin pode configurar o babel automaticamente
        // ou você pode tentar remover opções se houver conflitos.
      }),
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
          manualChunks(id: string) {
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
