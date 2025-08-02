import { useNavigate, useParams } from "react-router-dom"
import { FigmaIcons, LucideIcons } from "@/assets/icons"
import LogoSvg from "@/assets/logo.svg"
import { ProjectAvatars } from "@/components/project-list/ProjectAvatars"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/custom-button"
import { useProjectMembers } from "@/hooks/permissions/useProjectMembers"
import { useUserStore } from "@/stores/user-store"

export const TopBar = () => {
  const LogOutIcon = LucideIcons.logOut
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const { userInfo } = useUserStore()

  // React Query를 사용한 프로젝트 멤버 데이터
  const { data: projectMembers = [], isLoading: membersLoading } = useProjectMembers(
    projectId || ""
  )

  const handleAvatarClick = () => {
    navigate("/profile/edit")
  }

  // 사용자 이름의 첫 글자들로 fallback 생성 (한글/영문 모두 지원)
  const getInitials = (name: string) => {
    if (!name) return "ME"

    // 한글인 경우 첫 글자만, 영문인 경우 각 단어의 첫 글자
    if (/[가-힣]/.test(name)) {
      return name.charAt(0)
    }
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className="flex h-[50px] items-center bg-[var(--background)]"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex w-full items-center justify-between px-3 py-1">
        {/* Logo and Menu */}
        <div className="flex items-center gap-3 px-1">
          <img alt="Growlog IDE" className="h-7" src={LogoSvg} />
        </div>

        {/* User and Settings */}
        <div className="flex items-center gap-6">
          {/* Project Members */}
          <div className="flex items-center gap-3">
            {!membersLoading && projectMembers.length > 0 && (
              <ProjectAvatars
                maxVisible={3}
                members={projectMembers.map(member => ({
                  userId: Number(member.userId),
                  name: member.name,
                  role: member.role,
                  profileImage: member.profileImageUrl || FigmaIcons.avatar,
                }))}
                size="md"
              />
            )}
            <Avatar
              className="ml-3 h-7 w-7 cursor-pointer transition-opacity hover:opacity-80"
              onClick={handleAvatarClick}
            >
              <AvatarImage
                alt={userInfo?.name ? `${userInfo.name} 아바타` : "현재 사용자 아바타"}
                src={userInfo?.profileImage || FigmaIcons.avatar}
              />
              <AvatarFallback
                className="bg-zinc-200 font-medium text-zinc-700"
                style={{ fontSize: "11px" }}
              >
                {getInitials(userInfo?.name || "")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Exit Button */}
          <Button
            className="flex items-center gap-1 bg-zinc-50 px-3 text-zinc-900 hover:bg-zinc-200"
            size="sm"
            style={{
              fontSize: "12px",
              border: "1px solid var(--sidebar-ring)",
            }}
            variant="outline"
          >
            <LogOutIcon className="!h-3 shrink-0" />
            프로젝트 나가기
          </Button>
        </div>
      </div>
    </div>
  )
}
