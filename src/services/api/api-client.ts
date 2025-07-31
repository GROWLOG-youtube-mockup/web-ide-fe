import axios from "axios"

export const api = axios.create({
  // biome-ignore lint/style/useNamingConvention: axios standard property
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Authorization: import.meta.env.VITE_JWT,
  },
})
