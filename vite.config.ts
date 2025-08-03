import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis", // 추가
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/ws": {
        target: process.env.VITE_API_BASE_URL,
        ws: true,
        changeOrigin: true,
        secure: false,
        timeout: 0, // 타임아웃 제거
        rewrite: path => path, // 경로 유지
      },
      "/api": {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
})
