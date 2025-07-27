// 인증 관련 설정 및 메시지

// 폼 검증 설정 및 메시지
export const VALIDATION = {
  limits: {
    email: { max: 254 },
    name: { max: 50, min: 2 },
    password: { max: 16, min: 8 },
    verificationCode: { length: 6 },
  },
  messages: {
    constraints: {
      nameMin: "Name must be at least 2 char",
      passwordLetter: "Must contain English char",
      passwordMax: "Password can be up to 16 char",
      passwordMin: "Password must be at least 8 char",
      passwordNumber: "Must contain number",
      passwordSpecial: "Must contain special char",
    },
    format: {
      email: "Not a valid email format",
      verificationCode: "Code must be 6 digits",
    },
    required: {
      email: "Enter your email",
      name: "Enter your name",
      password: "Enter your password",
      verificationCode: "Enter verification code",
    },
    verification: {
      invalid: "Invalid verification code",
      required: "Please verify your email first",
    },
  },
} as const

// 기본 폼 데이터
export const DEFAULT_FORM_DATA = {
  login: { email: "", password: "" },
  signup: { email: "", name: "", password: "", verificationCode: "" },
} as const

// 기본 에러 상태
export const DEFAULT_ERRORS = {
  login: { email: "", password: "" },
  signup: { email: "", name: "", password: "", verificationCode: "" },
} as const

// 이메일 인증 초기 상태
export const DEFAULT_EMAIL_VERIFICATION = {
  isLoading: false,
  isSent: false,
  isVerified: false,
} as const

// 개발/테스트 설정
export const DEV_CONFIG = {
  apiDelay: 1000, // API 응답 시뮬레이션 지연시간(ms)
} as const
