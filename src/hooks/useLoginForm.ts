import { useState } from "react"
import {
  type FormErrors,
  type LoginFormData,
  validateField,
  validateLoginForm,
} from "@/lib/auth-validation"

export const useLoginForm = () => {
  // 폼 상태 관리
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  // 에러 상태 관리
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  })

  // 입력값 변경 핸들러
  const handleInputChange =
    (field: keyof FormErrors) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData(prev => ({ ...prev, [field]: value }))

      // 실시간 검증 (간결화)
      const error = validateField(field, value, false)
      setErrors(prev => ({ ...prev, [field]: error }))
    }

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 제출 시 전체 검증
    const validationResult = validateLoginForm(formData.email, formData.password)

    setErrors({
      email: validationResult.email || "",
      password: validationResult.password || "",
    })

    // 에러가 없으면 로그인 처리
    if (validationResult.isValid) {
      console.log("로그인 처리:", formData)
      // TODO: 실제 로그인 API 호출
      return true
    }
    return false
  }

  return {
    errors,
    formData,
    handleInputChange,
    handleSubmit,
  }
}
