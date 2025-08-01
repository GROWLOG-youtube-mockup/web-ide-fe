import type { ApiResponse, CreateProjectRequest, ProjectResponse } from "@/types/api"
import apiClient from "."

export const getProjects = async (type?: "own" | "joined"): Promise<ProjectResponse[]> => {
  const params = type ? { type } : {}
  const response = await apiClient.get("/projects", { params })
  return response.data
}

export const createProject = async (
  data: CreateProjectRequest
): Promise<ApiResponse<ProjectResponse>> => {
  const response = await apiClient.post("/projects", data)
  return response.data
}

export const getProject = async (projectId: number): Promise<ApiResponse<ProjectResponse>> => {
  const response = await apiClient.get(`/projects/${projectId}`)
  return response.data
}

export const updateProject = async (
  projectId: number,
  data: Partial<CreateProjectRequest>
): Promise<ApiResponse<ProjectResponse>> => {
  const response = await apiClient.patch(`/projects/${projectId}`, data)
  return response.data
}

export const deleteProject = async (projectId: number): Promise<void> => {
  await apiClient.delete(`/projects/${projectId}`)
}

export const updateProjectStatus = async (
  projectId: number,
  status: "ACTIVE" | "INACTIVE"
): Promise<ApiResponse<ProjectResponse>> => {
  const response = await apiClient.patch(`/projects/${projectId}/status`, { status })
  return response.data
}
