import type { LucideIcon } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type NavItem, useSidebarStore } from "@/stores/sidebar-store"

interface SidebarTabProps {
  id: NavItem
  icon: LucideIcon
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

export const SidebarTab = ({ id, icon: Icon }: SidebarTabProps) => {
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
