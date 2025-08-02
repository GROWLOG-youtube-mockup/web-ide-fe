/**
 * 서버 API 응답 타입 정의 (API 문서와 일치)
 */

export interface ProjectMember {
  userId: number
  name: string
  role: "OWNER" | "WRITE" | "READ"
  email?: string
  profileImage?: string
}

export interface ProjectResponse {
  projectId: number
  projectName: string
  description: string
  ownerName: string
  memberNames: string[]
  myRole: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProjectsApiResponse {
  success: boolean
  data: ProjectResponse[]
  error: string | null
}

/**
 * 클라이언트 내부에서 사용할 프로젝트 타입
 */
export interface Project {
  id: number
  name: string
  description: string
  ownerName: string
  members: ProjectMember[]
  myRole: "OWNER" | "WRITE" | "READ"
  status: "ACTIVE" | "INACTIVE"
  createdAt: Date
  updatedAt: Date
  // UI 상태
  isToggled?: boolean
}

/**
 * 프로젝트 필터 타입
 */
export type ProjectFilter = "all" | "own" | "joined"
