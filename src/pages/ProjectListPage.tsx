import { LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { HostProjectList } from "@/components/project-list/HostProjectList"
import { InvitedProjectList } from "@/components/project-list/InvitedProjectList"
import { ProjectListHeader } from "@/components/project-list/ProjectListHeader"
import { ProjectSearch } from "@/components/project-list/ProjectSearch"
import { useLogout } from "@/hooks/auth/useLogout"
import { useProjectStore } from "@/stores/project-store"
import { useUserStore } from "@/stores/user-store"

export const ProjectListPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { fetchProjects } = useProjectStore()
  const { userInfo, fetchUserInfo } = useUserStore()
  const { logout } = useLogout()

  useEffect(() => {
    fetchProjects()
    // 사용자 정보가 없거나 프로필 이미지가 없으면 가져오기
    if (!userInfo || !userInfo.profileImage) {
      fetchUserInfo()
    }
  }, [fetchProjects, fetchUserInfo, userInfo])

  return (
    <div className="flex min-h-screen flex-col items-center bg-white py-6">
      <div className="absolute top-3 left-7">
        <div className="group flex cursor-pointer items-center gap-2">
          <h1 className="font-semibold text-[20px] text-black/60 leading-9 tracking-[-0.225px]">
            Growlog IDE
          </h1>
          <button
            className="rounded p-1 opacity-0 transition-opacity duration-200 hover:bg-gray-100 group-hover:opacity-100"
            onClick={() => logout()}
            title="로그아웃"
            type="button"
          >
            <LogOut className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
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
