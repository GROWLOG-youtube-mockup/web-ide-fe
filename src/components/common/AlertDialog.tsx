import type * as React from "react"
import { Button, type buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"

type AlertDialogVariant = "default" | "destructive" | "warning" | "success"

interface AlertDialogProps {
  trigger: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: AlertDialogVariant
  showCloseButton?: boolean
  iconSrc?: string // 피그마 아이콘 URL
}

// 피그마 토큰 기반 스타일 매핑
const VARIANT_STYLES: Record<
  AlertDialogVariant,
  {
    title: string
    button: typeof buttonVariants.arguments.variant
    iconBg: string
  }
> = {
  default: {
    button: "default",
    iconBg: "bg-slate-100",
    title: "",
  },
  destructive: {
    button: "destructive",
    iconBg: "bg-red-100",
    title: "text-red-600",
  },
  success: {
    button: "default", // 성공 스타일에 맞는 variant로 변경 가능
    iconBg: "bg-green-100",
    title: "text-green-600",
  },
  warning: {
    button: "default", // 경고 스타일에 맞는 variant로 변경 가능
    iconBg: "bg-amber-100",
    title: "text-amber-500",
  },
}

export function AlertDialog({
  trigger,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  variant = "default",
  showCloseButton = true,
  iconSrc,
}: AlertDialogProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          {iconSrc && (
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}
            >
              <img alt="" className="h-6 w-6" src={iconSrc} />
            </div>
          )}
          <DialogTitle className={`text-center font-semibold text-lg ${styles.title}`}>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="mt-2 text-center text-slate-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter className="mt-6 flex justify-center gap-2">
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button onClick={onConfirm} variant={styles.button}>
              {confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
