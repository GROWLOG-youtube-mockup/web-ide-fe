import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import dotenv from "dotenv"
import { defineConfig } from "vite"

dotenv.config()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis",
    ...Object.keys(process.env)
      .filter(key => key.startsWith("VITE_"))
      .reduce(
        (env, key) => {
          env[`import.meta.env.${key}`] = JSON.stringify(process.env[key])
          return env
        },
        {} as Record<string, string>
      ),
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
