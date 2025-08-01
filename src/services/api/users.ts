import type { ApiResponse, SignUpRequest, SignUpResponse, UserInfoResponse } from "@/types/api"
import apiClient from "./index"

// 회원가입
export const signUp = async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
  const response = await apiClient.post("/users/signup", data)
  return response.data
}

// 내 정보 조회
export const getMyInfo = async (): Promise<UserInfoResponse> => {
  const response = await apiClient.get<ApiResponse<UserInfoResponse>>("/users/me")
  if (!response.data.data) {
    throw new Error("사용자 정보를 가져올 수 없습니다")
  }
  return response.data.data
}

// 프로필 이미지 업로드
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("profileImage", file)

  const response = await apiClient.patch("/users/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data.profileImageUrl
}

// 이름 변경
export const updateName = async (name: string): Promise<void> => {
  await apiClient.patch("/users/me/name", { name })
}

// 비밀번호 변경
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await apiClient.patch("/users/me/password", {
    currentPassword,
    newPassword,
  })
}

// 회원 탈퇴
export const deleteAccount = async (password: string): Promise<void> => {
  await apiClient.delete("/users/me", {
    data: { password },
  })
}
