import { zodResolver } from "@hookform/resolvers/zod"
import { MailIcon, UserPlus, XIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/custom-form"
import { Input } from "@/components/ui/input"
import { useInviteUser } from "@/hooks/permissions/useProjectMembers"

export function Invitations({ projectId }: { projectId: string }) {
  const [pendingEmails, setPendingEmails] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const inviteUser = useInviteUser(projectId)

  // zod 폼 스키마
  const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email format." }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  // 대기 목록에서 이메일을 제거하는 핸들러
  const handleRemoveEmail = useCallback((emailToRemove: string) => {
    setPendingEmails(prev => prev.filter(e => e !== emailToRemove))
  }, [])

  // 초대 전송
  const handleSendInvitations = useCallback(() => {
    setIsSending(true)
    inviteUser.mutate(pendingEmails, {
      onSuccess: () => setPendingEmails([]),
      onSettled: () => setIsSending(false),
    })
  }, [inviteUser, pendingEmails])

  const isLoading = isSending || inviteUser.isPending
  const isInviteDisabled = isLoading || pendingEmails.length === 0

  // 이메일 추가 핸들러 (폼 submit)
  const onAddEmail = (values: z.infer<typeof formSchema>) => {
    const trimmed = values.email.trim()
    if (pendingEmails.includes(trimmed)) {
      form.setError("email", {
        type: "manual",
        message: "This email is already added.",
      })
      return
    }
    setPendingEmails(prev => [...prev, trimmed])
    form.reset()
  }

  // 내부 컴포넌트: 이메일 목록 (심플 스타일)
  const EmailList = () => (
    <div className="mb-4 max-h-48 overflow-y-auto">
      <div className="space-y-2 px-2">
        {pendingEmails.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-[hsl(var(--muted-foreground))] text-sm">
            Add emails to invite
          </div>
        ) : (
          pendingEmails.map(emailItem => (
            <div
              className="flex items-center gap-2 rounded border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1 hover:bg-[hsl(var(--muted))]"
              key={emailItem}
            >
              <span className="flex-1 text-[hsl(var(--foreground))] text-sm">{emailItem}</span>
              <Button
                aria-label={`Remove ${emailItem}`}
                className="flex-shrink-0 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                disabled={isLoading}
                onClick={() => handleRemoveEmail(emailItem)}
                type="button"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )

  // 내부 컴포넌트: 초대 버튼 (심플 스타일)
  const InviteButton = () => (
    <div className="px-2 pb-2">
      <Button
        aria-label="Send invitations"
        className="w-full bg-[hsl(var(--primary))] py-3 text-[hsl(var(--primary-foreground))] text-sm hover:bg-[hsl(var(--primary)/0.95)] disabled:opacity-50"
        disabled={isInviteDisabled}
        onClick={handleSendInvitations}
        type="button"
      >
        <MailIcon className="mr-2 h-4 w-4" />
        {isLoading
          ? "Sending..."
          : `Invite Team Member${pendingEmails.length > 0 ? ` (${pendingEmails.length})` : ""}`}
      </Button>
    </div>
  )

  return (
    <div>
      <Form {...form}>
        <form
          autoComplete="off"
          className="mb-2 flex gap-2 px-2"
          onSubmit={form.handleSubmit(onAddEmail)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    disabled={isLoading}
                    placeholder="Invite by member email"
                    type="email"
                  />
                </FormControl>
                <FormMessage className="mt-1 text-[hsl(var(--destructive))] text-xs" />
              </FormItem>
            )}
          />
          <Button
            aria-label="Add email to invite list"
            className="rounded border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] disabled:opacity-50"
            disabled={isLoading}
            type="submit"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </form>
      </Form>
      <EmailList />
      <InviteButton />
    </div>
  )
}
