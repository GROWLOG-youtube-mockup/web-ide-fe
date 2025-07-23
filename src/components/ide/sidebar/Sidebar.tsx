import type { LucideIcon } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { type NavItem, useSidebarStore } from "../../../stores/sidebar-store"
import { ViewManager } from "./ViewManager"

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

const SidebarPanel = ({ id, title, children }: PanelProps) => {
  const activeView = useSidebarStore(state => state.activeView)

  if (activeView !== id) {
    return null
  }

  return (
    <ViewManager defaultOpen={true} title={title}>
      {children}
    </ViewManager>
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
