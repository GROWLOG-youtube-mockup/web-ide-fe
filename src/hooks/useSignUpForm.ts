import { DEFAULT_ERRORS, DEFAULT_FORM_DATA } from "@/constants/auth"
import { signUpFormSchema } from "@/lib/auth-schemas"
import type { FormErrors, SignUpFormData } from "@/types/auth"
import { useEmailVerification } from "./useEmailVerification"
import { useFormValidation } from "./useFormValidation"

export const useSignUpForm = () => {
  // 공통 폼 검증 훅 사용
  const { formData, errors, handleInputChange, setFieldError, setAllErrors } =
    useFormValidation<SignUpFormData>(
      DEFAULT_FORM_DATA.signup,
      DEFAULT_ERRORS.signup as FormErrors<SignUpFormData>
    )

  // 이메일 인증 훅 사용
  const {
    emailVerification,
    sendVerificationCode,
    verifyCode: verifyEmailCode,
    checkEmailVerification,
  } = useEmailVerification((field, error) => setFieldError(field as keyof SignUpFormData, error))

  // 회원가입 폼 검증 (훅 내부 함수)
  const validateForm = (
    email: string,
    password: string,
    name: string,
    verificationCode: string
  ) => {
    const result = signUpFormSchema.safeParse({ email, name, password, verificationCode })

    if (result.success) {
      return {
        email: undefined,
        isValid: true,
        name: undefined,
        password: undefined,
        verificationCode: undefined,
      }
    }

    // 에러 메시지 추출
    const fieldErrors = result.error.flatten().fieldErrors
    return {
      email: fieldErrors.email?.[0],
      isValid: false,
      name: fieldErrors.name?.[0],
      password: fieldErrors.password?.[0],
      verificationCode: fieldErrors.verificationCode?.[0],
    }
  }

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 인증 확인
    if (!checkEmailVerification()) {
      return false
    }

    // 전체 검증
    const result = validateForm(
      formData.email,
      formData.password,
      formData.name,
      formData.verificationCode
    )

    setAllErrors({
      email: result.email || "",
      name: result.name || "",
      password: result.password || "",
      verificationCode: result.verificationCode || "",
    })

    if (result.isValid) {
      console.log("회원가입 처리:", formData)
      // TODO: 실제 회원가입 API 호출
      return true
    }
    return false
  }

  // 이메일 인증 코드 전송 핸들러
  const handleSendVerificationCode = () => {
    sendVerificationCode(formData.email)
  }

  // 이메일 인증 코드 확인 핸들러
  const handleVerifyCode = () => {
    verifyEmailCode(formData.verificationCode)
  }

  return {
    emailVerification,
    errors,
    formData,
    handleInputChange,
    handleSendVerificationCode,
    handleSubmit,
    handleVerifyCode,
  }
}
