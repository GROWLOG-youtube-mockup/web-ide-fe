import { useProjectStore } from "@/stores/project-store"
import { ProjectItem } from "./ProjectItem"

interface HostProjectListProps {
  searchQuery: string
}

export const HostProjectList = ({ searchQuery }: HostProjectListProps) => {
  const { projects, loading, error, toggleProject } = useProjectStore()
  const ownProjects = projects.filter(project => project.myRole === "OWNER")

  // 검색 필터링
  const filteredProjects = ownProjects.filter(
    project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggle = (id: number) => {
    toggleProject(id)
  }

  const handleEdit = (_id: number) => {
    // TODO: 프로젝트 편집 모달 또는 페이지로 이동
  }

  const handleNewProject = (_id: number) => {
    // TODO: 기존 프로젝트를 기반으로 새 프로젝트 생성
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
              key={project.id}
              onEdit={handleEdit}
              onNewProject={handleNewProject}
              onToggle={handleToggle}
              project={project}
            />
          ))
        )}
      </div>
    </div>
  )
}
