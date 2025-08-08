import { LogOutIcon } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import LogoSvg from "@/assets/logo.svg"
import { useParticipantTracking } from "@/feature/editor/hooks/use-participant-tracking"
import { useParticipantsStore } from "@/feature/editor/stores/participants-store"
import { useFileTree } from "@/feature/file-explorer/hooks/use-file-tree"
import { useProjectMembers } from "@/feature/members/stores/use-project-members"
import { ProjectAvatars } from "@/feature/project/components/project-avatars"
import { useUserStore } from "@/feature/user/stores/user-store"
import { Button } from "@/shared/components/custom-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

export const TopBar = () => {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const { userInfo } = useUserStore()
  const { getOnlineParticipants } = useParticipantsStore()

  // WebSocket 연결을 위한 파일 트리 훅
  const fileTreeData = useFileTree()

  // React Query를 사용한 프로젝트 멤버 데이터
  const { data: projectMembers = [], isLoading: membersLoading } = useProjectMembers(
    projectId || ""
  )

  // 실시간 참여자 추적 훅
  useParticipantTracking(projectId || "", fileTreeData.stompClient)

  // 온라인 참여자 수 확인 (나 포함 2명 이상일 때만 표시)
  const onlineParticipants = projectId ? getOnlineParticipants(projectId) : []
  const shouldShowAvatars = onlineParticipants.length >= 2

  const handleAvatarClick = () => {
    navigate("/profile/edit")
  }

  const handleExitProject = () => {
    navigate("/projects")
  }

  // 사용자 이름의 첫 글자들로 fallback 생성 (한글/영문 모두 두 글자)
  const getInitials = (name: string) => {
    if (!name) return "ME"

    // 한글, 영문 모두 처음 두 글자
    return name.substring(0, 2).toUpperCase()
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
            {!membersLoading && projectMembers.length > 0 && shouldShowAvatars && (
              <ProjectAvatars
                maxVisible={3}
                members={projectMembers
                  .filter(member => Number(member.userId) !== userInfo?.userId) // 나를 제외
                  .filter(member =>
                    onlineParticipants.some(
                      participant => participant.userId === Number(member.userId)
                    )
                  ) // 온라인 상태인 멤버만
                  .map(member => ({
                    userId: Number(member.userId),
                    name: member.name,
                    role: member.role,
                    profileImage: member.profileImageUrl,
                  }))}
                projectId={projectId}
                size="md"
              />
            )}
            <Avatar
              className="ml-3 h-8 w-8 cursor-pointer border-2 border-white transition-opacity hover:opacity-80"
              onClick={handleAvatarClick}
            >
              <AvatarImage
                alt={userInfo?.name ? `${userInfo.name} 아바타` : "현재 사용자 아바타"}
                src={userInfo?.profileImage}
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
            onClick={handleExitProject}
            size="sm"
            style={{
              fontSize: "12px",
              border: "1px solid var(--sidebar-ring)",
            }}
            variant="outline"
          >
            <LogOutIcon className="!h-3 shrink-0" />
            Back to Projects
          </Button>
        </div>
      </div>
    </div>
  )
}
