import type { ReactNode } from "react"
import { cn } from "@/shared/utils"

interface CustomCollapsibleProps {
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

/**
 * 접기/펼치기 기능을 제공하는 컨테이너 컴포넌트
 *
 * @example
 * ```tsx
 * <CustomCollapsible open={expanded} onOpenChange={setExpanded}>
 *   <CustomCollapsibleTrigger>버튼</CustomCollapsibleTrigger>
 *   <CustomCollapsibleContent open={expanded}>내용</CustomCollapsibleContent>
 * </CustomCollapsible>
 * ```
 */
function CustomCollapsible({
  className,
  open = false,
  onOpenChange: _onOpenChange,
  children,
}: CustomCollapsibleProps) {
  return (
    <div className={cn("custom-collapsible", className)} data-state={open ? "open" : "closed"}>
      {children}
    </div>
  )
}

interface CustomCollapsibleTriggerProps {
  className?: string
  onClick?: () => void
  children: ReactNode
}

/**
 * 접기/펼치기를 트리거하는 버튼 컴포넌트 (항상 <button>만 반환)
 */
function CustomCollapsibleTrigger({ className, onClick, children }: CustomCollapsibleTriggerProps) {
  return (
    <button
      type="button"
      className={cn("custom-collapsible-trigger", className)}
      onClick={onClick}
      aria-expanded={false}
    >
      {children}
    </button>
  )
}

interface CustomCollapsibleContentProps {
  className?: string
  open?: boolean
  children: ReactNode
}

/**
 * 접기/펼치기되는 콘텐츠 영역
 *
 * @param open - 콘텐츠 표시 여부
 */
function CustomCollapsibleContent({
  className,
  open = false,
  children,
}: CustomCollapsibleContentProps) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        open ? "max-h-[500px]" : "max-h-0",
        className
      )}
      aria-hidden={!open}
    >
      {children}
    </div>
  )
}

export { CustomCollapsible, CustomCollapsibleTrigger, CustomCollapsibleContent }
