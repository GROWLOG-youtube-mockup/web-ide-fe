import { FormProvider, useForm } from "react-hook-form"
import { EmailVerify } from "@/components/auth/EmailVerify"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AUTH_STYLES } from "@/constants/auth-styles"

interface ResetPasswordProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ResetPasswordFormData {
  email: string
  verificationCode: string
  newPassword: string
}

export function ResetPassword({ open, onOpenChange }: ResetPasswordProps) {
  const form = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: "",
      verificationCode: "",
      newPassword: "",
    },
  })

  const { handleSubmit, reset, watch } = form
  const { email, verificationCode, newPassword } = watch()

  const onSubmit = (data: ResetPasswordFormData) => {
    // TODO: 실제 비밀번호 재설정 API 호출
    console.log("Resetting password for:", data.email, "with code:", data.verificationCode)
    onOpenChange(false)
    reset()
  }

  const handleCancel = () => {
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="w-[380px] max-w-sm gap-6 rounded-md border border-slate-200 bg-white p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        showCloseButton={false}
      >
        <DialogHeader className="gap-1.5">
          <DialogTitle className="text-left font-bold text-[20px] text-zinc-900">
            Forgot Password?
          </DialogTitle>
          <DialogDescription className="text-left font-medium text-[10.67px] text-slate-500">
            Once deleted, the data cannot be recovered.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email verification field */}
            <EmailVerify
              codeName="verificationCode"
              codePlaceholder="Enter your code"
              emailLabel="Email"
              emailName="email"
              emailPlaceholder="Enter your email"
            />

            {/* New password input */}
            <Input
              className="!text-[10.67px] !border-[0.667px] h-[35px] rounded-[5.333px] py-[13.333px] pr-[13.333px] pl-[13px] font-medium text-[10.667px] text-zinc-600 placeholder:text-zinc-500 focus-visible:ring-zinc-200"
              placeholder="Enter your new password"
              type="password"
              {...form.register("newPassword")}
            />

            {/* Cancel and Submit buttons */}
            <div className="flex flex-row items-center justify-end gap-2">
              <Button
                className={`${AUTH_STYLES.btnSmDialog} ${AUTH_STYLES.btnSmDialogCancel}`}
                onClick={handleCancel}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className={`${AUTH_STYLES.btnSmDialog} ${AUTH_STYLES.btnSmDialogConfirm} w-14`}
                disabled={!email || !verificationCode || !newPassword}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
