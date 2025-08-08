import apiClient from "@/shared/api/api-client"
import type {
  ApiResponse,
  EmailSendRequest,
  EmailVerifyRequest,
  LoginRequest,
  LoginResponse,
} from "@/shared/types/api"

export const login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post("/auth/login", data)
  return response.data
}

export const sendEmailVerification = async (
  data: EmailSendRequest
): Promise<ApiResponse<Record<string, string>>> => {
  const response = await apiClient.post("/auth/email/send", data)
  return response.data
}

export const verifyEmail = async (
  data: EmailVerifyRequest
): Promise<ApiResponse<Record<string, boolean>>> => {
  const response = await apiClient.post("/auth/email/verify", data)
  return response.data
}
