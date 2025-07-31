import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { type PanelId, useSidebarStore } from "@/stores/sidebar-store"

export interface SidebarPanelProps {
  id: PanelId // 패널 고유 식별자 (상태 관리용)
  title: string // UI 표시용
  children?: ReactNode
  actions?: ReactNode
  defaultOpen?: boolean
}

export function SidebarPanel({ id, title, actions, children }: SidebarPanelProps) {
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
    <Collapsible
      className="sidebar-panel flex flex-1 flex-col"
      onOpenChange={handleOpenChange}
      open={expanded}
    >
      <div className="flex flex-col">
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex w-full cursor-pointer items-center justify-between gap-1.5 border-zinc-200 border-y bg-zinc-50 px-3 py-2 font-medium text-sm hover:bg-zinc-100"
            )}
          >
            <div className="flex items-center gap-1.5">
              <ChevronRight className={cn("transition-transform", expanded && "rotate-90")} />
              <span className="truncate text-left uppercase">{title}</span>
            </div>
            {actions && <div className="flex items-center gap-1">{actions}</div>}
          </div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="min-h-0 flex-1 overflow-auto">
        <ScrollArea className="h-full w-full">{children}</ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}
