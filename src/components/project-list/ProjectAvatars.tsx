import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ProjectMember } from "@/types/project"

interface ProjectAvatarsProps {
  members?: ProjectMember[] // optional로 변경
  maxVisible?: number // 최대 표시할 아바타 수 (기본: 3)
}

export const ProjectAvatars = ({ members, maxVisible = 3 }: ProjectAvatarsProps) => {
  // members가 undefined이거나 null인 경우 빈 배열로 처리
  const safeMembers = members || []
  const visibleMembers = safeMembers.slice(0, maxVisible)
  const remainingCount = Math.max(0, safeMembers.length - maxVisible)

  return (
    <div className="-space-x-2 flex items-center">
      {visibleMembers.map(member => (
        <Avatar className="h-8 w-8 border-2 border-white" key={member.userId}>
          <AvatarImage alt={member.name} src={member.profileImage || `/api/placeholder/32/32`} />
          <AvatarFallback className="bg-gray-200 text-[11px] text-gray-700">
            {member.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ))}

      {remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100">
          <span className="font-medium text-gray-600 text-xs">+{remainingCount}</span>
        </div>
      )}
    </div>
  )
}
