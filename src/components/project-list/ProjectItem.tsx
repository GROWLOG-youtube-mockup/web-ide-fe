import { Edit3, LogOut, Trash } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/custom-button"
import { useProjectActions } from "@/hooks/project/useProjectActions"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"
import { ProjectActionDialogs } from "./ProjectActionDialogs"
import { ProjectAvatars } from "./ProjectAvatars"
import { ProjectToggle } from "./ProjectToggle"

interface ProjectItemProps {
  project: Project
  isToggled?: boolean
  onToggle?: (id: number) => void
  onLeave?: (id: number) => void
}

export default function ProjectItem({
  project,
  isToggled = false,
  onToggle,
  onLeave,
}: ProjectItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isHost = project.myRole === "OWNER"

  // 커스텀 훅에서 모든 액션 관련 로직을 가져옴
  const { dialogStates, loadingStates, handlers } = useProjectActions({
    project,
    onToggle,
    onLeave,
  })

  return (
    <>
      <Button
        className={cn(
          "flex h-full w-full cursor-pointer items-center justify-between border-[#e2e2e2] border-b bg-transparent px-3 py-2 text-left transition-colors"
        )}
        onClick={handlers.handleProjectClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        type="button"
        variant={"ghost"}
      >
        {/* Left Section - Project Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-[11px]">
            <div className="flex items-center gap-2.5">
              <div className="w-[104px]">
                <p className="truncate font-semibold text-black/70 text-sm leading-5">
                  {project.name}
                </p>
              </div>

              {/* Toggle/Status Icon */}
              {isHost && onToggle ? (
                <ProjectToggle checked={isToggled} onCheckedChange={handlers.handleToggleClick} />
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Description and Actions */}
        <div className="flex w-[630px] items-center justify-between">
          {/* Description and Action Icons */}
          <div className="flex w-[400px] items-center gap-2">
            <p className="truncate whitespace-nowrap font-medium text-[rgba(72,72,72,0.8)] text-xs leading-5">
              {project.description}
            </p>
            {isHovered && isHost && (
              <Button
                className="flex h-3.5 w-3.5 items-center justify-center"
                onClick={handlers.handleEditClick}
                type="button"
                variant={"secondary"}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* User Icons + Action Icons */}
          <div className="flex w-[106px] items-center justify-end pr-[9px]">
            {isHovered && (
              <div className="mr-2 flex items-center gap-1">
                {isHost ? (
                  <Button
                    className="flex h-3.5 w-3.5 items-center justify-center"
                    onClick={handlers.handleDeleteClick}
                    type="button"
                    variant={"secondary"}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="flex h-3.5 w-3.5 items-center justify-center"
                    onClick={handlers.handleLeaveClick}
                    type="button"
                    variant={"ghost"}
                  >
                    <LogOut className="h-4 w-4 " />
                  </Button>
                )}
              </div>
            )}
            <ProjectAvatars maxVisible={3} members={project.members} />
          </div>
        </div>
      </Button>

      {/* 다이얼로그들 - 별도 컴포넌트로 분리 */}
      <ProjectActionDialogs
        dialogStates={dialogStates}
        handlers={handlers}
        isToggled={isToggled}
        loadingStates={loadingStates}
        project={project}
      />
    </>
  )
}
