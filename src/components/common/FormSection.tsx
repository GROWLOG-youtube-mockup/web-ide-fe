import type { ReactNode } from "react"

interface FormSectionProps {
  label: string
  htmlFor?: string
  children: ReactNode
  description?: string
  action?: ReactNode
}

export function FormSection({ label, htmlFor, children, description, action }: FormSectionProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <label className="font-semibold text-[10.667px] text-zinc-950" htmlFor={htmlFor}>
          {label}
        </label>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p className="font-normal text-[9.333px] text-zinc-500 leading-[13.333px]">{description}</p>
      )}
      {children}
    </div>
  )
}
