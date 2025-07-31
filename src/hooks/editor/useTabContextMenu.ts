import { useMemo } from "react"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"
import type { ContextMenuItem } from "@/types/context-menu"
import { copyToClipboard } from "@/utils/context-menu"

export const useTabContextMenu = (filePath: string) => {
  const { closeFile, closeAllTabs, closeOtherTabs, closeTabsToTheRight } = useEditorTabsStore()

  const menuItems: ContextMenuItem[] = useMemo(() => {
    // Return empty array for invalid file paths to avoid unnecessary computation
    if (!filePath || filePath.trim() === "") {
      return []
    }

    return [
      {
        action: () => closeFile(filePath),
        label: "Close",
        variant: "destructive",
      },
      {
        action: () => closeOtherTabs(filePath),
        label: "Close Others",
        variant: "default",
      },
      {
        action: () => closeTabsToTheRight(filePath),
        label: "Close Tabs to the Right",
        variant: "default",
      },
      {
        action: () => closeAllTabs(),
        label: "Close All",
        variant: "destructive",
      },
      {
        action: async () => {
          const success = await copyToClipboard(filePath)
          if (!success) {
            // TODO: Show toast notification for copy failure
            console.error("Failed to copy path to clipboard")
          }
        },
        label: "Copy Path",
        variant: "default",
      },
    ]
  }, [filePath, closeFile, closeOtherTabs, closeTabsToTheRight, closeAllTabs])

  return { menuItems }
}
