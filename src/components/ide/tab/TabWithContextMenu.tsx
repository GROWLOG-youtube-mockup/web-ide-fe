import type { ReactNode } from "react"
import { useMemo } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"
import { useFileTabStore } from "@/stores/editor-file-store"

interface TabWithContextMenuProps {
  filePath: string
  children: ReactNode
}

export const TabWithContextMenu = ({ filePath, children }: TabWithContextMenuProps) => {
  const { closeTab, closeAllTabs, closeOtherTabs, closeTabsToTheRight } = useFileTabStore()

  const menuItems = useMemo(
    () => [
      {
        action: () => closeTab(filePath),
        label: "Close",
        variant: "destructive" as const,
      },
      {
        action: () => closeOtherTabs(filePath),
        label: "Close Others",
        variant: "default" as const,
      },
      {
        action: () => closeTabsToTheRight(filePath),
        label: "Close Tabs to the Right",
        variant: "default" as const,
      },
      {
        action: () => closeAllTabs(),
        label: "Close All",
        variant: "destructive" as const,
      },
      {
        action: async () => {
          try {
            await navigator.clipboard.writeText(filePath)
            console.log("Path copied to clipboard")
          } catch (error) {
            console.error("Failed to copy path:", error)
          }
        },
        label: "Copy Path",
        variant: "default" as const,
      },
    ],
    [filePath, closeTab, closeOtherTabs, closeTabsToTheRight, closeAllTabs]
  )

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="context-menu border border-[hsl(var(--context-border))] bg-[hsl(var(--context-background))] shadow-md">
        {menuItems.map((item, index) => (
          <ContextMenuItem
            className={cn(
              "context-menu-item cursor-pointer px-3 py-2 text-[hsl(var(--context-foreground))] text-sm transition-colors duration-150 hover:bg-[hsl(var(--context-accent))] hover:text-[hsl(var(--context-accent-foreground))]",
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
