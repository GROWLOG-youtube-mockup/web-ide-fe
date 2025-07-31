import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { type NavItem, useSidebarStore } from "@/stores/sidebar-store"

interface SidebarPanelProps {
  id: NavItem
  title: string
  children: ReactNode
  actions?: ReactNode
}

export const SidebarPanel = ({ id, title, actions, children }: SidebarPanelProps) => {
  const { activePanel, expandedPanel, setExpandedPanel } = useSidebarStore()

  const isExpanded = expandedPanel[id]

  if (activePanel !== id) {
    return null
  }

  return (
    <Collapsible
      className="group/collapsible flex h-full flex-1 flex-col"
      onOpenChange={expanded => setExpandedPanel(id, expanded)}
      open={isExpanded}
    >
      <div className="flex flex-col">
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex w-full cursor-pointer items-center justify-between border-zinc-200 border-b bg-zinc-50 px-3 py-2",
              "gap-1.5 font-medium text-sm hover:bg-zinc-100"
            )}
          >
            <div className="flex items-center gap-1.5">
              <ChevronRight className={cn("transition-transform", isExpanded && "rotate-90")} />
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
