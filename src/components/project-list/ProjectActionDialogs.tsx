import { AlertDialog } from "@/components/common/AlertDialog"
import type { Project } from "@/types/project"
import { ProjectFormDialog } from "./ProjectFormDialog"

// 프로젝트 폼 데이터 타입
type ProjectFormData = {
  name: string
  description: string
}

interface ProjectActionDialogsProps {
  project: Project
  isToggled: boolean
  dialogStates: {
    isToggleDialogOpen: boolean
    setIsToggleDialogOpen: (open: boolean) => void
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    isDeleteDialogOpen: boolean
    setIsDeleteDialogOpen: (open: boolean) => void
    isLeaveDialogOpen: boolean
    setIsLeaveDialogOpen: (open: boolean) => void
  }
  loadingStates: {
    editLoading: boolean
    deleteLoading: boolean
  }
  handlers: {
    handleToggleConfirm: () => void
    handleEditConfirm: (data: ProjectFormData) => Promise<void>
    handleDeleteConfirm: () => Promise<void>
    handleLeaveConfirm: () => void
  }
}

export function ProjectActionDialogs({
  project,
  isToggled,
  dialogStates,
  loadingStates,
  handlers,
}: ProjectActionDialogsProps) {
  const {
    isToggleDialogOpen,
    setIsToggleDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isLeaveDialogOpen,
    setIsLeaveDialogOpen,
  } = dialogStates

  const { editLoading, deleteLoading } = loadingStates

  const { handleToggleConfirm, handleEditConfirm, handleDeleteConfirm, handleLeaveConfirm } =
    handlers

  return (
    <>
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
      <ProjectFormDialog
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
        isLoading={deleteLoading}
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
