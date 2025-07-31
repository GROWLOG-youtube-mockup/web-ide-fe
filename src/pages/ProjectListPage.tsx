import { useEffect, useState } from "react"
import { HostProjectList } from "@/components/project-list/HostProjectList"
import { InvitedProjectList } from "@/components/project-list/InvitedProjectList"
import { ProjectListHeader } from "@/components/project-list/ProjectListHeader"
import { ProjectSearch } from "@/components/project-list/ProjectSearch"
import { useProjectStore } from "@/stores/project-store"

export const ProjectListPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { fetchProjects } = useProjectStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div className="flex min-h-screen flex-col items-center bg-white py-6">
      <div className="absolute top-3 left-7">
        <h1 className="font-semibold text-[20px] text-black/60 leading-9 tracking-[-0.225px]">
          Growlog IDE
        </h1>
      </div>

      <div className="mt-16 w-[850px] space-y-8">
        <ProjectListHeader />

        <div className="space-y-8">
          <ProjectSearch onSearchChange={setSearchQuery} searchQuery={searchQuery} />

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
