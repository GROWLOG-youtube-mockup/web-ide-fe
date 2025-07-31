import axios from "axios"
import type { ApiResponse, ProjectMember } from "@/types/api"

export interface UserPermission {
  role: "READ" | "WRITE" | "OWNER"
}

const api = axios.create({
  // biome-ignore lint/style/useNamingConvention: axios standard property
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Authorization: import.meta.env.VITE_JWT,
  },
})

export const projectApi = {
  // 프로젝트 사용자 초대
  inviteUser: async (projectId: string, emails: string[]): Promise<ApiResponse<string[]>> => {
    const response = await api.post<ApiResponse<string[]>>(`/projects/${projectId}/invite`, {
      emails,
    })
    return response.data
  },

  // 프로젝트 멤버 목록 조회
  getProjectMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const response = await api.get<ApiResponse<ProjectMember[]>>(`/projects/${projectId}/members`)
    return response.data.data || []
  },

  // 프로젝트 멤버 권한 수정
  updateMemberRole: async (
    projectId: string,
    userId: string,
    role: "READ" | "WRITE"
  ): Promise<ApiResponse<string>> => {
    const response = await api.patch<ApiResponse<string>>(
      `/projects/${projectId}/members/${userId}`,
      { role }
    )
    return response.data
  },

  // 프로젝트 멤버 삭제
  removeMember: async (projectId: string, userId: string): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(
      `/projects/${projectId}/members/${userId}`
    )
    return response.data
  },

  // 사용자 권한 확인
  getMyPermission: async (projectId: string): Promise<UserPermission> => {
    const response = await api.get<ApiResponse<UserPermission>>(
      `/projects/${projectId}/permissions/me`
    )
    return response.data.data || { role: "READ" }
  },
}
