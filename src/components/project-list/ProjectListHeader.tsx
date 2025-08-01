import { AvatarFallback } from "@radix-ui/react-avatar"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/custom-button"
import { useUserStore } from "@/stores/user-store"
import { ProjectDialog } from "./ProjectDialog"

export const ProjectListHeader = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const { userInfo } = useUserStore()

  // 사용자 정보는 로그인 시 이미 가져왔으므로 추가 호출 불필요

  const handleCreateConfirm = async (data: { name: string; description: string }) => {
    setCreateLoading(true)
    try {
      // TODO: 실제 API 호출로 대체
      console.log("새 프로젝트 생성:", data)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 임시 지연
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("프로젝트 생성 실패:", error)
      // 에러 처리 로직 추가
    } finally {
      setCreateLoading(false)
    }
  }
  return (
    <>
      <div className="mt-12 flex items-end justify-between px-0 py-2">
        {/* Profile Section */}
        <div className="flex items-end gap-4">
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
            <h2 className="font-semibold text-2xl text-black leading-8 tracking-[-0.144px]">
              {userInfo?.name || "사용자"}
            </h2>
          </div>
        </div>

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
      <ProjectDialog
        isLoading={createLoading}
        mode="create"
        onConfirm={handleCreateConfirm}
        onOpenChange={setIsCreateDialogOpen}
        open={isCreateDialogOpen}
      />
    </>
  )
}
