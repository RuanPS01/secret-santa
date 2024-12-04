import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/secret-santa/', // Adicione esta linha
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});