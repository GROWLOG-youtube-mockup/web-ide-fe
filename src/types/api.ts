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

// 로그인 관련 타입
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  userId: number
  name: string
  accessToken: string
}

// 회원가입 관련 타입
export interface SignUpRequest {
  email: string
  password: string
  username: string
}

export interface SignUpResponse {
  userId: number
  email: string
  name: string
  profileImageUrl?: string
  createdAt: string
  updatedAt: string
}

// 이메일 인증 관련 타입
export interface EmailSendRequest {
  email: string
}

export interface EmailVerifyRequest {
  email: string
  code: string
}

// 사용자 정보 관련 타입
export interface UserInfoResponse {
  userId: number
  name: string
  email: string
  profileImage?: string
}

// 프로젝트 관련 타입 (API 문서와 일치)
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

export interface CreateProjectRequest {
  projectName: string
  description: string
  imageId: number
}
