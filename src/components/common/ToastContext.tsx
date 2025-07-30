import { CheckCircle, Info, XCircle } from "lucide-react"
import { createContext, type ReactNode, useContext, useState } from "react"

type ToastType = "success" | "error" | "info"

export interface Toast {
  id: string
  type: ToastType
  title: string
  duration?: number
}

const ToastContext = createContext<
  | {
      toasts: Toast[]
      addToast: (toast: Omit<Toast, "id">) => void
    }
  | undefined
>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), toast.duration || 1500)
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex flex-col space-y-2">
          {toasts.map(toast => (
            <ToastItem key={toast.id} {...toast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
}

const TOAST_CONFIG = {
  success: {
    style: "bg-green-50 border-green-200 text-green-800",
    icon: CheckCircle,
    color: "text-green-500",
  },
  error: { style: "bg-red-50 border-red-200 text-red-800", icon: XCircle, color: "text-red-500" },
  info: { style: "bg-blue-50 border-blue-200 text-blue-800", icon: Info, color: "text-blue-500" },
}

function ToastItem({ type, title }: Toast) {
  const { style, icon: Icon, color } = TOAST_CONFIG[type]
  return (
    <div
      className={`pointer-events-auto max-w-sm rounded-md border px-4 py-3 shadow-sm transition-all duration-300 ${style}`}
    >
      <div className="flex items-center">
        <Icon className={`h-5 w-5 ${color} flex-shrink-0`} />
        <p className="ml-3 font-medium text-sm">{title}</p>
      </div>
    </div>
  )
}
