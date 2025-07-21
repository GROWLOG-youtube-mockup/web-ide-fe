import { FigmaIcons, ICON_SIZES, LucideIcons } from "@/assets/icons"

export const NavigationPanel = () => {
  return (
    <div
      className="flex w-[46px] flex-col justify-between bg-zinc-200 px-2 py-4"
      style={{ boxShadow: "inset -2px 0 0 0 rgb(161 161 170)" }}
    >
      <div className="flex flex-col gap-6">
        {/* Files Icon - Lucide React */}
        <div className="flex items-center justify-center">
          <LucideIcons.files className={`${ICON_SIZES.lg} text-zinc-600`} />
        </div>

        {/* Search Icon - Lucide React */}
        <div className="flex items-center justify-center">
          <LucideIcons.search className={`${ICON_SIZES.lg} text-zinc-600`} />
        </div>

        {/* Live Share Icon - Figma (특수 아이콘) */}
        <div className="flex items-center justify-center">
          <img
            alt="라이브 공유"
            className={`${ICON_SIZES.lg} text-zinc-600`}
            src={FigmaIcons.liveShare}
          />
        </div>

        {/* Folder Input Icon - 합쳐진 아이콘 */}
        <div className="flex items-center justify-center">
          <img
            alt="프로젝트 목록"
            className={`${ICON_SIZES.lg} text-zinc-600`}
            src={FigmaIcons.folderInputMerged}
          />
        </div>
      </div>

      {/* Settings Icon - Lucide React */}
      <div className="flex items-center justify-center">
        <LucideIcons.settings className={`${ICON_SIZES.lg} text-zinc-600`} />
      </div>
    </div>
  )
}
