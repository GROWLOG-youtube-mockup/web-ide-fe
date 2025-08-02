import axios from "axios"

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "http://15.165.2.193:8080",
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터: Authorization 헤더 추가
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // FormData인 경우 Content-Type 헤더 제거 (axios가 자동 설정)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]
  }
  return config
})

// 응답 인터셉터: 401 에러 시 로그아웃 처리
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      localStorage.removeItem("accessToken")
      // 현재 URL을 저장하여 로그인 후 다시 돌아갈 수 있도록 함
      const currentPath = window.location.pathname
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
    }
    return Promise.reject(error)
  }
)

export default apiClient
