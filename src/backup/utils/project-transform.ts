import type { ProjectResponse } from "@/backup/types/api"
import type { Project } from "@/backup/types/project"

/**
 * API 응답 데이터를 클라이언트 Project 타입으로 변환
 */
export function transformProjectResponse(apiProject: ProjectResponse): Project {
  return {
    id: apiProject.projectId,
    name: apiProject.projectName,
    description: apiProject.description,
    ownerName: apiProject.ownerName,
    members: apiProject.memberNames.map((name, index) => ({
      userId: index + 1, // TODO: 실제 사용자 ID가 필요함
      name,
      role: "WRITE" as const, // TODO: 실제 역할 정보가 필요함
    })),
    myRole: apiProject.myRole as "OWNER" | "WRITE" | "READ",
    status: apiProject.status as "ACTIVE" | "INACTIVE",
    createdAt: new Date(apiProject.createdAt),
    updatedAt: new Date(apiProject.updatedAt),
    isToggled: false, // 기본값
  }
}
