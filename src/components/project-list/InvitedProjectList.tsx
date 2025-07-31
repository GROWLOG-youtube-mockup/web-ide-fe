import { useProjectStore } from "@/stores/project-store"
import { ProjectItem } from "./ProjectItem"

interface InvitedProjectListProps {
  searchQuery: string
}

export const InvitedProjectList = ({ searchQuery }: InvitedProjectListProps) => {
  const { projects, loading, error } = useProjectStore()
  const joinedProjects = projects.filter(project => project.myRole !== "OWNER")

  // 검색 필터링
  const filteredProjects = joinedProjects.filter(
    project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLeave = (id: number) => {
    console.log("Leave project:", id)
    // TODO: 프로젝트 나가기 기능
  }

  if (loading) {
    return (
      <div className="flex w-[850px] flex-col items-center justify-start gap-2">
        <div className="min-h-5 w-full overflow-hidden">
          <h3 className="font-semibold text-black/90 text-sm leading-5">Invited</h3>
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
          <h3 className="font-semibold text-black/90 text-sm leading-5">Invited</h3>
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
        <h3 className="font-semibold text-black/90 text-sm leading-5">Invited</h3>
      </div>

      {/* Project List */}
      <div className="flex w-[845px] flex-col items-start justify-center gap-3">
        {filteredProjects.length === 0 ? (
          <div className="text-gray-500 text-sm">
            {searchQuery ? "검색 결과가 없습니다." : "참여 중인 프로젝트가 없습니다."}
          </div>
        ) : (
          filteredProjects.map(project => (
            <ProjectItem key={project.id} onLeave={handleLeave} project={project} />
          ))
        )}
      </div>
    </div>
  )
}
