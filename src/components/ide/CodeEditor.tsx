import { ICON_SIZES, LucideIcons } from "@/assets/icons"

interface CodeEditorProps {
  content?: string
}

export const CodeEditor = ({ content = "hello world" }: CodeEditorProps) => {
  return (
    <div className="flex flex-1 flex-col bg-zinc-300">
      {/* Tabs */}
      <div className="flex h-8">
        <div className="flex w-[150px] items-center justify-between border-zinc-400 border-r-[3px] bg-zinc-200 px-2">
          <div className="flex items-center gap-[5px]">
            <LucideIcons.fileText className={`${ICON_SIZES.sm} text-black`} />
            <span className="font-medium text-black/80 text-sm">index.html</span>
          </div>
          <button aria-label="탭 닫기" className="rounded-md p-2" type="button">
            <LucideIcons.x className={`${ICON_SIZES.sm} text-black`} />
          </button>
        </div>

        <div className="flex w-[150px] items-center justify-between border-zinc-400 border-r-[3px] bg-neutral-50 px-2">
          <div className="flex items-center gap-[5px]">
            <LucideIcons.fileText className={`${ICON_SIZES.sm} text-black`} />
            <span className="font-medium text-black/80 text-sm">index.html</span>
          </div>
          <button aria-label="탭 닫기" className="rounded-md p-2" type="button">
            <LucideIcons.x className={`${ICON_SIZES.sm} text-black`} />
          </button>
        </div>
      </div>

      {/* File Content */}
      <div className="flex-1 bg-neutral-50 px-[34px] py-2.5">
        <div className="font-medium text-base text-black tracking-tight">{content}</div>
      </div>

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
