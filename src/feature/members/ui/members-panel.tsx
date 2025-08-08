import { useState } from "react"
import {
  useProjectMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/entities/project/model/use-project-members.ts"
import { useUserStore } from "@/entities/user/model/user-store.ts"
import MemberRow from "@/feature/members/ui/member-row"

type WritableRole = "READ" | "WRITE"
interface MembersProps {
  projectId: string
}

export const Members = ({ projectId }: MembersProps) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState<string | null>(null)
  const { data: members = [], isLoading, error } = useProjectMembers(projectId)
  const updateRole = useUpdateMemberRole(projectId)
  const removeMember = useRemoveMember(projectId)
  const { userInfo } = useUserStore()

  // 현재 사용자가 프로젝트 오너인지 확인
  const isCurrentUserOwner = members.some(
    member => member.userId === userInfo?.userId?.toString() && member.role === "OWNER"
  )

  const handleRoleChange = (userId: string, newRole: WritableRole) => {
    updateRole.mutate({ userId, role: newRole })
  }

  const handleRemoveMember = (userId: string) => {
    removeMember.mutate(userId, {
      onSuccess: () => setRemoveDialogOpen(null),
    })
  }

  const handleCancelRemove = () => setRemoveDialogOpen(null)

  // owner가 최상단에 오도록 정렬
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === "OWNER") return -1
    if (b.role === "OWNER") return 1
    return 0
  })

  return (
    <div className="mb-4 h-[500px] min-h-[500px] overflow-y-auto">
      <div className="space-y-2 px-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4 text-[var(--color-muted-foreground)] text-sm">
            Loading members...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-4 text-[var(--color-destructive)] text-sm">
            Failed to load members
          </div>
        ) : sortedMembers.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-[var(--color-muted-foreground)] text-sm">
            No members found
          </div>
        ) : (
          sortedMembers.map(member => (
            <MemberRow
              handleCancelRemove={handleCancelRemove}
              handleRemoveMember={handleRemoveMember}
              handleRoleChange={handleRoleChange}
              isCurrentUserOwner={isCurrentUserOwner}
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
