import type { LucideIcon } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import type { TabId } from "@/feature/sidebar/stores/sidebar-store"
import { useSidebarStore } from "@/feature/sidebar/stores/sidebar-store"
import { Button } from "@/shared/components/custom-button"
import { cn } from "@/shared/utils/utils"

interface SidebarTabProps {
  id: TabId
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
        "h-10 w-10 cursor-pointer shadow-none",
        isActive && "bg-[var(--color-muted)] text-[var(--color-foreground)]"
      )}
      onClick={onClick}
      variant={"ghost"}
    >
      {children}
    </Button>
  )
}

export const SidebarTab = ({ id, icon: Icon }: SidebarTabProps) => {
  const { activeTab, setActiveTab } = useSidebarStore()

  return (
    <SidebarTabButton
      isActive={activeTab === id}
      onClick={() => {
        setActiveTab(id)
      }}
    >
      <Icon className="size-6" />
    </SidebarTabButton>
  )
}
