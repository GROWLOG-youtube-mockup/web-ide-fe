/**
 * 서버 API 응답 타입 정의
 */

export interface ProjectMember {
  userId: number
  name: string
  role: "owner" | "write" | "read"
  email?: string
  profileImage?: string
}

export interface ProjectResponse {
  projectId: number
  name: string
  description: string
  ownerName: string
  memberNames: ProjectMember[]
  myRole: "OWNER" | "WRITE" | "READ"
  status: "ACTIVE" | "INACTIVE"
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

/**
 * API 응답을 클라이언트 타입으로 변환
 */
export const transformProjectResponse = (response: ProjectResponse): Project => {
  return {
    id: response.projectId,
    name: response.name,
    description: response.description,
    ownerName: response.ownerName,
    members: response.memberNames || [], // undefined 방어
    myRole: response.myRole,
    status: response.status,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
    isToggled: false, // 기본값
  }
}
