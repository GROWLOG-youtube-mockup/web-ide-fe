import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { type NavItem, useSidebarStore } from "../../../stores/sidebar-store"

interface SidebarTabProps {
  id: NavItem
  icon: LucideIcon
}

interface SidebarTabsGroupProps {
  children: ReactNode
  position?: "top" | "bottom"
}

interface SidebarPanelProps {
  id: NavItem
  title: string
  children: ReactNode
}

interface SidebarTabButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
}

const SidebarTabButton = ({ children, onClick, isActive = false }: SidebarTabButtonProps) => {
  return (
    <Button
      className={cn(
        "h-10 w-10 cursor-pointer bg-transparent shadow-none",
        isActive && "bg-zinc-200",
        !isActive && "hover:bg-zinc-200"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

const SidebarTabs = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <nav className="flex w-14 flex-col justify-between bg-zinc-100 p-2">{children}</nav>
      <Separator className="bg-zinc-200" orientation="vertical" />
    </>
  )
}

const SidebarTabsGroup = ({ children, position = "top" }: SidebarTabsGroupProps) => {
  if (position === "bottom") {
    return <div className="flex flex-col gap-2">{children}</div>
  }
  return <div className="flex flex-col gap-2">{children}</div>
}

const SidebarTab = ({ id, icon: Icon }: SidebarTabProps) => {
  const { activePanel, setActivePanel } = useSidebarStore()

  const handleClick = () => {
    setActivePanel(id)
  }

  return (
    <SidebarTabButton isActive={activePanel === id} onClick={handleClick}>
      <Icon className="size-6" />
    </SidebarTabButton>
  )
}

const SidebarPanels = ({ children }: { children: ReactNode }) => {
  return <div className="flex-1">{children}</div>
}

const SidebarPanel = ({ id, title, children }: SidebarPanelProps) => {
  const { activePanel, sectionExpanded, setSectionExpanded } = useSidebarStore()
  const isExpanded = sectionExpanded[id]

  if (activePanel !== id) {
    return null
  }

  return (
    <Collapsible
      className="group/collapsible h-full min-w-0 overflow-hidden"
      onOpenChange={expanded => setSectionExpanded(id, expanded)}
      open={isExpanded}
    >
      <CollapsibleTrigger asChild>
        <Button
          className={cn(
            "h-auto w-full cursor-pointer items-center justify-start border-zinc-200 border-b bg-zinc-50 px-3 py-2",
            "gap-1.5 rounded-none font-medium text-sm"
          )}
          variant="ghost"
        >
          <ChevronRight className={cn("transition-transform", isExpanded && "rotate-90")} />
          <span className="truncate text-left uppercase">{title}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-0 py-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const Sidebar = {
  Panel: SidebarPanel,
  Panels: SidebarPanels,
  Tab: SidebarTab,
  Tabs: SidebarTabs,
  TabsGroup: SidebarTabsGroup,
}
