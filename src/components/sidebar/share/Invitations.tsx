import { ChevronDown, Mail, UserPlus, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/common/ToastContext"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useInviteUser } from "@/hooks/permissions/useProjectMembers"
import { cn } from "@/lib/utils"

interface InvitationsProps {
  projectId: string
}

export const Invitations = ({ projectId }: InvitationsProps) => {
  const [email, setEmail] = useState("")
  const [pendingEmails, setPendingEmails] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const inviteUser = useInviteUser(projectId)
  const { addToast } = useToast()

  const [isExpanded, setIsExpanded] = useState(true)

  // 이메일 유효성 검사 함수
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // 이메일을 대기 목록에 추가하는 핸들러
  const handleAddEmail = () => {
    if (!email.trim()) {
      return
    }

    if (!isValidEmail(email)) {
      addToast({
        type: "error",
        title: "Please enter a valid email format.",
        duration: 3000,
      })
      return
    }

    if (pendingEmails.includes(email)) {
      addToast({
        type: "error",
        title: "This email is already added.",
        duration: 3000,
      })
      return
    }

    setPendingEmails(prev => [...prev, email])
    setEmail("")
  }

  // 대기 목록에서 이메일을 제거하는 핸들러
  const handleRemoveEmail = (emailToRemove: string) => {
    setPendingEmails(prev => prev.filter(e => e !== emailToRemove))
  }

  const handleSendInvitations = () => {
    setIsSending(true)
    inviteUser.mutate(pendingEmails, {
      onSuccess: () => {
        setPendingEmails([])
      },
      onSettled: () => {
        setIsSending(false)
      },
    })
  }

  // Enter 키 입력 시 이메일 추가 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddEmail()
    }
  }

  const isLoading = isSending || inviteUser.isPending

  return (
    <div className="flex flex-col border-gray-200 border-b bg-[var(--share-primary)] dark:border-gray-700">
      <Collapsible onOpenChange={setIsExpanded} open={isExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-shrink-0 cursor-pointer items-center gap-2 px-4 pt-4 pb-3">
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-0" : "-rotate-90")}
            />
            <span className="font-medium text-gray-600 text-sm uppercase tracking-wide dark:text-gray-400">
              Invitations
            </span>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="mx-4">
          <div className="mb-3 flex flex-shrink-0 gap-2 px-4">
            <input
              className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
              disabled={isLoading}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Invite by member email"
              type="email"
              value={email}
            />
            <Button
              className="cursor-pointer rounded bg-gray-800 p-2 text-white disabled:opacity-50 dark:bg-gray-600"
              disabled={isLoading}
              onClick={handleAddEmail}
              type="button"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* 이메일 태그 영역 */}
          <div className="mb-4 max-h-60 min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="space-y-2 px-4">
              {pendingEmails.length === 0 ? (
                <div className="flex items-center justify-center p-4">
                  <span className="text-gray-500 text-sm">Add emails to invite</span>
                </div>
              ) : (
                pendingEmails.map(emailItem => (
                  <div
                    className="flex items-center gap-2 rounded border bg-white px-4 py-1 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    key={emailItem}
                  >
                    <span className="flex-1 text-sm">{emailItem}</span>
                    <Button
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                      onClick={() => handleRemoveEmail(emailItem)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 초대 버튼 */}
          <div className="flex-shrink-0 p-4">
            <Button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-gray-900 py-4 text-sm text-white disabled:opacity-50 dark:bg-gray-700"
              disabled={isLoading || pendingEmails.length === 0}
              onClick={handleSendInvitations}
              type="button"
            >
              <Mail className="h-4 w-4" />
              {isLoading
                ? "Sending..."
                : `Invite Team Member${
                    pendingEmails.length > 0 ? ` (${pendingEmails.length})` : ""
                  }`}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
