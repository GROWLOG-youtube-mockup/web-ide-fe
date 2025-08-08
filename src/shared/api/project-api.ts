import apiClient from "@/shared/api/api-client"
import type { ApiResponse, ProjectMember, ProjectResponse } from "@/shared/types/api"
import type { CreateProjectRequest, UpdateProjectRequest } from "@/shared/types/project"

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
  createProject: async (projectData: CreateProjectRequest): Promise<{ projectId: string }> => {
    const response = await apiClient.post("/projects", projectData)
    const projectId = response.data?.data?.projectId
    await apiClient.post(`/projects/${projectId}/open`)

    return { projectId }
  },

  // 프로젝트 수정
  updateProject: async (projectId: number, projectData: UpdateProjectRequest) => {
    const response = await apiClient.patch(`/projects/${projectId}`, projectData)
    return response.data
  },

  // 프로젝트 삭제
  deleteProject: async (projectId: number) => {
    const response = await apiClient.delete(`/projects/${projectId}`)
    return response.data
  },
}

export interface UserPermission {
  role: "READ" | "WRITE" | "OWNER"
}

export const getProjects = async (type?: "own" | "joined"): Promise<ProjectResponse[]> => {
  const params = type ? { type } : {}
  const response = await apiClient.get("/projects", { params })
  return response.data.data //프로젝트 목록 조회 배열만 반환
}

export const updateProjectStatus = async (
  projectId: number,
  status: "ACTIVE" | "INACTIVE"
): Promise<ApiResponse<ProjectResponse>> => {
  let response: { data: ApiResponse<ProjectResponse> }
  if (status === "ACTIVE") {
    response = await apiClient.post(`/projects/${projectId}/open`)
  } else {
    response = await apiClient.post(`/projects/${projectId}/close`)
  }
  return response.data
}
