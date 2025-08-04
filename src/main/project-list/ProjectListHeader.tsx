import { AvatarFallback } from "@radix-ui/react-avatar"
import { Edit3, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProjectStore } from "@/backup/stores/project-store"
import { useUserStore } from "@/backup/stores/user-store"
import { ProjectFormDialog } from "@/main/project-list/ProjectFormDialog"
import { projectApi } from "@/shared/api/project/project-api"
import { useToast } from "@/shared/common/ToastContext"
import { Button } from "@/shared/custom-button"
import { Avatar, AvatarImage } from "@/shared/ui/avatar"

export const ProjectListHeader = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const { userInfo } = useUserStore()
  const { refreshProjects } = useProjectStore()
  const { addToast } = useToast()
  const navigate = useNavigate()

  // 사용자 정보는 로그인 시 이미 가져왔으므로 추가 호출 불필요

  const handleProfileClick = () => {
    navigate("/profile/edit")
  }

  const handleCreateConfirm = async (data: { name: string; description: string }) => {
    setCreateLoading(true)
    try {
      await projectApi.createProject({
        projectName: data.name,
        description: data.description,
        imageId: 1,
      })
      setIsCreateDialogOpen(false)
      // 프로젝트 목록 새로고침
      await refreshProjects()
      // 성공 토스트 메시지
      addToast({
        type: "success",
        title: "successfully created project.",
        duration: 3000,
      })
    } catch (error) {
      console.error("프로젝트 생성 실패:", error)
      // 실패 토스트 메시지
      addToast({
        type: "error",
        title: "failed to create project. Please try again.",
        duration: 3000,
      })
    } finally {
      setCreateLoading(false)
    }
  }
  return (
    <>
      <div className="mt-12 flex items-end justify-between px-0 py-2">
        {/* Profile Section */}
        <button
          aria-label="Profile edit"
          className="m-0 flex cursor-pointer items-end gap-4 border-none bg-transparent p-0"
          onClick={handleProfileClick}
          type="button"
        >
          <div className="flex items-end justify-center">
            <Avatar className="h-[72px] w-[72px] rounded-full border-2 border-white">
              <AvatarImage
                alt="Profile"
                src={userInfo?.profileImage || "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="h-[72px] w-[72px] bg-gray-200 text-gray-600 text-xl">
                {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mb-3 flex items-center gap-2.5">
            <div className="group flex items-end gap-1.5">
              <h2 className="font-semibold text-2xl text-black leading-8 tracking-[-0.144px]">
                {userInfo?.name || "사용자"}
              </h2>
              <Edit3
                className="mb-1 h-4 w-4 cursor-pointer text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </button>

        {/* New Project Button */}
        <div className="w-[140px]">
          <Button
            className="group h-11 w-[135px] gap-2 rounded-[50px] border-[#aeaeae] bg-white px-4 py-3 transition-colors duration-150 hover:border-[#767676] hover:bg-[#f5f5f5] hover:text-black"
            onClick={() => setIsCreateDialogOpen(true)}
            variant="outline"
          >
            <span className="font-semibold text-black/80 text-sm group-hover:text-black">
              New Project
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c1c1c1] bg-white p-3 transition-colors duration-150 group-hover:border-[#767676] group-hover:bg-[#ededed]">
              <Plus className="h-4 w-4 text-[#767676] group-hover:text-black" strokeWidth={1.5} />
            </div>
          </Button>
        </div>
      </div>

      {/* 프로젝트 생성 다이얼로그 */}
      <ProjectFormDialog
        isLoading={createLoading}
        mode="create"
        onConfirm={handleCreateConfirm}
        onOpenChange={setIsCreateDialogOpen}
        open={isCreateDialogOpen}
      />
    </>
  )
}
