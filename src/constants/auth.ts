// 인증 관련 설정 및 메시지

// 폼 검증 설정 및 메시지
export const VALIDATION = {
  limits: {
    email: { max: 254 },
    name: { max: 20, min: 2 },
    password: { max: 16, min: 8 },
    verificationCode: { length: 6 },
  },
  messages: {
    constraints: {
      nameMax: "Name can be up to 20 char",
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
      sendFail: "이메일 전송에 실패했습니다.",
      verifyFail: "인증 코드가 올바르지 않습니다.",
    },
  },
} as const

// 이메일 인증 초기 상태
export const DEFAULT_EMAIL_VERIFY = {
  isLoading: false,
  isSent: false,
  isVerified: false,
} as const

// 개발/테스트 설정
export const DEV_CONFIG = {
  apiDelay: 1000, // API 응답 시뮬레이션 지연시간(ms)
} as const
