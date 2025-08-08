import type { ReactNode } from "react"
import type { ContextMenuItem as ContextMenuType } from "@/shared/types/context-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/context-menu"
import { cn } from "@/shared/utils/utils"

interface ContextMenuWrapperProps {
  children: ReactNode
  menuItems: ContextMenuType[]
}

export const WithContextMenu = ({ children, menuItems }: ContextMenuWrapperProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="context-menu border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-lg dark:border-[var(--border)] dark:bg-[var(--background)] dark:text-[var(--foreground)]">
        {menuItems.map((item, index) => (
          <ContextMenuItem
            className={cn(
              "context-menu-item cursor-pointer px-3 py-2 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1",
              item.variant === "destructive"
                ? "text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-[var(--destructive-foreground)] dark:text-[var(--destructive)] dark:hover:bg-[var(--destructive)] dark:hover:text-[var(--destructive-foreground)]"
                : "text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:text-[var(--foreground)] dark:hover:bg-[var(--accent)] dark:hover:text-[var(--accent-foreground)]",
              index !== menuItems.length - 1 && "border-[var(--border)] border-b"
            )}
            key={item.label}
            onClick={item.action}
          >
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
