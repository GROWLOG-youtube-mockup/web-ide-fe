import type { ReactNode } from "react"

interface FormSectionProps {
  label: string
  htmlFor?: string
  children: ReactNode
  description?: string
  className?: string
  labelClassName?: string
  action?: ReactNode
}

/**
 * 공통 폼 섹션: 라벨, 설명, 필드, 추가 children을 일관된 스타일로 감싼다.
 */
export function FormSection({
  label,
  htmlFor,
  children,
  description,
  className = "",
  labelClassName = "",
  action,
}: FormSectionProps) {
  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      <div className="flex w-full items-center justify-between">
        <label
          className={`font-semibold text-[10.667px] text-zinc-950 ${labelClassName}`}
          htmlFor={htmlFor}
        >
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
