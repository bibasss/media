import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Папка для сборки, она должна совпадать с тем, что указано в `vercel.json`
  }
});
