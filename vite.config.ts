import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // This polyfills process.env.API_KEY so it works in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // If you have other env vars, define them here or use 'process.env': process.env (careful with exposing secrets)
    }
  };
});