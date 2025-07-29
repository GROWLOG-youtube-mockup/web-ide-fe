import { FigmaIcons, ICON_SIZES, LucideIcons } from "@/assets/icons"

interface TopBarProps {
  serviceName?: string
}

export const TopBar = ({ serviceName = "Growlog IDE" }: TopBarProps) => {
  const LogOutIcon = LucideIcons.logOut

  return (
    <div
      className="flex h-[50px] items-center bg-zinc-200"
      style={{ boxShadow: "inset 0 -2px 0 0 rgb(161 161 170)" }}
    >
      <div className="flex w-full items-center justify-between px-4 py-1">
        {/* Logo and Menu */}
        <div className="flex items-center gap-3">
          <div className="font-semibold text-black/80 text-xl tracking-tight">{serviceName}</div>
          <div className="flex rounded-md bg-zinc-200 px-[5px] py-1">
            <div className="px-3 py-1.5 font-medium text-black/70 text-sm">파일(F)</div>
            <div className="px-3 py-1.5 font-medium text-black/70 text-sm">편집(E)</div>
            <div className="rounded bg-zinc-300 px-3 py-1.5 font-medium text-black/70 text-sm">
              보기(V)
            </div>
            <div className="px-3 py-1.5 font-medium text-black/70 text-sm">도움말(H)</div>
          </div>
        </div>

        {/* User and Settings */}
        <div className="flex items-center gap-3">
          {/* User Icons */}
          <div className="flex items-center">
            <div className="-space-x-2 flex">
              <img
                alt="사용자 아바타"
                className="h-8 w-8 rounded-full border-2 border-white"
                src={FigmaIcons.avatar}
              />
              <img
                alt="사용자 아바타"
                className="h-8 w-8 rounded-full border-2 border-white"
                src={FigmaIcons.avatar}
              />
              <img
                alt="사용자 아바타"
                className="h-8 w-8 rounded-full border-2 border-white"
                src={FigmaIcons.avatar}
              />
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-500 font-medium text-sm text-white">
                +3
              </div>
            </div>
            <img
              alt="현재 사용자 아바타"
              className="ml-3 h-8 w-8 rounded-full"
              src={FigmaIcons.avatar}
            />
          </div>

          {/* Exit Button */}
          <button
            className="flex items-center gap-2 rounded-md bg-zinc-600 px-4 py-1 font-medium text-sm text-white"
            type="button"
          >
            <LogOutIcon className={ICON_SIZES.sm} />
            프로젝트 나가기
          </button>
        </div>
      </div>
    </div>
  )
}
