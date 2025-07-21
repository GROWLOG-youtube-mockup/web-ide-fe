import { FigmaIcons, ICON_SIZES, LucideIcons } from "@/assets/icons"

export const FileExplorer = () => {
  return (
    <div className="flex flex-1 flex-col bg-zinc-200">
      {/* Files Header */}
      <div
        className="flex h-8 items-center justify-between bg-zinc-300 px-1 py-2"
        style={{ boxShadow: "inset 0 -2px 0 0 rgb(161 161 170)" }}
      >
        <div className="flex items-center">
          <LucideIcons.chevronDown className={`${ICON_SIZES.xl} text-zinc-800`} />
          <span className="font-semibold text-sm text-zinc-800">MONACO</span>
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

      {/* File Tree */}
      <div className="flex-1 px-1 py-2">
        <div className="space-y-1">
          {/* Level 1 */}
          <div className="space-y-1">
            <div className="flex items-center pl-1">
              <LucideIcons.chevronRight className={`${ICON_SIZES.lg} text-black`} />
              <LucideIcons.folder className={`${ICON_SIZES.sm} mr-1 text-black`} />
              <span className="text-base text-black/80">test</span>
            </div>

            <div className="flex items-center pl-1">
              <LucideIcons.chevronDown className={`${ICON_SIZES.lg} text-black`} />
              <LucideIcons.folderOpen className={`${ICON_SIZES.sm} mr-1 text-black`} />
              <span className="text-base text-black/80">test</span>
            </div>
          </div>

          {/* Level 2 - Nested */}
          <div className="space-y-1 pl-4" style={{ borderLeft: "2px solid rgb(161 161 170)" }}>
            <div className="flex items-center pl-1">
              <LucideIcons.chevronRight className={`${ICON_SIZES.lg} text-black`} />
              <LucideIcons.folder className={`${ICON_SIZES.sm} mr-1 text-black`} />
              <span className="text-base text-black/80">test</span>
            </div>

            <div className="flex items-center pl-1">
              <LucideIcons.chevronDown className={`${ICON_SIZES.lg} text-black`} />
              <LucideIcons.folderOpen className={`${ICON_SIZES.sm} mr-1 text-black`} />
              <span className="text-base text-black/80">test</span>
            </div>

            {/* Level 3 - More nested */}
            <div className="space-y-1 pl-4" style={{ borderLeft: "2px solid rgb(161 161 170)" }}>
              <div className="flex items-center pl-1">
                <LucideIcons.chevronRight className={`${ICON_SIZES.lg} text-black`} />
                <LucideIcons.folder className={`${ICON_SIZES.sm} mr-1 text-black`} />
                <span className="text-base text-black/80">test</span>
              </div>

              <div className="flex items-center pl-1">
                <div className="h-6 w-6 border border-black/80 border-dashed"></div>
                <LucideIcons.fileText className={`${ICON_SIZES.sm} mr-1 text-black`} />
                <span className="text-base text-black/80">test</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Header */}
      <div
        className="flex h-8 items-center bg-zinc-300 px-3 py-2"
        style={{ boxShadow: "inset 0 2px 0 0 rgb(161 161 170), inset 0 -2px 0 0 rgb(161 161 170)" }}
      >
        <LucideIcons.chevronDown className={`${ICON_SIZES.lg} text-black`} />
        <span className="font-semibold text-black/80 text-sm">채팅방(3)</span>
      </div>
    </div>
  )
}
