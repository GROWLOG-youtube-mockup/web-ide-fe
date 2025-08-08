import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import type * as React from "react"
import { Button } from "@/shared/components/custom-button.tsx"
import { AUTH_STYLES } from "@/shared/constants/auth-styles.ts"
import {
  Dialog,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog.tsx"

type AlertDialogVariant = "default" | "destructive" | "warning" | "success"

interface AlertDialogProps {
  trigger?: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: AlertDialogVariant
  showCloseButton?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  confirmDisabled?: boolean
  isLoading?: boolean
}

// Figma 디자인을 반영한 스타일 매핑
const VARIANT_STYLES: Record<
  AlertDialogVariant,
  {
    titleColor: string
    confirmButtonClass: string
    cancelButtonClass: string
  }
> = {
  default: {
    titleColor: "text-zinc-900",
    confirmButtonClass: "bg-zinc-950 text-neutral-50 hover:bg-zinc-800",
    cancelButtonClass: "bg-white border border-slate-200 text-slate-950 hover:bg-slate-50",
  },
  destructive: {
    titleColor: "text-red-500",
    confirmButtonClass: "bg-red-500 text-slate-50 hover:bg-red-600",
    cancelButtonClass: "bg-white border border-slate-200 text-slate-950 hover:bg-slate-50",
  },
  success: {
    titleColor: "text-green-600",
    confirmButtonClass: "bg-green-600 text-white hover:bg-green-700",
    cancelButtonClass: "bg-white border border-slate-200 text-slate-950 hover:bg-slate-50",
  },
  warning: {
    titleColor: "text-amber-500",
    confirmButtonClass: "bg-amber-500 text-white hover:bg-amber-600",
    cancelButtonClass: "bg-white border border-slate-200 text-slate-950 hover:bg-slate-50",
  },
}

// Figma 디자인에 맞는 커스텀 DialogContent
function CustomDialogContent({
  children,
  showCloseButton = true,
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      {/* Figma 디자인: backdrop-blur-[2px] backdrop-filter bg-[rgba(0,0,0,0.5)] */}
      <DialogPrimitive.Overlay className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] backdrop-filter data-[state=closed]:animate-out data-[state=open]:animate-in" />
      <DialogPrimitive.Content
        className={`data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-[400px] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-md bg-white p-[24px] duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in ${className || ""}`}
        {...props}
      >
        {/* Figma 디자인의 border와 shadow를 별도 div로 구현 */}
        <div className="pointer-events-none absolute inset-0 rounded-md border border-slate-200 border-solid" />
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-20 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>--
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

// TODO: https://ui.shadcn.com/docs/components/alert-dialog
export function AlertDialog({
  trigger,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmText = "confirm",
  cancelText = "cancel",
  variant = "default",
  showCloseButton = true,
  isOpen,
  onOpenChange,
  confirmDisabled = false,
  isLoading = false,
}: AlertDialogProps) {
  const styles = VARIANT_STYLES[variant]

  const handleConfirm = async () => {
    if (onConfirm && !isLoading) {
      await onConfirm()
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <CustomDialogContent showCloseButton={showCloseButton}>
        {/* Figma 디자인: gap-1.5 -> gap-1.5, leading 값들 정확히 매칭 */}
        <div className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-start gap-1.5 text-nowrap p-0 text-left not-italic leading-[0]">
          <DialogTitle asChild>
            <div className={`relative shrink-0 font-bold text-[20px] ${styles.titleColor}`}>
              <p className="block whitespace-pre text-nowrap leading-[20px]">{title}</p>
            </div>
          </DialogTitle>
          {description && (
            <DialogDescription asChild>
              <div className="relative shrink-0 font-medium text-[10.67px] text-slate-500">
                <p className="block whitespace-pre text-nowrap leading-[20px]">{description}</p>
              </div>
            </DialogDescription>
          )}
        </div>

        {children}

        {/* Figma 디자인: button section */}
        <div className="relative box-border flex w-full shrink-0 flex-row content-stretch items-center justify-end gap-2 p-0">
          {onCancel && (
            <Button
              className={`${AUTH_STYLES.btnSmDialog} ${styles.cancelButtonClass} h-[35px] w-[56px]`}
              disabled={isLoading}
              onClick={onCancel}
              type="button"
            >
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button
              className={`${AUTH_STYLES.btnSmDialog} ${styles.confirmButtonClass} h-[35px] w-[56px]`}
              disabled={confirmDisabled || isLoading}
              onClick={handleConfirm}
              type="button"
            >
              {isLoading ? "loading..." : confirmText}
            </Button>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  )
}
