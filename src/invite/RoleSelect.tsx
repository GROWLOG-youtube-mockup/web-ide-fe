import type { ProjectMember } from "@/backup/types/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"

type WritableRole = "READ" | "WRITE"

interface UpdateRole {
  isPending: boolean
}
interface RoleSelectProps {
  member: ProjectMember
  updateRole: UpdateRole
  handleRoleChange: (userId: string, newRole: WritableRole) => void
  isCurrentUserOwner: boolean
}

const RoleSelect = ({
  member,
  updateRole,
  handleRoleChange,
  isCurrentUserOwner,
}: RoleSelectProps) => (
  <Select
    disabled={updateRole.isPending || !isCurrentUserOwner}
    onValueChange={(newRole: WritableRole) => handleRoleChange(member.userId, newRole)}
    value={member.role}
  >
    <SelectTrigger
      className="w-20 border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)] text-xs"
      size="sm"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="border border-[var(--color-border)] bg-[var(--color-popover)] text-[var(--color-popover-foreground)]">
      <SelectItem className="text-[var(--color-foreground)]" value="READ">
        Read
      </SelectItem>
      <SelectItem className="text-[var(--color-foreground)]" value="WRITE">
        Write
      </SelectItem>
    </SelectContent>
  </Select>
)

export default RoleSelect
