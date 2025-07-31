import { ChevronDown, X } from "lucide-react"
import { useState } from "react"
import { AlertDialog } from "@/components/common/AlertDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/custom-select"
import {
  useProjectMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks/permissions/useProjectMembers"
import { cn } from "@/lib/utils"

interface MembersProps {
  projectId: string
}

export const Members = ({ projectId }: MembersProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [removeDialogOpen, setRemoveDialogOpen] = useState<string | null>(null)
  const { data: members = [], isLoading, error } = useProjectMembers(projectId)
  const updateRole = useUpdateMemberRole(projectId)
  const removeMember = useRemoveMember(projectId)

  const handleRoleChange = (userId: string, newRole: "READ" | "WRITE") => {
    updateRole.mutate({
      userId,
      role: newRole,
    })
  }

  const handleRemoveMember = (userId: string) => {
    removeMember.mutate(userId, {
      onSuccess: () => {
        setRemoveDialogOpen(null)
      },
    })
  }

  const handleCancelRemove = () => {
    setRemoveDialogOpen(null)
  }

  return (
    <div className="flex flex-col border-b bg-[var(--share-primary)]">
      <Collapsible onOpenChange={setIsExpanded} open={isExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-shrink-0 cursor-pointer items-center px-4 py-2 hover:bg-accent/50">
            <div className="flex items-center gap-2">
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-0" : "-rotate-90"
                )}
              />
              <span className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
                Members
              </span>
              <Badge className="bg-amber-200 text-xs" variant="secondary">
                {members.length}
              </Badge>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mx-4">
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <span className="text-muted-foreground text-sm">Loading members...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center p-4">
                <span className="text-destructive text-sm">Failed to load members</span>
              </div>
            )}
            {!isLoading &&
              !error &&
              members.map(member => (
                <div
                  className="mx-4 mb-4 flex items-center gap-2 rounded-xl bg-card/50 bg-gray-100 px-4 py-3 transition-colors hover:bg-accent/50"
                  key={member.userId}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt={member.name} src={member.profileImageUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-sm">{member.name}</span>
                    <span className="block truncate text-muted-foreground text-xs">
                      {member.email}
                    </span>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {member.role === "OWNER" ? (
                      <div className=" flex h-8 w-20 items-center justify-center px-3 py-1 text-sm">
                        <Badge
                          className="flex h-8 items-center bg-amber-100 px-3 text-orange-700"
                          variant="secondary"
                        >
                          Owner 👑
                        </Badge>
                      </div>
                    ) : (
                      <Select
                        disabled={updateRole.isPending}
                        onValueChange={(newRole: "READ" | "WRITE") =>
                          handleRoleChange(member.userId, newRole)
                        }
                        value={member.role}
                      >
                        <SelectTrigger className="w-20 text-xs" size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem size="sm" value="READ">
                            Read
                          </SelectItem>
                          <SelectItem size="sm" value="WRITE">
                            Write
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <AlertDialog
                      cancelText="취소"
                      confirmText="제거"
                      description="정말로 이 멤버를 제거하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                      isLoading={removeMember.isPending}
                      isOpen={removeDialogOpen === member.userId}
                      onCancel={handleCancelRemove}
                      onConfirm={() => handleRemoveMember(member.userId)}
                      onOpenChange={open => {
                        setRemoveDialogOpen(open ? member.userId : null)
                      }}
                      title="멤버 제거"
                      trigger={
                        <button
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded text-muted-foreground",
                            member.role === "OWNER"
                              ? "cursor-not-allowed opacity-20"
                              : "hover:bg-accent hover:text-destructive"
                          )}
                          disabled={removeMember.isPending || member.role === "OWNER"}
                          type="button"
                        >
                          <X
                            className={cn(
                              "h-4 w-4",
                              member.role === "OWNER" ? "" : "cursor-pointer"
                            )}
                          />
                        </button>
                      }
                      variant="destructive"
                    />
                  </div>
                </div>
              ))}
            {!isLoading && !error && members.length === 0 && (
              <div className="flex items-center justify-center p-4">
                <span className="text-muted-foreground text-sm">No members found</span>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
