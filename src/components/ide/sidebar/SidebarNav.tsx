import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

type NavItem = "files" | "search" | "share" | "folder" | "settings"

interface NavButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
}

const NavButton = ({ children, onClick, isActive = false }: NavButtonProps) => {
  return (
    <Button
      className={cn(
        "h-10 w-10 cursor-pointer bg-zinc-50 shadow-none",
        isActive && "bg-zinc-200",
        !isActive && "hover:bg-zinc-200"
      )}
      onClick={onClick}
      size="default"
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
export const SidebarNav = () => {
  const [activeNavItem, setActiveNavItem] = useState<NavItem>("files")

  const handleNavItemClick = (item: NavItem) => {
    setActiveNavItem(item)
    console.log(`${item} clicked`)
  }

  return (
    <nav
      className="flex w-14 flex-col justify-between bg-zinc-50 p-2"
      style={{ boxShadow: "inset -2px 0 0 0 rgb(161 161 170)" }}
    >
      <div className="flex flex-col gap-2">
        <NavButton isActive={activeNavItem === "files"} onClick={() => handleNavItemClick("files")}>
          <FilesIcon className="size-6" />
        </NavButton>
        <NavButton
          isActive={activeNavItem === "search"}
          onClick={() => handleNavItemClick("search")}
        >
          <SearchIcon className="size-6" />
        </NavButton>
        <NavButton isActive={activeNavItem === "share"} onClick={() => handleNavItemClick("share")}>
          <Share2Icon className="size-6" />
        </NavButton>
        <NavButton
          isActive={activeNavItem === "folder"}
          onClick={() => handleNavItemClick("folder")}
        >
          <FolderInputIcon className="size-6" />
        </NavButton>
      </div>

      <NavButton
        isActive={activeNavItem === "settings"}
        onClick={() => handleNavItemClick("settings")}
      >
        <SettingsIcon className="size-6" />
      </NavButton>
    </nav>
  )
}
