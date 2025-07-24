// CodeEditor.tsx

import { ICON_SIZES, LucideIcons } from "@/assets/icons"
import { SplitEditorContainer } from "@/components/ide/editor-part/SplitEditorContainer"
export const CodeEditor = () => {
  // 🎯 에디터 화면 전체 단축키 관리
  return (
    <div className="codeeditor-main flex h-screen flex-1">
      <div className="texteditor flex flex-1 flex-col bg-zinc-300">
        <div className="flex flex-1 flex-col">
          <SplitEditorContainer />
          {/* 터미널 헤더 */}
          <div className="flex h-6 items-center justify-center bg-zinc-500 px-3 py-2">
            <div className="flex h-8 items-center gap-2 rounded-lg bg-white/0 px-3">
              <LucideIcons.chevronUp className={`${ICON_SIZES.lg} text-white`} />
              <span className="font-bold text-lg text-white tracking-tight">터미널 열기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
