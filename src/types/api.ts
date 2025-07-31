// src/types/api.ts

// 멤버 관리 관련 핵심 에러 코드
export type ErrorCode =
  | "USER_NOT_FOUND"
  | "MEMBER_ALREADY_EXISTS"
  | "PROJECT_NOT_FOUND"
  | "NO_OWNER_PERMISSION"
  | "MEMBER_NOT_FOUND"
  | "UNAUTHORIZED_ACCESS"

// 백엔드 ApiResponse 구조와 일치
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: ApiError | null
}

// 백엔드 Error 내부 클래스와 일치
export interface ApiError {
  code: string
  message: string
}

// 프로젝트 멤버 타입
export interface ProjectMember {
  userId: string
  name: string
  email: string
  profileImageUrl: string
  role: "READ" | "WRITE" | "OWNER"
}
