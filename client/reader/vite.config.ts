import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    __APP_ENV__: process.env.VITE_VERCEL_ENV,
  },
  resolve: {
    alias: {
      "@packages/utils": path.resolve(__dirname, "../../packages/utils/utils.ts"),
      "@types": path.resolve(__dirname, "../../server/generated/prisma/browser.ts"),
      "@shared": path.resolve(__dirname, "../shared")
    }
  }
})