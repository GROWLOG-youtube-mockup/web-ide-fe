import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ProjectMember } from "@/types/project"

interface ProjectAvatarsProps {
  members?: ProjectMember[] // optional로 변경
  maxVisible?: number // 최대 표시할 아바타 수 (기본: 3)
  size?: "sm" | "md" | "lg" // 아바타 크기 옵션
}

export const ProjectAvatars = ({ members, maxVisible = 3, size = "md" }: ProjectAvatarsProps) => {
  // members가 undefined이거나 null인 경우 빈 배열로 처리
  const safeMembers = members || []
  const visibleMembers = safeMembers.slice(0, maxVisible)
  const remainingCount = Math.max(0, safeMembers.length - maxVisible)

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
        <Avatar className={`${currentSize.avatar} border-2 border-white`} key={member.userId}>
          <AvatarImage alt={member.name} src={member.profileImage || `/api/placeholder/32/32`} />
          <AvatarFallback className={`bg-gray-200 ${currentSize.text} text-gray-700`}>
            {member.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ))}

      {remainingCount > 0 && (
        <div
          className={`flex ${currentSize.counter} items-center justify-center rounded-full border-2 border-white bg-gray-100`}
        >
          <span className="font-medium text-gray-600">+{remainingCount}</span>
        </div>
      )}
    </div>
  )
}
