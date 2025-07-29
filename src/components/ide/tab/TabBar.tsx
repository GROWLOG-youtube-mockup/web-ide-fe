import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { useFileTabStore } from "@/stores/editor-file-store"

export const TabBar = () => {
  const { openTabs, activeTabId, switchTab, closeTab } = useFileTabStore()

  return (
    <div className="flex h-8">
      {openTabs.map(tab => (
        <div
          className={`flex w-[150px] items-center border-zinc-400 border-r-[3px] ${
            tab.filePath === activeTabId ? "bg-zinc-200" : "bg-neutral-50"
          }`}
          key={tab.filePath}
        >
          <button
            className="flex flex-1 items-center gap-[5px] px-2 py-1 text-left hover:bg-black/5"
            onClick={() => switchTab(tab.filePath)}
            type="button"
          >
            <LucideIcons.fileText className={`${ICON_SIZES.sm} text-black`} />
            <span className="font-medium text-black/80 text-sm">
              {tab.filePath.split("/").pop() || tab.filePath}
            </span>
          </button>
          <button
            className="flex-shrink-0 rounded-md p-2 hover:bg-black/10"
            onClick={() => closeTab(tab.filePath)}
            type="button"
          >
            <LucideIcons.x className={`${ICON_SIZES.sm} text-black`} />
          </button>
        </div>
      ))}
    </div>
  )
}
