import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"
import { type PanelId, useSidebarStore } from "@/entities/file/model/sidebar-store.ts"
import { Button } from "@/shared/components/custom-button.tsx"
import {
  CustomCollapsible,
  CustomCollapsibleContent,
  CustomCollapsibleTrigger,
} from "@/shared/components/custom-collapsible.tsx"
import { Badge } from "@/shared/ui/badge.tsx"
import { ScrollArea } from "@/shared/ui/scroll-area.tsx"
import { cn } from "@/shared/utils/utils.ts"

export interface SidebarPanelProps {
  id: PanelId // 패널 고유 식별자 (상태 관리용)
  title: ReactNode // UI 표시용 (뱃지 등 복합 가능)
  actions?: ReactNode
  countBadge?: number // title 우측에 표시할 컴포넌트 (예: MemberCount)
  defaultOpen?: boolean
  children?: ReactNode
}

export function SidebarPanel({ id, title, actions, countBadge = 0, children }: SidebarPanelProps) {
  const { expandedPanels, addExpandedPanel, removeExpandedPanel } = useSidebarStore()
  const expanded = expandedPanels.includes(id)

  const handleOpenChange = (expanded: boolean) => {
    if (expanded) {
      addExpandedPanel(id)
      return
    }
    removeExpandedPanel(id)
  }

  return (
    <CustomCollapsible
      className="sidebar-panel flex min-h-0 flex-1 flex-col overflow-hidden"
      onOpenChange={handleOpenChange}
      open={expanded}
    >
      <div className="flex flex-col">
        <CustomCollapsibleTrigger onClick={() => handleOpenChange(!expanded)}>
          <Button
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-1.5",
              "px-3 py-2 font-medium text-sm",
              "text-[var(--color-foreground)]",
              "rounded-none border-[var(--color-border)] border-y"
            )}
            variant={"ghost"}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <ChevronRight
                className={cn("transition-transform duration-300", expanded && "rotate-90")}
              />
              <span className="truncate text-left uppercase">{title}</span>
              {countBadge > 0 && (
                <Badge
                  className="flex h-5 min-w-5 items-center justify-center rounded-full text-xs"
                  variant="default"
                >
                  {countBadge}
                </Badge>
              )}
            </div>
            {actions && <div className="flex items-center gap-1">{actions}</div>}
          </Button>
        </CustomCollapsibleTrigger>
      </div>
      <CustomCollapsibleContent className="min-h-0 flex-1" open={expanded}>
        <ScrollArea className="h-full w-full p-2">{children}</ScrollArea>
      </CustomCollapsibleContent>
    </CustomCollapsible>
  )
}
