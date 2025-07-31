import type { ReactNode } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"
import type { ContextMenuItem as ContextMenuType } from "@/types/context-menu"

interface ContextMenuWrapperProps {
  children: ReactNode
  menuItems: ContextMenuType[]
}

export const WithContextMenu = ({ children, menuItems }: ContextMenuWrapperProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="context-menu border border-[hsl(var(--context-border))] bg-[hsl(var(--context-background))] shadow-md">
        {menuItems.map((item, index) => (
          <ContextMenuItem
            className={cn(
              "context-menu-item cursor-pointer px-3 py-2 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
              item.variant === "destructive"
                ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                : "text-[hsl(var(--context-foreground))] hover:bg-[hsl(var(--context-accent))] hover:text-[hsl(var(--context-accent-foreground))]",
              index !== menuItems.length - 1 && "border-[hsl(var(--context-border))] border-b"
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
