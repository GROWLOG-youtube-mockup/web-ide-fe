import { useState } from "react"
import { validateField } from "@/lib/auth-schemas"
import type { AllFormErrors } from "@/types/auth"

//폼 검증
export const useFormValidation = <T extends Record<string, string>>(
  initialData: T,
  initialErrors: Record<keyof T, string>
) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<T>(initialData)

  // 에러 상태 관리
  const [errors, setErrors] = useState<Record<keyof T, string>>(initialErrors)

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof T, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // 실시간 검증
    const authFields = ["email", "password", "name", "verificationCode"]
    if (typeof field === "string" && authFields.includes(field)) {
      const error = validateField(field as keyof AllFormErrors, value, false)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // 필드별 에러 설정
  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  // 모든 에러 설정
  const setAllErrors = (newErrors: Record<keyof T, string>) => {
    setErrors(newErrors)
  }

  // 에러 초기화
  const clearErrors = () => {
    setErrors(initialErrors)
  }

  return {
    clearErrors,
    errors,
    formData,
    handleInputChange,
    setAllErrors,
    setFieldError,
  }
}
