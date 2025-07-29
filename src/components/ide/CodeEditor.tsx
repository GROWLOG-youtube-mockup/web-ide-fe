import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { EditorContainer } from "@/components/ide/editor-part/EditorContainer"
import { TabBar } from "@/components/ide/tab/TabBar"

export const CodeEditor = () => {
  return (
    <div className="flex flex-1 flex-col bg-zinc-300">
      {/* Tabs */}
      <TabBar />

      {/* File Content */}
      <EditorContainer />

      {/* Terminal Header */}
      <div className="flex h-6 items-center justify-center bg-zinc-500 px-3 py-2">
        <div className="flex h-8 items-center gap-2 rounded-lg bg-white/0 px-3">
          <LucideIcons.chevronUp className={`${ICON_SIZES.lg} text-white`} />
          <span className="font-bold text-lg text-white tracking-tight">터미널 열기</span>
        </div>
      </div>
    </div>
  )
}
