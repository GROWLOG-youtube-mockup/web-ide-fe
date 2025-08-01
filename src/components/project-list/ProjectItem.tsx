import { Circle, Edit3, LogOut, Trash } from "lucide-react"
import { useState } from "react"
import { AlertDialog } from "@/components/common/AlertDialog"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"
import { ProjectAvatars } from "./ProjectAvatars"
import { ProjectDialog } from "./ProjectDialog"
import { ProjectToggle } from "./ProjectToggle"

// 프로젝트 폼 데이터 타입
type ProjectFormData = {
  name: string
  description: string
}

interface ProjectItemProps {
  project: Project
  isToggled?: boolean
  onToggle?: (id: number) => void
  onEdit?: (id: number, data: ProjectFormData) => void
  onNewProject?: (id: number) => void
  onLeave?: (id: number) => void
}

export default function ProjectItem({
  project,
  isToggled = false,
  onToggle,
  onEdit,
  onNewProject,
  onLeave,
}: ProjectItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  // 다이얼로그 상태들 - 한눈에 보기 쉽게
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const isHost = project.myRole === "OWNER"

  // 핸들러 함수들 - 직관적으로 이해하기 쉽게
  const handleToggleClick = () => setIsToggleDialogOpen(true)
  const handleToggleConfirm = () => {
    onToggle?.(project.id)
    setIsToggleDialogOpen(false)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditDialogOpen(true)
  }
  const handleEditConfirm = async (data: ProjectFormData) => {
    setEditLoading(true)
    try {
      await onEdit?.(project.id, data)
      setIsEditDialogOpen(false)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteDialogOpen(true)
  }
  const handleDeleteConfirm = () => {
    onNewProject?.(project.id)
    setIsDeleteDialogOpen(false)
  }

  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLeaveDialogOpen(true)
  }
  const handleLeaveConfirm = () => {
    onLeave?.(project.id)
    setIsLeaveDialogOpen(false)
  }

  return (
    <>
      <button
        className={cn(
          "flex w-full cursor-pointer items-center justify-between border-[#e2e2e2] border-b bg-transparent px-3 py-2 text-left transition-colors",
          isHovered && "bg-[rgba(238,238,238,0.5)]"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        type="button"
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
                <ProjectToggle checked={isToggled} onCheckedChange={handleToggleClick} />
              ) : (
                <div className="flex h-3 w-3 items-center justify-center">
                  <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                </div>
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
              <button
                className="flex h-3.5 w-3.5 items-center justify-center"
                onClick={handleEditClick}
                type="button"
              >
                <Edit3 className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* User Icons + Action Icons */}
          <div className="flex w-[106px] items-center justify-end pr-[9px]">
            {isHovered && (
              <div className="mr-2 flex items-center gap-1">
                {isHost ? (
                  <button
                    className="flex h-3.5 w-3.5 items-center justify-center"
                    onClick={handleDeleteClick}
                    type="button"
                  >
                    <Trash className="h-4 w-4 text-gray-400" />
                  </button>
                ) : (
                  <button
                    className="flex h-3.5 w-3.5 items-center justify-center"
                    onClick={handleLeaveClick}
                    type="button"
                  >
                    <LogOut className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            )}
            <ProjectAvatars maxVisible={3} members={project.members} />
          </div>
        </div>
      </button>

      {/* 다이얼로그들 - 한 곳에서 모두 관리 */}

      {/* 토글 상태 변경 다이얼로그 */}
      <AlertDialog
        cancelText="Cancel"
        confirmText="Change"
        description={`Current status: ${isToggled ? "ON" : "OFF"}`}
        isOpen={isToggleDialogOpen}
        onCancel={() => setIsToggleDialogOpen(false)}
        onConfirm={handleToggleConfirm}
        onOpenChange={setIsToggleDialogOpen}
        showCloseButton={false}
        title="Change status"
        variant="default"
      />

      {/* 프로젝트 수정 다이얼로그 */}
      <ProjectDialog
        initial={{ name: project.name, description: project.description }}
        isLoading={editLoading}
        mode="edit"
        onConfirm={handleEditConfirm}
        onOpenChange={setIsEditDialogOpen}
        open={isEditDialogOpen}
      />

      {/* 프로젝트 삭제 확인 다이얼로그 */}
      <AlertDialog
        cancelText="Cancel"
        confirmText="Delete"
        description="Are you sure you want to delete this project?"
        isOpen={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        onOpenChange={setIsDeleteDialogOpen}
        showCloseButton={false}
        title="Delete Project"
        variant="destructive"
      />

      {/* 프로젝트 나가기 확인 다이얼로그 */}
      <AlertDialog
        cancelText="Cancel"
        confirmText="Leave"
        description="Are you sure you want to leave this project?"
        isOpen={isLeaveDialogOpen}
        onCancel={() => setIsLeaveDialogOpen(false)}
        onConfirm={handleLeaveConfirm}
        onOpenChange={setIsLeaveDialogOpen}
        showCloseButton={false}
        title="Leave Project"
        variant="warning"
      />
    </>
  )
}
