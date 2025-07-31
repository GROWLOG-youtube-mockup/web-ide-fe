/// <reference types="vite/client" />nce types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_JWT: string //임시 jwt 추가
  // 필요한 환경 변수들을 여기에 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
