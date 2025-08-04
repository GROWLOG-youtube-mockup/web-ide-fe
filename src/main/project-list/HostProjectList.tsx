import { useState } from "react"
import { useProjectStore } from "@/backup/stores/project-store"
import ProjectItem from "@/main/project-list/ProjectItem"
import { updateProjectStatus } from "@/shared/api/project/project-api"
import { useToast } from "@/shared/common/ToastContext"

interface HostProjectListProps {
  searchQuery: string
}

export const HostProjectList = ({ searchQuery }: HostProjectListProps) => {
  const { projects, loading, error, refreshProjects } = useProjectStore()
  const [toggledProjects, setToggledProjects] = useState<Record<number, boolean>>({})
  const { addToast } = useToast()

  const ownProjects = projects.filter(project => project.myRole === "OWNER")

  // 검색 필터링
  const filteredProjects = ownProjects.filter(
    project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggle = async (id: number) => {
    const project = projects.find(p => p.id === id)
    if (!project) return

    // 현재 토글 상태를 확인 (UI 상태 우선, 없으면 서버 상태)
    const currentToggleState =
      toggledProjects[id] !== undefined ? toggledProjects[id] : project.status === "ACTIVE"

    const newStatus = currentToggleState ? "INACTIVE" : "ACTIVE"

    try {
      // 서버에 상태 업데이트 요청
      await updateProjectStatus(id, newStatus)

      // 로컬 UI 상태 업데이트
      setToggledProjects(prev => ({
        ...prev,
        [id]: !currentToggleState,
      }))

      // 성공 토스트
      addToast({
        type: "success",
        title: `Project ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`,
        duration: 2000,
      })

      // 프로젝트 목록 새로고침 (서버 상태와 동기화)
      await refreshProjects()
      // 서버 상태 반영을 위해 토글 UI 상태 초기화
      setToggledProjects({})
    } catch (error) {
      console.error("프로젝트 상태 변경 실패:", error)
      addToast({
        type: "error",
        title: "Failed to update project status",
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex w-[850px] flex-col items-center justify-start gap-2">
        <div className="min-h-5 w-full overflow-hidden">
          <h3 className="font-semibold text-black/90 text-sm leading-5">Host</h3>
        </div>
        <div className="flex w-[845px] flex-col items-start justify-center gap-3">
          <div className="text-gray-500 text-sm">프로젝트를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex w-[850px] flex-col items-center justify-start gap-2">
        <div className="min-h-5 w-full overflow-hidden">
          <h3 className="font-semibold text-black/90 text-sm leading-5">Host</h3>
        </div>
        <div className="flex w-[845px] flex-col items-start justify-center gap-3">
          <div className="text-red-500 text-sm">오류: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[850px] flex-col items-center justify-start gap-2">
      {/* Header */}
      <div className="min-h-5 w-full overflow-hidden">
        <h3 className="font-semibold text-black/90 text-sm leading-5">Host</h3>
      </div>

      {/* Project List */}
      <div className="flex w-[845px] flex-col items-start justify-center gap-3">
        {filteredProjects.length === 0 ? (
          <div className="text-gray-500 text-sm">
            {searchQuery ? "검색 결과가 없습니다." : "생성한 프로젝트가 없습니다."}
          </div>
        ) : (
          filteredProjects.map(project => (
            <ProjectItem
              isToggled={
                toggledProjects[project.id] !== undefined
                  ? toggledProjects[project.id]
                  : project.status === "ACTIVE"
              }
              key={project.id}
              onToggle={handleToggle}
              project={project}
            />
          ))
        )}
      </div>
    </div>
  )
}
