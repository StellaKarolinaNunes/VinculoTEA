import { defineConfig } from 'vitest/config';
import { ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
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
