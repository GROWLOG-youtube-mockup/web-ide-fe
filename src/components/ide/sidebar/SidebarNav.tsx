import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { NavItem } from "../../../stores/sidebar-store"

interface SidebarNavProps {
  activeView: NavItem
  onViewChange: (view: NavItem) => void
}

interface NavButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
}

const NavButton = ({ children, onClick, isActive = false }: NavButtonProps) => {
  return (
    <Button
      className={cn(
        "h-10 w-10 cursor-pointer bg-transparent shadow-none",
        isActive && "bg-zinc-200",
        !isActive && "hover:bg-zinc-200"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

/**
 * IDE 사이드바를 위한 네비게이션 패널 컴포넌트
 *
 * 파일 탐색기, 검색, 공유, 설정과 같은 다양한 IDE 기능을 위한 액션 버튼들을 포함합니다.
 * 상단에 주요 액션들, 하단에 보조 액션들을 배치하는 수직 레이아웃을 사용합니다.
 */
export const SidebarNav = ({ activeView, onViewChange }: SidebarNavProps) => {
  const handleNavItemClick = (item: NavItem) => {
    onViewChange(item)
  }

  return (
    <>
      <nav className="flex w-14 flex-col justify-between bg-zinc-100 p-2">
        <div className="flex flex-col gap-2">
          <NavButton isActive={activeView === "files"} onClick={() => handleNavItemClick("files")}>
            <FilesIcon className="size-6" />
          </NavButton>
          <NavButton
            isActive={activeView === "search"}
            onClick={() => handleNavItemClick("search")}
          >
            <SearchIcon className="size-6" />
          </NavButton>
          <NavButton isActive={activeView === "share"} onClick={() => handleNavItemClick("share")}>
            <Share2Icon className="size-6" />
          </NavButton>
          <NavButton
            isActive={activeView === "folder"}
            onClick={() => handleNavItemClick("folder")}
          >
            <FolderInputIcon className="size-6" />
          </NavButton>
        </div>

        <NavButton
          isActive={activeView === "settings"}
          onClick={() => handleNavItemClick("settings")}
        >
          <SettingsIcon className="size-6" />
        </NavButton>
      </nav>

      <Separator className="bg-zinc-200" orientation="vertical" />
    </>
  )
}
