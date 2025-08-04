import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProjectStore } from "@/backup/stores/project-store"
import type { Project } from "@/backup/types/project"
import { projectApi } from "@/shared/api/project/project-api"
import { useToast } from "@/shared/common/ToastContext"

// 프로젝트 폼 데이터 타입
type ProjectFormData = {
  name: string
  description: string
}

interface UseProjectActionsProps {
  project: Project
  onToggle?: (id: number) => void
  onLeave?: (id: number) => void
}

export function useProjectActions({ project, onToggle, onLeave }: UseProjectActionsProps) {
  const navigate = useNavigate()
  const { refreshProjects } = useProjectStore()
  const { addToast } = useToast()

  // 다이얼로그 상태들
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 핸들러 함수들
  const handleProjectClick = () => {
    navigate(`/projects/${project.id}/ide`)
  }

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
      await projectApi.updateProject(project.id, {
        projectName: data.name,
        description: data.description,
      })
      setIsEditDialogOpen(false)
      await refreshProjects()
      addToast({
        type: "success",
        title: "project updated successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("프로젝트 수정 실패:", error)
      addToast({
        type: "error",
        title: "project update failed.",
        duration: 3000,
      })
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    try {
      await projectApi.deleteProject(project.id)
      setIsDeleteDialogOpen(false)
      await refreshProjects()
      addToast({
        type: "success",
        title: "project deleted successfully.",
        duration: 3000,
      })
    } catch (_error) {
      addToast({
        type: "error",
        title: "project deletion failed.",
        duration: 3000,
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLeaveDialogOpen(true)
  }

  const handleLeaveConfirm = () => {
    onLeave?.(project.id)
    setIsLeaveDialogOpen(false)
  }

  return {
    // 상태들
    dialogStates: {
      isToggleDialogOpen,
      setIsToggleDialogOpen,
      isEditDialogOpen,
      setIsEditDialogOpen,
      isDeleteDialogOpen,
      setIsDeleteDialogOpen,
      isLeaveDialogOpen,
      setIsLeaveDialogOpen,
    },
    loadingStates: {
      editLoading,
      deleteLoading,
    },
    // 핸들러들
    handlers: {
      handleProjectClick,
      handleToggleClick,
      handleToggleConfirm,
      handleEditClick,
      handleEditConfirm,
      handleDeleteClick,
      handleDeleteConfirm,
      handleLeaveClick,
      handleLeaveConfirm,
    },
  }
}
