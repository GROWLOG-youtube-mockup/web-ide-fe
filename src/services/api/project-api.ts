import apiClient from "@/services/api/index"
import type { ApiResponse, ProjectMember } from "@/types/api"
import type { CreateProjectRequest, UpdateProjectRequest } from "@/types/project"

export const projectApi = {
  // 프로젝트 사용자 초대
  inviteUser: async (projectId: string, emails: string[]): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.post<ApiResponse<string[]>>(`/projects/${projectId}/invite`, {
      emails,
    })
    return response.data
  },

  // 프로젝트 멤버 목록 조회
  getProjectMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const response = await apiClient.get<ApiResponse<ProjectMember[]>>(
      `/projects/${projectId}/members`
    )
    return response.data.data || []
  },

  // 프로젝트 멤버 권한 수정
  updateMemberRole: async (
    projectId: string,
    userId: string,
    role: "READ" | "WRITE"
  ): Promise<ApiResponse<string>> => {
    const response = await apiClient.patch<ApiResponse<string>>(
      `/projects/${projectId}/members/${userId}`,
      { role }
    )
    return response.data
  },

  // 프로젝트 멤버 삭제
  removeMember: async (projectId: string, userId: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete<ApiResponse<string>>(
      `/projects/${projectId}/members/${userId}`
    )
    return response.data
  },

  // 사용자 권한 확인
  getMyPermission: async (projectId: string): Promise<UserPermission> => {
    const response = await apiClient.get<ApiResponse<UserPermission>>(
      `/projects/${projectId}/permissions/me`
    )
    return response.data.data || { role: "READ" }
  },

  // 프로젝트 생성
  createProject: async (projectData: CreateProjectRequest) => {
    const response = await apiClient.post("/projects", projectData)
    return response.data
  },

  // 프로젝트 수정
  updateProject: async (projectId: number, projectData: UpdateProjectRequest) => {
    const response = await apiClient.patch(`/projects/${projectId}`, projectData)
    return response.data
  },
}

export interface UserPermission {
  role: "READ" | "WRITE" | "OWNER"
}
