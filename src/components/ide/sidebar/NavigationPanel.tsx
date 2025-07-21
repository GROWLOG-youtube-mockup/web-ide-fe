import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import type { ReactNode } from "react"
import { ICON_SIZES } from "@/assets/icons"
import { cn } from "@/lib/utils"

const ActionItem = ({
  iconSize = ICON_SIZES.md,
  children,
}: {
  iconSize?: string
  children: ReactNode
}) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-center rounded p-2 transition-colors hover:bg-zinc-200",
        iconSize
      )}
    >
      {children}
    </div>
  )
}

export const NavigationPanel = () => {
  return (
    <div
      className="flex flex-col justify-between bg-zinc-50 p-2"
      style={{ boxShadow: "inset -2px 0 0 0 rgb(161 161 170)" }}
    >
      <div className="flex flex-col gap-2">
        {/* Top Links */}
        <ActionItem>
          <FilesIcon />
        </ActionItem>
        <ActionItem>
          <SearchIcon />
        </ActionItem>
        <ActionItem>
          <Share2Icon />
        </ActionItem>
        <ActionItem>
          <FolderInputIcon />
        </ActionItem>
      </div>

      {/* Bottom Links */}
      <ActionItem>
        <SettingsIcon />
      </ActionItem>
    </div>
  )
}
