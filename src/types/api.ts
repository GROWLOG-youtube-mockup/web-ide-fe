// src/types/api.ts

// 멤버 관리 관련 핵심 에러 코드
export type ErrorCode =
  | "USER_NOT_FOUND"
  | "MEMBER_ALREADY_EXISTS"
  | "PROJECT_NOT_FOUND"
  | "NO_OWNER_PERMISSION"
  | "MEMBER_NOT_FOUND"
  | "UNAUTHORIZED_ACCESS"
  | "NO_WRITE_PERMISSION"
  | "NOT_A_MEMBER"
  | "BAD_REQUEST"
  | "INVALID_ACCESSTOKEN"
  | "ACTIVE_CONTAINER_NOT_FOUND"
  | "FILE_OPERATION_FAILED"
  | "FILE_NOT_FOUND"

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

// 프로필 이미지 업로드 응답 타입
export interface ProfileImageResponse {
  profileImageUrl: string
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

// ========== 파일 시스템 관련 타입들 ==========

// 파일 트리 관련 타입들 (WebSocket 응답용)
export interface TreeNodeDto {
  id: number | null // FileMeta.id (Long 또는 null)
  path: string // FileMeta.path (상대경로)
  type: "file" | "folder" // FileMeta.type
  children?: TreeNodeDto[] | null
}

export interface FileNode {
  path: string // 절대경로로 변환된 경로
  type: "file" | "folder"
  children?: FileNode[]
}

export interface TreeInitPayload {
  type: "tree:init"
  payload: FileNode[]
}

export interface WebSocketMessage {
  type: "tree:init" | "tree:add" | "tree:remove" | "tree:move"
  payload: unknown
}

// WebSocket 실시간 이벤트 타입들 (백엔드와 정확히 일치)
export interface TreeAddEventDto {
  id: number // Long id
  path: string // String path
  type: string // String type ("file" | "folder")
}

export interface TreeRemoveEventDto {
  id: number // Long id
  path: string // String path
}

export interface TreeMoveEventDto {
  id: number // Long id
  fromPath: string // String fromPath
  toPath: string // String toPath
}

// REST API 요청/응답 타입들 (백엔드와 정확히 일치)

// 파일 생성 요청 (백엔드 CreateFileRequest와 일치)
export interface CreateFileRequest {
  path: string // String path
  type: "file" | "folder" // String type
}

// 파일 저장 요청 (백엔드 FileSaveRequestDto와 일치)
export interface FileSaveRequest {
  path: string // String path
  content: string // String content
}

// 파일 이동 요청 (백엔드 MoveFileRequest와 일치)
export interface MoveFileRequest {
  fromPath: string // String fromPath
  toPath: string // String toPath
}

// 파일 응답 (백엔드 FileResponse와 일치)
export interface FileResponse {
  message: string // String message
}

// 파일 열기 응답 (백엔드 FileOpenResponseDto와 일치)
export interface FileOpenResponse {
  projectId: number // Long projectId
  filePath: string // String filePath
  fileName: string // String fileName
  content: string // String content
  language: string // String language (확장자 기반)
  editable: boolean // boolean editable
}

// 파일 검색 응답 (백엔드 FileSearchResponseDto와 일치)
export interface FileSearchResponse {
  id: number // Long id (FileMeta.id)
  name: string // String name (FileMeta.name)
  type: string // String type (FileMeta.type)
  path: string // String path (FileMeta.path)
}

// 파일 메타데이터 (백엔드 FileMeta 엔티티와 정확히 일치)
export interface FileMeta {
  id: number // Long id
  projectId: number // Project.id (through @ManyToOne)
  name: string // String name
  path: string // String path
  type: "file" | "folder" // String type
  deleted: boolean // boolean deleted
}

// STOMP 클라이언트 관련 타입들
export interface StompMessage {
  body: string
  headers: Record<string, string>
  ack: () => void
  nack: () => void
}

export interface StompSubscription {
  unsubscribe: () => void
}

export interface StompClient {
  connected: boolean
  subscribe: (destination: string, callback: (message: StompMessage) => void) => StompSubscription
  send: (destination: string, headers?: Record<string, unknown>) => void
  connect: (
    headers: Record<string, string>,
    onConnect: () => void,
    onError?: (error: unknown) => void
  ) => void
  disconnect: () => void
}
