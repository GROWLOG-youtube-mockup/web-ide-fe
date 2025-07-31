// components/tab/TabBar.tsx
import { useState } from "react"
import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { WithContextMenu } from "@/components/common/WithContextMenu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useTabContextMenu } from "@/hooks/editor/useTabContextMenu"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"
import "@/styles/global-tab.css"

export const TabBar = () => {
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
        <TabsList
          className="h-8 justify-start rounded-none bg-transparent p-0"
          onContextMenu={handleContextMenu}
        >
          {openedFiles.map(filePath => (
            <div className="relative flex" data-filepath={filePath} key={filePath}>
              <TabsTrigger
                className="tab-trigger relative flex h-8 w-[160px] items-center gap-2 rounded-none border-[hsl(var(--tab-border))] border-r px-2 py-1 pr-8 after:absolute after:top-0 after:right-0 after:left-0 after:z-10 after:h-1 after:bg-transparent after:content-[''] data-[state=active]:bg-[hsl(var(--tab-accent))] data-[state=active]:after:bg-[hsl(var(--tab-active-line))]"
                title={filePath}
                value={filePath}
              >
                <div className="flex min-w-0 flex-1 items-center gap-[5px]">
                  <LucideIcons.fileText
                    className={`${ICON_SIZES.sm} text-[hsl(var(--tab-foreground))]`}
                  />
                  <span className="truncate font-medium text-[hsl(var(--tab-foreground))]/80 text-sm">
                    {getFileName(filePath)}
                  </span>
                </div>
              </TabsTrigger>
              <button
                aria-label={`Close ${getFileName(filePath)}`}
                className="-translate-y-1/2 absolute top-1/2 right-1 z-30 flex-shrink-0 rounded-md p-1 transition-colors hover:text-red-400"
                onClick={e => {
                  e.stopPropagation()
                  handleCloseTab(filePath)
                }}
                type="button"
              >
                <LucideIcons.x
                  className={`${ICON_SIZES.sm} text-[hsl(var(--tab-foreground))] transition-colors hover:text-blue-400`}
                />
              </button>
            </div>
          ))}
        </TabsList>
      </WithContextMenu>
    </Tabs>
  )
}
