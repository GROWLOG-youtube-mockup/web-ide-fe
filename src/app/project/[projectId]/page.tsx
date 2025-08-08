import { LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import logoSvg from "@/assets/logo.svg"
import logoWhiteSvg from "@/assets/logo-white.svg"
import { HostProjectList } from "@/feature/project/components/host-project-list"
import { InvitedProjectList } from "@/feature/project/components/invited-project-list"
import { ProjectListHeader } from "@/feature/project/components/project-list-header"
import { ProjectSearch } from "@/feature/project/components/project-search"

import { useProjectStore } from "@/feature/project/stores/project-store"
import { useLogout } from "@/feature/user/hooks/use-logout"
import { Button } from "@/shared/components/custom-button"

export const Page = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { fetchProjects } = useProjectStore()
  const { logout } = useLogout()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div className="flex min-h-screen flex-col items-center py-6">
      <div className="absolute top-[21px] left-[30px]">
        <div className="group flex cursor-pointer items-center gap-2">
          {/* 라이트 모드 로고 */}
          <img alt="Growlog IDE" className="h-[32px] dark:hidden" src={logoSvg} />
          {/* 다크 모드 로고 */}
          <img alt="Growlog IDE" className="hidden h-[32px] dark:block" src={logoWhiteSvg} />
          <Button
            className="rounded-full p-1"
            onClick={() => logout()}
            title="Logout"
            type="button"
            variant={"ghost"}
          >
            <LogOut className="h-4 w-4" />
          </Button>
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

export default Page
