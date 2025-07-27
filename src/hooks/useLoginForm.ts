import { DEFAULT_ERRORS, DEFAULT_FORM_DATA } from "@/constants/auth"
import { loginFormSchema } from "@/lib/auth-schemas"
import type { FormErrors, LoginFormData } from "@/types/auth"
import { useFormValidation } from "./useFormValidation"

export const useLoginForm = () => {
  // 공통 폼 검증 훅 사용
  const { formData, errors, handleInputChange, setAllErrors } = useFormValidation<LoginFormData>(
    DEFAULT_FORM_DATA.login,
    DEFAULT_ERRORS.login as FormErrors<LoginFormData>
  )

  // 로그인 폼 검증
  const validateForm = (email: string, password: string) => {
    const result = loginFormSchema.safeParse({ email, password })

    if (result.success) {
      return {
        email: undefined,
        isValid: true,
        password: undefined,
      }
    }

    // 에러 메시지 추출
    const fieldErrors = result.error.flatten().fieldErrors
    return {
      email: fieldErrors.email?.[0],
      isValid: false,
      password: fieldErrors.password?.[0],
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 제출 시 전체 검증
    const validationResult = validateForm(formData.email, formData.password)

    setAllErrors({
      email: validationResult.email || "",
      password: validationResult.password || "",
    })

    // 에러가 없으면 로그인
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
