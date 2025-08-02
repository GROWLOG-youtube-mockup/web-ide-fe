import { useState } from "react"
import MemberRow from "@/components/sidebar/share/MemberRow"
import {
  useProjectMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks/permissions/useProjectMembers"

type WritableRole = "READ" | "WRITE"
interface MembersProps {
  projectId: string
}

export const Members = ({ projectId }: MembersProps) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState<string | null>(null)
  const { data: members = [], isLoading, error } = useProjectMembers(projectId)
  const updateRole = useUpdateMemberRole(projectId)
  const removeMember = useRemoveMember(projectId)

  const handleRoleChange = (userId: string, newRole: WritableRole) => {
    updateRole.mutate({ userId, role: newRole })
  }

  const handleRemoveMember = (userId: string) => {
    removeMember.mutate(userId, {
      onSuccess: () => setRemoveDialogOpen(null),
    })
  }

  const handleCancelRemove = () => setRemoveDialogOpen(null)

  return (
    <div className="mb-4 max-h-48 overflow-y-auto">
      <div className="space-y-2 px-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4 text-[var(--color-muted-foreground)] text-sm">
            Loading members...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-4 text-[var(--color-destructive)] text-sm">
            Failed to load members
          </div>
        ) : members.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-[var(--color-muted-foreground)] text-sm">
            No members found
          </div>
        ) : (
          members.map(member => (
            <MemberRow
              handleCancelRemove={handleCancelRemove}
              handleRemoveMember={handleRemoveMember}
              handleRoleChange={handleRoleChange}
              key={member.userId}
              member={member}
              removeDialogOpen={removeDialogOpen}
              removeMember={removeMember}
              setRemoveDialogOpen={setRemoveDialogOpen}
              updateRole={updateRole}
            />
          ))
        )}
      </div>
    </div>
  )
}
