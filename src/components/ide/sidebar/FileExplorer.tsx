import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { FileExplorerHeader } from "@/components/ide/editor-part/FileExplorerHeader"
import { FileTree } from "@/components/ide/editor-part/FileTree"
import { useFileTree } from "@/hooks/useFileTree"

export const FileExplorer = () => {
  const { fileTree, loading, wsStatus, wsRef } = useFileTree()

  return (
    <div className="FileExplorer flex flex-1 flex-col bg-zinc-200">
      {/* Files Header */}

      <FileExplorerHeader wsStatus={wsStatus} />

      {/* File Tree */}
      <div className="filetree flex-1 px-1 py-2">
        <FileTree fileTree={fileTree} loading={loading} wsRef={wsRef} />
      </div>

      {/* Chat Header */}
      <div
        className="flex h-8 items-center bg-zinc-300 px-3 py-2"
        style={{
          boxShadow: "inset 0 2px 0 0 rgb(161 161 170), inset 0 -2px 0 0 rgb(161 161 170)",
        }}
      >
        <LucideIcons.chevronDown className={`${ICON_SIZES.lg} text-black`} />
        <span className="font-semibold text-black/80 text-sm">채팅방(3)</span>
      </div>
    </div>
  )
}
