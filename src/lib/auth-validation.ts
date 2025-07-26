// 인증 관련 검증 타입 정의
export interface ValidationResult {
  isValid: boolean
  message: string | null
}

// 이메일 검증
export const validateEmail = (email: string, isSubmit = false): ValidationResult => {
  const trimmed = email.trim()

  // 제출 시에만
  if (isSubmit && !trimmed) {
    return { isValid: false, message: "Enter your email" }
  }

  // 빈 값은 형식 검증에서 제외
  if (!trimmed) {
    return { isValid: true, message: null }
  }

  // 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: "Not a valid e-mail format" }
  }

  return { isValid: true, message: null }
}
