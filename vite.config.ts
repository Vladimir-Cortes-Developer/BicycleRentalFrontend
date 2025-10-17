import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
      },
    },
    preview: {
      port: 4173,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
  }
})