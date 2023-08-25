import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    proxy: {
      '/api/v1': {
        target: 'http://10.10.0.1',
        changeOrigin: true,
        //secure: false,
      },
    },
  },
});
