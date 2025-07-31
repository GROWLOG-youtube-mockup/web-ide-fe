import { useEffect, useState } from "react"
import { AlertDialog } from "@/components/common/AlertDialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PROJECT_STYLES } from "@/constants/project-styles"
import type { Project } from "@/types/project"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "edit" | "create"
  initial?: Partial<Project>
  onConfirm: (data: { name: string; description: string }) => void
  isLoading?: boolean
}

export function ProjectDialog({
  open,
  onOpenChange,
  mode,
  initial = {},
  onConfirm,
  isLoading = false,
}: ProjectDialogProps) {
  const [name, setName] = useState(initial.name || "")
  const [description, setDescription] = useState(initial.description || "")

  // mode가 바뀌거나 open될 때 값 초기화
  useEffect(() => {
    if (open) {
      setName(initial.name || "")
      setDescription(initial.description || "")
    }
  }, [open, initial.name, initial.description])

  return (
    <AlertDialog
      cancelText="Cancel"
      confirmDisabled={!name.trim()}
      confirmText={mode === "edit" ? "Save" : "Create"}
      description={mode === "edit" ? "Edit your project details." : "Enter new project details."}
      isLoading={isLoading}
      isOpen={open}
      onCancel={() => onOpenChange(false)}
      onConfirm={() => onConfirm({ name, description })}
      onOpenChange={onOpenChange}
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
