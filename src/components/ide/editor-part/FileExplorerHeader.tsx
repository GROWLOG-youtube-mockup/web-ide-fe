// components/Editor/FileExplorerHeader.tsx
import { FigmaIcons, ICON_SIZES, LucideIcons } from "@/assets/icons"

interface Props {
  wsStatus: "connecting" | "connected" | "disconnected"
}

export function FileExplorerHeader({ wsStatus }: Props) {
  const getStatusDisplay = () => {
    switch (wsStatus) {
      case "connecting":
        return "🔄 연결중..."
      case "connected":
        return "🟢 연결됨"
      case "disconnected":
        return "🔴 연결끊김"
    }
  }

  return (
    <div
      className="filetreeheader flex h-8 items-center justify-between bg-zinc-300 px-1 py-2"
      style={{ boxShadow: "inset 0 -2px 0 0 rgb(161 161 170)" }}
    >
      <div className="flex items-center">
        <LucideIcons.chevronDown className={`${ICON_SIZES.xl} text-zinc-800`} />
        <span className="font-semibold text-sm text-zinc-800">MONACO</span>
        <span className="ml-2 text-xs text-zinc-600">{getStatusDisplay()}</span>
      </div>
      <div className="flex gap-2">
        <LucideIcons.plus className={`${ICON_SIZES.sm} text-zinc-600`} />
        <img
          alt="폴더 추가"
          className={`${ICON_SIZES.sm} text-zinc-600`}
          src={FigmaIcons.addFolder1}
        />
        <LucideIcons.refreshCw className={`${ICON_SIZES.sm} text-zinc-600`} />
      </div>
    </div>
  )
}
