import { useParticipantsStore } from "@/feature/editor/stores/participants-store"
import type { ProjectMember } from "@/shared/types/project"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

// 참여자와 프로젝트 멤버를 모두 처리할 수 있는 타입
type DisplayMember =
  | ProjectMember
  | {
      userId: number
      name: string
      profileImageUrl?: string
      isOnline?: boolean
    }

interface ProjectAvatarsProps {
  members?: ProjectMember[]
  projectId?: string
  maxVisible?: number
  size?: "sm" | "md" | "lg"
}

export const ProjectAvatars = ({
  members,
  projectId,
  maxVisible = 3,
  size = "md",
}: ProjectAvatarsProps) => {
  const { getOnlineParticipants } = useParticipantsStore()

  // 프로젝트 ID가 있으면 온라인 참여자만 사용
  const onlineParticipants = projectId ? getOnlineParticipants(projectId) : []

  // members prop이 있으면 그것을 우선 사용 (이미 필터링된 상태)
  const displayMembers: DisplayMember[] =
    members && members.length > 0 ? members : projectId ? onlineParticipants : []

  const visibleMembers = displayMembers.slice(0, maxVisible)
  const remainingCount = Math.max(0, displayMembers.length - maxVisible)

  // 크기에 따른 스타일 클래스
  const sizeClasses = {
    sm: { avatar: "h-7 w-7", text: "text-[9px]", counter: "h-7 w-7 text-[9px]" },
    md: { avatar: "h-8 w-8", text: "text-[11px]", counter: "h-8 w-8 text-xs" },
    lg: { avatar: "h-10 w-10", text: "text-sm", counter: "h-10 w-10 text-sm" },
  }

  const currentSize = sizeClasses[size]

  return (
    <div className="-space-x-2 flex items-center">
      {visibleMembers.map(member => (
        <div className="group relative" key={member.userId}>
          <Avatar
            className={`${currentSize.avatar} cursor-pointer border-2 border-white transition-transform hover:scale-110`}
          >
            <AvatarImage
              alt={member.name}
              src={
                "profileImage" in member
                  ? member.profileImage || `/api/placeholder/32/32`
                  : (member as { profileImageUrl?: string }).profileImageUrl ||
                    `/api/placeholder/32/32`
              }
            />
            <AvatarFallback className={`bg-gray-200 ${currentSize.text} text-gray-700`}>
              {member.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          {/* 호버 툴팁 */}
          <div className="-translate-x-1/2 pointer-events-none absolute top-full left-1/2 z-50 mt-2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            <div className="font-medium">{member.name}</div>
            {projectId && (
              <div className="mt-1 text-gray-300 text-xs">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  온라인
                </span>
              </div>
            )}
            {/* 툴팁 화살표 */}
            <div className="-translate-x-1/2 absolute bottom-full left-1/2 h-0 w-0 transform border-r-[4px] border-r-transparent border-b-[4px] border-b-gray-900 border-l-[4px] border-l-transparent"></div>
          </div>
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={`flex ${currentSize.counter} group relative cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gray-100`}
        >
          <span className="font-medium text-gray-600">+{remainingCount}</span>

          {/* 나머지 멤버들 툴팁 */}
          <div className="-translate-x-1/2 pointer-events-none absolute top-full left-1/2 z-50 mt-2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            <div className="font-medium">나머지 {remainingCount}명</div>
            <div className="mt-1 max-w-48 text-gray-300 text-xs">
              {displayMembers.slice(maxVisible).map(member => (
                <div className="truncate" key={member.userId}>
                  {member.name}
                  <span className="ml-1 text-green-400">●</span>
                </div>
              ))}
            </div>
            {/* 툴팁 화살표 */}
            <div className="-translate-x-1/2 absolute bottom-full left-1/2 h-0 w-0 transform border-r-[4px] border-r-transparent border-b-[4px] border-b-gray-900 border-l-[4px] border-l-transparent"></div>
          </div>
        </div>
      )}
    </div>
  )
}
