import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8082,
    cors: true,
    strictPort: true,
  },
  preview: {
    port: 8082,
    strictPort: true,
  },
  plugins: [
    react(),
    federation({
      name: 'email',
      filename: 'remoteEntry.js',
      exposes: {
        './EmailApp': './src/micro-apps/email/EmailApp.tsx',
      },
      shared: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'date-fns',
        'lucide-react',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
