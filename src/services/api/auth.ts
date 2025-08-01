import type {
  ApiResponse,
  EmailSendRequest,
  EmailVerifyRequest,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  UserInfoResponse,
} from "@/types/api"
import apiClient from "."

export const login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post("/auth/login", data)
  return response.data
}

export const signUp = async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
  const response = await apiClient.post("/users/signup", data)
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

export const getUserInfo = async (): Promise<ApiResponse<UserInfoResponse>> => {
  const response = await apiClient.get("/users/me")
  return response.data
}
