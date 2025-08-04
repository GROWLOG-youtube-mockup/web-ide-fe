import type { ProjectMember } from "@/backup/types/api"
import RemoveButton from "@/invite/RemoveButton"
import RoleSelect from "@/invite/RoleSelect"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"

type WritableRole = "READ" | "WRITE"
interface UpdateRole {
  isPending: boolean
}
interface RemoveMember {
  isPending: boolean
}
interface MemberRowProps {
  member: ProjectMember
  updateRole: UpdateRole
  handleRoleChange: (userId: string, newRole: WritableRole) => void
  removeMember: RemoveMember
  removeDialogOpen: string | null
  setRemoveDialogOpen: (id: string | null) => void
  handleCancelRemove: () => void
  handleRemoveMember: (userId: string) => void
  isCurrentUserOwner: boolean
}

const MemberRow = ({
  member,
  updateRole,
  handleRoleChange,
  removeMember,
  removeDialogOpen,
  setRemoveDialogOpen,
  handleCancelRemove,
  handleRemoveMember,
  isCurrentUserOwner,
}: MemberRowProps) => (
  <div className="flex items-center gap-2 rounded border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1 hover:bg-[var(--color-muted)]">
    <Avatar className="h-8 w-8">
      <AvatarImage alt={member.name} src={member.profileImageUrl} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {member.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <span className="block truncate font-medium text-[var(--color-foreground)] text-sm">
        {member.name}
      </span>
      <span className="block truncate text-[var(--color-muted-foreground)] text-xs">
        {member.email}
      </span>
    </div>
    <div className="flex flex-shrink-0 items-center gap-2">
      {member.role === "OWNER" ? (
        <Badge
          className="flex h-8 items-center bg-[var(--color-secondary)] px-3 text-[var(--color-primary)]"
          variant="secondary"
        >
          Owner 👑
        </Badge>
      ) : (
        <RoleSelect
          handleRoleChange={handleRoleChange}
          isCurrentUserOwner={isCurrentUserOwner}
          member={member}
          updateRole={updateRole}
        />
      )}
      <RemoveButton
        handleCancelRemove={handleCancelRemove}
        handleRemoveMember={handleRemoveMember}
        member={member}
        removeDialogOpen={removeDialogOpen}
        removeMember={removeMember}
        setRemoveDialogOpen={setRemoveDialogOpen}
      />
    </div>
  </div>
)

export default MemberRow
