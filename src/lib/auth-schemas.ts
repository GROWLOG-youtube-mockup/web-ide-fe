import { z } from "zod"
import { VALIDATION } from "@/constants/auth"
import type { AllFormErrors } from "@/types/auth"

const { limits, messages } = VALIDATION

// Zod 스키마 정의
export const emailSchema = z.string().min(1, messages.required.email).email(messages.format.email)

// 회원가입용 복잡한 패스워드 스키마 (보안 정책 적용)
export const passwordSchema = z
  .string()
  .min(1, messages.required.password)
  .min(limits.password.min, messages.constraints.passwordMin)
  .max(limits.password.max, messages.constraints.passwordMax)
  .regex(/[a-zA-Z]/, messages.constraints.passwordLetter)
  .regex(/[0-9]/, messages.constraints.passwordNumber)
  .regex(/[!@#$%^&*(),.?":{}|<>]/, messages.constraints.passwordSpecial)

export const nameSchema = z
  .string()
  .min(1, messages.required.name)
  .min(limits.name.min, messages.constraints.nameMin)
  .max(limits.name.max, messages.constraints.nameMax)

export const verificationCodeSchema = z
  .string()
  .min(1, messages.required.verificationCode)
  .length(limits.verificationCode.length, messages.format.verificationCode)

// 로그인용 단순 패스워드 스키마 (형식 검사 없음)
export const loginPasswordSchema = z.string().min(1, messages.required.password)

export const loginFormSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema, // 단순한 필수값 검사만
})

export const signUpFormSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema, // 회원가입시에만 복잡한 검증 적용
  verificationCode: verificationCodeSchema,
})

// 스키마 매핑
const fieldSchemas = {
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
} as const

// 필드 검증
export const validateField = (
  field: keyof AllFormErrors,
  value: string,
  isSubmit = false
): string => {
  // 실시간 검증 시 빈 값은 에러로 처리하지 않음
  if (!isSubmit && !value.trim()) {
    return ""
  }

  const schema = fieldSchemas[field]
  const result = schema.safeParse(value)

  return result.success ? "" : result.error.issues[0].message
}
