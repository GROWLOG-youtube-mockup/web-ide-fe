import { useEffect, useState } from "react"
import { AlertDialog } from "@/shared/components/alert-dialog.tsx"
import { PROJECT_STYLES } from "@/shared/constants/project-styles"
import type { Project } from "@/shared/types/project"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "edit" | "create"
  initial?: Partial<Project>
  onConfirm: (data: { name: string; description: string }) => void
  isLoading?: boolean
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  mode,
  initial = {},
  onConfirm,
  isLoading = false,
}: ProjectFormDialogProps) {
  const [name, setName] = useState(initial.name || "")
  const [description, setDescription] = useState(initial.description || "")

  // mode가 바뀌거나 open될 때 값 초기화
  useEffect(() => {
    if (open) {
      setName(initial.name || "")
      setDescription(initial.description || "")
    }
  }, [open, initial.name, initial.description])

  // 로딩 중에는 다이얼로그 닫기 방지
  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      onOpenChange(open)
    }
  }

  // 로딩 중에는 취소 버튼 클릭 방지
  const handleCancel = () => {
    if (!isLoading) {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog
      cancelText="Cancel"
      confirmDisabled={!name.trim()}
      confirmText={mode === "edit" ? "Save" : "Create"}
      description={mode === "edit" ? "Edit your hooks details." : "Enter new hooks details."}
      isLoading={isLoading}
      isOpen={open}
      onCancel={handleCancel}
      onConfirm={() => onConfirm({ name, description })}
      onOpenChange={handleOpenChange}
      showCloseButton={false}
      title={mode === "edit" ? "Edit Project" : "Create Project"}
      variant="default"
    >
      <form className={PROJECT_STYLES.form}>
        <div>
          <label className={PROJECT_STYLES.label} htmlFor="project-name">
            Project Name
          </label>
          <Input
            className={`${PROJECT_STYLES.field} h-[35px]`}
            disabled={isLoading}
            id="project-name"
            maxLength={32}
            onChange={e => setName(e.target.value)}
            placeholder="Enter project name"
            required
            value={name}
          />
        </div>
        <div>
          <label className={PROJECT_STYLES.label} htmlFor="project-description">
            Description
          </label>
          <Textarea
            className={`${PROJECT_STYLES.field} field-sizing-fixed h-[80px] resize-none`}
            disabled={isLoading}
            id="project-description"
            maxLength={150}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            value={description}
          />
        </div>
      </form>
    </AlertDialog>
  )
}
