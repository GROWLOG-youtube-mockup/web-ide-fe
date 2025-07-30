import { useEffect, useState } from "react"
import { HostProjectList } from "@/components/project-list/HostProjectList"
import { InvitedProjectList } from "@/components/project-list/InvitedProjectList"
import { ProjectListHeader } from "@/components/project-list/ProjectListHeader"
import { ProjectSearch } from "@/components/project-list/ProjectSearch"
import { useProjectStore } from "@/stores/project-store"

export const ProjectListPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { fetchProjects, projects, ownProjects, joinedProjects, loading, error } = useProjectStore()

  // 페이지 로드 시 모든 프로젝트 데이터를 한 번에 가져오기
  useEffect(() => {
    console.log("🔄 ProjectListPage: fetchProjects 호출")
    fetchProjects() // 필터 없이 전체 데이터 로드
  }, [fetchProjects])

  // 디버깅: 스토어 상태 확인
  useEffect(() => {
    console.log("📊 ProjectListPage 상태:")
    console.log("- loading:", loading)
    console.log("- error:", error)
    console.log("- projects:", projects)
    console.log(
      "- projects 상세:",
      projects.map(p => ({ id: p.id, name: p.name, myRole: p.myRole }))
    )
    console.log("- ownProjects:", ownProjects)
    console.log("- joinedProjects:", joinedProjects)
  }, [loading, error, projects, ownProjects, joinedProjects])

  return (
    <div className="flex min-h-screen flex-col items-center bg-white py-6">
      {/* Page Title */}
      <div className="absolute top-3 left-7">
        <h1 className="font-semibold text-[20px] text-black/60 leading-9 tracking-[-0.225px]">
          Growlog IDE
        </h1>
      </div>

      {/* Main Container */}
      <div className="mt-16 w-[850px] space-y-8">
        {/* Header with Profile and New Project Button */}
        <ProjectListHeader />

        {/* Project List Section */}
        <div className="space-y-8 ">
          {/* Search Bar */}
          <ProjectSearch onSearchChange={setSearchQuery} searchQuery={searchQuery} />

          {/* Project Lists */}
          <div className="space-y-12">
            <HostProjectList searchQuery={searchQuery} />
            <InvitedProjectList searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectListPage
