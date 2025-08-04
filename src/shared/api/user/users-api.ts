import type {
  ApiResponse,
  ProfileImageResponse,
  SignUpRequest,
  SignUpResponse,
  UserInfoResponse,
} from "@/backup/types/api"
import apiClient from "@/shared/api/api-client"

// 회원가입
export const signUp = async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
  const response = await apiClient.post("/users/signup", data)
  return response.data
}

// 내 정보 조회
export const getMyInfo = async (): Promise<UserInfoResponse> => {
  const response = await apiClient.get<ApiResponse<UserInfoResponse>>("/users/me")
  if (!response.data.data) {
    throw new Error("could not fetch user info")
  }
  return response.data.data
}

// 프로필 이미지 업로드
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("profileImage", file) // API 문서에 맞는 필드명

  const response = await apiClient.patch<ApiResponse<ProfileImageResponse>>(
    "/users/profile-image",
    formData
    // Content-Type은 apiClient에서 자동으로 설정됨
  )

  if (!response.data.success || !response.data.data) {
    throw new Error("failed to upload profile image")
  }

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
