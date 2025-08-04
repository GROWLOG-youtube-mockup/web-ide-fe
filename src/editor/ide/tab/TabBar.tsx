import { FileTextIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { useEditorTabsStore } from "@/backup/stores/editor-tabs-store"
import { useTabContextMenu } from "@/editor/hooks/editor/useTabContextMenu"
import { WithContextMenu } from "@/shared/common/WithContextMenu"
import { Tabs, TabsList, TabsTrigger } from "@/shared/custom-tabs"
import { cn } from "@/shared/utils"

export const TabBar = () => {
  const closeButtonStyles = cn(
    "-translate-y-1/2 absolute top-1/2 right-1 z-30 flex-shrink-0",
    "rounded-md p-1 transition-colors hover:text-red-400"
  )

  const iconStyles = cn(
    "w-4 h-4",
    "text-[var(--tab-foreground)] transition-colors hover:text-blue-400"
  )

  const {
    openedFiles,
    activeFile,
    setActiveFile: handleSetActiveFile,
    closeTab: handleCloseTab,
  } = useEditorTabsStore()

  const [contextMenuFilePath, setContextMenuFilePath] = useState<string | null>(null)
  const { menuItems } = useTabContextMenu(contextMenuFilePath || "")

  const getFileName = (filePath: string): string => {
    return filePath.split("/").pop() || filePath
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    const tabElement = (e.target as Element).closest("[data-filepath]")
    if (tabElement) {
      const filePath = tabElement.getAttribute("data-filepath")
      setContextMenuFilePath(filePath)
    }
  }

  return (
    <Tabs className="w-full" onValueChange={handleSetActiveFile} value={activeFile || undefined}>
      <WithContextMenu menuItems={menuItems}>
        <TabsList onContextMenu={handleContextMenu} variant="editor">
          {openedFiles.map(filePath => (
            <div className="relative flex" data-filepath={filePath} key={filePath}>
              <TabsTrigger title={filePath} value={filePath} variant="editor">
                <div className="flex min-w-0 flex-1 items-center gap-[5px]">
                  <FileTextIcon className={`h-4 w-4 text-[var(--tab-foreground)]`} />
                  <span className="truncate font-medium text-[var(--tab-foreground)]/80 text-sm">
                    {getFileName(filePath)}
                  </span>
                </div>
              </TabsTrigger>
              <button
                aria-label={`Close ${getFileName(filePath)}`}
                className={closeButtonStyles}
                onClick={e => {
                  e.stopPropagation()
                  handleCloseTab(filePath)
                }}
                type="button"
              >
                <XIcon className={iconStyles} />
              </button>
            </div>
          ))}
        </TabsList>
      </WithContextMenu>
    </Tabs>
  )
}
