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
// 비밀번호 검증
export const validatePassword = (password: string, isSubmit = false): ValidationResult => {
  const trimmed = password.trim()

  // 제출 시에만 필수 입력 검증
  if (isSubmit && !trimmed) {
    return { isValid: false, message: "Enter your password" }
  }

  // 빈 값은 형식 검증에서 제외
  if (!trimmed) {
    return { isValid: true, message: null }
  }

  // 형식 검증
  if (trimmed.length < 6) {
    return { isValid: false, message: "Password must be at least 8 char" }
  }

  if (trimmed.length > 16) {
    return { isValid: false, message: "Password can be up to 16 char" }
  }

  // 영문자
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { isValid: false, message: "Must contain English char" }
  }

  // 숫자
  if (!/[0-9]/.test(trimmed)) {
    return { isValid: false, message: "Must contain English number" }
  }

  // 특수문자
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmed)) {
    return { isValid: false, message: "Must contain special char" }
  }

  return { isValid: true, message: null }
}

// 로그인 폼 전체 검증 (제출 시 사용)
export const validateLoginForm = (email: string, password: string) => {
  const emailResult = validateEmail(email, true)
  const passwordResult = validatePassword(password, true)

  return {
    email: emailResult.message,
    isValid: emailResult.isValid && passwordResult.isValid,
    password: passwordResult.message,
  }
}
