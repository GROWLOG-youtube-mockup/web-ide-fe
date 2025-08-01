import { zodResolver } from "@hookform/resolvers/zod"
import { MailIcon, UserPlusIcon, XIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/custom-button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/custom-form"
import { Input } from "@/components/ui/input"
import { useInviteUser } from "@/hooks/permissions/useProjectMembers"

export function Invitations({ projectId }: { projectId: string }) {
  const [pendingEmails, setPendingEmails] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const inviteUser = useInviteUser(projectId)

  // zod 폼 스키마
  const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email format" }),
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

  // 내부 컴포넌트: 이메일 목록 (Badge 스타일)
  const EmailList = () => (
    <>
      {pendingEmails.length === 0 ? (
        <div className="flex min-h-[40px] items-center justify-center text-[var(--color-muted-foreground)] text-sm normal-case">
          Add emails to invite
        </div>
      ) : (
        <div className="flex min-h-[40px] flex-wrap items-center gap-2">
          {pendingEmails.map(emailItem => (
            <Badge
              className="flex items-center gap-1 bg-[var(--color-secondary)] px-2 py-1 text-[var(--color-secondary-foreground)]"
              key={emailItem}
              variant="secondary"
            >
              <span className="text-xs">{emailItem}</span>
              <Button
                aria-label={`Remove ${emailItem}`}
                className="ml-1 h-4 w-4 p-0 text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)]"
                disabled={isLoading}
                onClick={() => handleRemoveEmail(emailItem)}
                type="button"
                variant="ghost"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </>
  )

  // 내부 컴포넌트: 초대 버튼
  const InviteButton = () => (
    <Button
      aria-label="Send invitations"
      className="w-full"
      disabled={isInviteDisabled}
      onClick={handleSendInvitations}
      size="default"
      type="button"
      variant="default"
    >
      <MailIcon className="h-5 w-5" />
      {isLoading
        ? "Sending..."
        : `Invite Team Member ${pendingEmails.length > 0 ? `(${pendingEmails.length})` : ""}`}
    </Button>
  )

  return (
    <>
      <Form {...form}>
        <form
          className="flex items-center gap-2 border-[var(--color-border)] bg-[var(--color-background)]"
          noValidate
          onSubmit={form.handleSubmit(onAddEmail)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Invite by member email"
                      type="email"
                    />
                  </FormControl>
                  <Button
                    aria-label="Add email to invite list"
                    className="rounded-md"
                    disabled={isLoading}
                    size="icon"
                    type="submit"
                  >
                    <UserPlusIcon className="h-5 w-5" />
                  </Button>
                </div>
                <FormMessage className="min-h-[20px] text-xs transition-opacity duration-200">
                  {form.formState.errors.email?.message || "\u00A0"}
                </FormMessage>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <EmailList />
      <div className="min-h-[20px]">{"\u00A0"}</div>
      <InviteButton />
    </>
  )
}
