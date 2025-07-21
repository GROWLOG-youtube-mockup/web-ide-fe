import { FigmaIcons, ICON_SIZES, LucideIcons } from "@/assets/icons"

export const NavigationPanel = () => {
  return (
    <div className="flex w-[46px] flex-col justify-between border-zinc-400 border-r-2 bg-zinc-200 px-2 py-4">
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

        {/* Folder Input Icon - Figma (특수 아이콘) */}
        <div className="flex items-center justify-center">
          <img
            alt="폴더 입력"
            className={`${ICON_SIZES.lg} text-zinc-600`}
            src={FigmaIcons.folderInput1}
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
