import { useMemo } from "react"
import { useEditorTabsStore } from "@/backup/stores/editor-tabs-store"
import type { ContextMenuItem } from "@/backup/types/context-menu"
import { copyToClipboard } from "@/backup/utils/context-menu"

export const useTabContextMenu = (filePath: string) => {
  const {
    closeTab: handleCloseTab,
    closeAllTabs: handleCloseAllTabs,
    closeOtherTabs: handleCloseOtherTabs,
    closeTabsToTheRight: handleCloseTabsToTheRight,
  } = useEditorTabsStore()

  const menuItems: ContextMenuItem[] = useMemo(() => {
    if (!filePath || filePath.trim() === "") {
      return []
    }

    return [
      {
        action: () => handleCloseTab(filePath),
        label: "Close",
        variant: "destructive",
      },
      {
        action: () => handleCloseOtherTabs(filePath),
        label: "Close Others",
        variant: "default",
      },
      {
        action: () => handleCloseTabsToTheRight(filePath),
        label: "Close Tabs to the Right",
        variant: "default",
      },
      {
        action: () => handleCloseAllTabs(),
        label: "Close All",
        variant: "destructive",
      },
      {
        action: async () => {
          const success = await copyToClipboard(filePath)
          if (!success) {
            console.error("Failed to copy path to clipboard")
          }
        },
        label: "Copy Path",
        variant: "default",
      },
    ]
  }, [
    filePath,
    handleCloseTab,
    handleCloseAllTabs,
    handleCloseOtherTabs,
    handleCloseTabsToTheRight,
  ])

  return { menuItems }
}
