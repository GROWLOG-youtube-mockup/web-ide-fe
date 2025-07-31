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
      <ContextMenuContent className="context-menu border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-lg dark:border-[hsl(var(--border))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]">
        {menuItems.map((item, index) => (
          <ContextMenuItem
            className={cn(
              "context-menu-item cursor-pointer px-3 py-2 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-1",
              item.variant === "destructive"
                ? "text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive-foreground))] dark:text-[hsl(var(--destructive))] dark:hover:bg-[hsl(var(--destructive))] dark:hover:text-[hsl(var(--destructive-foreground))]"
                : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--accent))] dark:hover:text-[hsl(var(--accent-foreground))]",
              index !== menuItems.length - 1 && "border-[hsl(var(--border))] border-b"
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
