import { XIcon } from "lucide-react"
import { AlertDialog } from "@/shared/components/alert-dialog.tsx"
import type { ProjectMember } from "@/shared/types/api"
import { cn } from "@/shared/utils/utils"

type RemoveMember = { isPending: boolean }
interface RemoveButtonProps {
  member: ProjectMember
  removeMember: RemoveMember
  removeDialogOpen: string | null
  setRemoveDialogOpen: (id: string | null) => void
  handleCancelRemove: () => void
  handleRemoveMember: (userId: string) => void
}

const RemoveButton = ({
  member,
  removeMember,
  removeDialogOpen,
  setRemoveDialogOpen,
  handleCancelRemove,
  handleRemoveMember,
}: RemoveButtonProps) => (
  <AlertDialog
    cancelText="Cancel"
    confirmText="Remove"
    description="Are you sure you want to remove this member? This action cannot be undone."
    isLoading={removeMember.isPending}
    isOpen={removeDialogOpen === member.userId}
    onCancel={handleCancelRemove}
    onConfirm={() => handleRemoveMember(member.userId)}
    onOpenChange={open => setRemoveDialogOpen(open ? member.userId : null)}
    title="Remove Member"
    trigger={
      <button
        aria-label={`Remove ${member.name}`}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded text-[var(--color-muted-foreground)]",
          member.role === "OWNER"
            ? "cursor-not-allowed opacity-20"
            : "hover:bg-[var(--color-muted)] hover:text-[var(--color-destructive)]"
        )}
        disabled={removeMember.isPending || member.role === "OWNER"}
        type="button"
      >
        <XIcon className="h-4 w-4" />
      </button>
    }
    variant="destructive"
  />
)

export default RemoveButton
