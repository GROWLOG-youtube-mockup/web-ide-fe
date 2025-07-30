// components/tab/TabBar.tsx
import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useEditorTabsStore } from "@/stores/editor-tabs-store"
import { TabWithContextMenu } from "./TabWithContextMenu"
import "@/styles/global-tab.css"

export const TabBar = () => {
  // ✅ 변경된 부분: 탐색기 스토어 기준으로 이름 변경
  const { openedFiles, activeFile, setActiveFile, closeFile } = useEditorTabsStore()

  return (
    <Tabs
      className="w-full"
      onValueChange={setActiveFile} // ✅ switchTab → setActiveFile
      value={activeFile || undefined} // ✅ activeTabId → activeFile
    >
      <TabsList className="h-8 justify-start rounded-none bg-transparent p-0">
        {openedFiles.map(
          (
            filePath // ✅ openTabs → openedFiles, tab.filePath → filePath
          ) => (
            <div className="relative flex" key={filePath}>
              <TabWithContextMenu filePath={filePath}>
                {" "}
                {/* ✅ tab.filePath → filePath */}
                <TabsTrigger
                  className="tab-trigger relative flex h-8 w-[160px] items-center gap-2 rounded-none border-[hsl(var(--tab-border))] border-r px-2 py-1 pr-8 after:absolute after:top-0 after:right-0 after:left-0 after:z-10 after:h-1 after:bg-transparent after:content-[''] data-[state=active]:bg-[hsl(var(--tab-accent))] data-[state=active]:after:bg-[hsl(var(--tab-active-line))]"
                  title={filePath} // ✅ tab.filePath → filePath
                  value={filePath} // ✅ tab.filePath → filePath
                >
                  <div className="flex min-w-0 flex-1 items-center gap-[5px]">
                    <LucideIcons.fileText
                      className={`${ICON_SIZES.sm} text-[hsl(var(--tab-foreground))]`}
                    />
                    <span className="truncate font-medium text-[hsl(var(--tab-foreground))]/80 text-sm">
                      {filePath.split("/").pop() || filePath} {/* ✅ tab.filePath → filePath */}
                    </span>
                  </div>
                </TabsTrigger>
              </TabWithContextMenu>
              <button
                aria-label={`Close ${filePath}`}
                className="-translate-y-1/2 absolute top-1/2 right-1 z-30 flex-shrink-0 rounded-md p-1 transition-colors hover:text-red-400"
                onClick={e => {
                  e.stopPropagation()
                  closeFile(filePath)
                }}
                type="button"
              >
                <LucideIcons.x
                  className={`${ICON_SIZES.sm} text-[hsl(var(--tab-foreground))] transition-colors hover:text-blue-400`}
                />
              </button>
            </div>
          )
        )}
      </TabsList>
    </Tabs>
  )
}
