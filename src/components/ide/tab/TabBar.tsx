// components/tab/TabBar.tsx
import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useFileTabStore } from "@/stores/editor-file-store"
import { TabWithContextMenu } from "./TabWithContextMenu"
import "@/styles/global-tab.css"

export const TabBar = () => {
  const { openTabs, activeTabId, switchTab, closeTab } = useFileTabStore()

  return (
    <Tabs className="w-full" onValueChange={switchTab} value={activeTabId || undefined}>
      <TabsList className="h-8 justify-start rounded-none bg-transparent p-0">
        {openTabs.map(tab => (
          <div className="relative flex" key={tab.filePath}>
            <TabWithContextMenu filePath={tab.filePath}>
              <TabsTrigger
                className="tab-trigger relative flex h-8 w-[160px] items-center gap-2 rounded-none border-[hsl(var(--tab-border))] border-r px-2 py-1 pr-8 after:absolute after:top-0 after:right-0 after:left-0 after:h-1 after:bg-transparent after:content-[''] data-[state=active]:bg-[hsl(var(--tab-accent))] data-[state=active]:after:bg-[hsl(var(--tab-active-line))]"
                title={tab.filePath}
                value={tab.filePath}
              >
                <div className="flex min-w-0 flex-1 items-center gap-[5px]">
                  <LucideIcons.fileText
                    className={`${ICON_SIZES.sm} text-[hsl(var(--tab-foreground))]`}
                  />
                  <span className="truncate font-medium text-[hsl(var(--tab-foreground))]/80 text-sm">
                    {tab.filePath.split("/").pop() || tab.filePath}
                  </span>
                </div>
              </TabsTrigger>
            </TabWithContextMenu>
            <button
              aria-label={`Close ${tab.filePath}`}
              className="-translate-y-1/2 absolute top-1/2 right-1 z-10 flex-shrink-0 rounded-md p-1 hover:bg-[hsl(var(--tab-accent))]"
              onClick={e => {
                e.stopPropagation()
                closeTab(tab.filePath)
              }}
              type="button"
            >
              <LucideIcons.x className={`${ICON_SIZES.sm} text-[hsl(var(--tab-foreground))]`} />
            </button>
          </div>
        ))}
      </TabsList>
    </Tabs>
  )
}
