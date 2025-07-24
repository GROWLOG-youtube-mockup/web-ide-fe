import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { type NavItem, useSidebarStore } from "../../../stores/sidebar-store"

interface SidebarRootProps {
  children: ReactNode
}

interface NavItemProps {
  id: NavItem
  icon: LucideIcon
}

interface PanelProps {
  id: NavItem
  title: string
  defaultExpanded?: boolean
  children: ReactNode
}

interface NavButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
}

const NavButton = ({ children, onClick, isActive = false }: NavButtonProps) => {
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

const SidebarRoot = ({ children }: SidebarRootProps) => {
  return <div className="flex flex-1">{children}</div>
}

const SidebarNav = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <nav className="flex w-14 flex-col justify-between bg-zinc-100 p-2">{children}</nav>
      <Separator className="bg-zinc-200" orientation="vertical" />
    </>
  )
}

const SidebarNavGroup = ({
  children,
  position = "top",
}: {
  children: ReactNode
  position?: "top" | "bottom"
}) => {
  if (position === "bottom") {
    return <>{children}</>
  }
  return <div className="flex flex-col gap-2">{children}</div>
}

const SidebarNavItem = ({ id, icon: Icon }: NavItemProps) => {
  const { activeView, setActiveView } = useSidebarStore()

  const handleClick = () => {
    setActiveView(id)
  }

  return (
    <NavButton isActive={activeView === id} onClick={handleClick}>
      <Icon className="size-6" />
    </NavButton>
  )
}

const SidebarContent = ({ children }: { children: ReactNode }) => {
  return <div className="flex-1">{children}</div>
}

const SidebarPanel = ({ id, title, defaultExpanded = false, children }: PanelProps) => {
  const activeView = useSidebarStore(state => state.activeView)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (activeView !== id) {
    return null
  }

  return (
    <Collapsible
      className="group/collapsible h-full min-w-0 overflow-hidden"
      onOpenChange={setIsExpanded}
      open={isExpanded}
    >
      <CollapsibleTrigger asChild>
        <Button
          // ml-1 h-6 w-full cursor-pointer justify-start gap-1.5 font-normal text-sm
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
  Content: SidebarContent,
  Nav: SidebarNav,
  NavGroup: SidebarNavGroup,
  NavItem: SidebarNavItem,
  Panel: SidebarPanel,
  Root: SidebarRoot,
}
