import type { LucideIcon } from "lucide-react"
import {
  ChevronRight,
  FilesIcon,
  FolderInputIcon,
  SearchIcon,
  SettingsIcon,
  Share2Icon,
} from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { FileExplorer } from "@/components/sidebar/file-explorer/FileExplorer"
import { FileExplorerActions } from "@/components/sidebar/file-explorer/FileExplorerActions"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarSeparator } from "@/components/ui/sidebar"
import { useFileTree } from "@/hooks/useFileTree"
import { cn } from "@/lib/utils"
import { type NavItem, useSidebarStore } from "@/stores/sidebar-store"

interface SidebarTabProps {
  id: NavItem
  icon: LucideIcon
}

interface SidebarTabsGroupProps {
  children: ReactNode
  position?: "top" | "bottom"
}

interface SidebarPanelProps {
  id: NavItem
  title: string
  children: ReactNode
  actions?: ReactNode
}

interface SidebarProps {
  projectTitle: string
}

interface SidebarTabButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  isActive?: boolean
}

const SidebarTabButton = ({ children, onClick, isActive = false }: SidebarTabButtonProps) => {
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

const SidebarTabs = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <nav className={cn("flex h-full w-14 flex-col justify-between bg-zinc-100 p-2")}>
        {children}
      </nav>
      <SidebarSeparator className="mx-0 bg-zinc-200" orientation="vertical" />
    </>
  )
}

const SidebarTabsGroup = ({ children, position = "top" }: SidebarTabsGroupProps) => {
  if (position === "bottom") {
    return <div className="flex flex-col gap-2">{children}</div>
  }
  return <div className="flex flex-col gap-2">{children}</div>
}

const SidebarTab = ({ id, icon: Icon }: SidebarTabProps) => {
  const { activePanel, setActivePanel } = useSidebarStore()

  const handleClick = () => {
    setActivePanel(id)
  }

  return (
    <SidebarTabButton isActive={activePanel === id} onClick={handleClick}>
      <Icon className="size-6" />
    </SidebarTabButton>
  )
}

const SidebarPanel = ({ id, title, actions, children }: SidebarPanelProps) => {
  const { activePanel, expandedPanel, setExpandedPanel } = useSidebarStore()

  const isExpanded = expandedPanel[id]

  if (activePanel !== id) {
    return null
  }

  return (
    <Collapsible
      className="group/collapsible flex h-full flex-1 flex-col"
      onOpenChange={expanded => setExpandedPanel(id, expanded)}
      open={isExpanded}
    >
      <div className="flex flex-col">
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex w-full cursor-pointer items-center justify-between border-zinc-200 border-b bg-zinc-50 px-3 py-2",
              "gap-1.5 font-medium text-sm hover:bg-zinc-100"
            )}
          >
            <div className="flex items-center gap-1.5">
              <ChevronRight className={cn("transition-transform", isExpanded && "rotate-90")} />
              <span className="truncate text-left uppercase">{title}</span>
            </div>

            {actions && <div className="flex items-center gap-1">{actions}</div>}
          </div>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="min-h-0 flex-1 overflow-auto">
        <ScrollArea className="h-full w-full">{children}</ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}

const PlaceholderPanel = ({ message }: { message: string }) => (
  <div className="p-4 text-gray-500">{message}</div>
)

/**
 * IDE 전체 사이드바를 관리하는 컴포넌트
 *
 * @param projectTitle - 파일 탐색기 패널에 표시될 프로젝트 제목
 *
 * @remarks
 * - 사이드바 탭들과 패널들의 전체 구성을 담당
 * - 재사용 가능한 Sidebar 컴포넌트들을 조합하여 IDE에 특화된 사이드바 구성
 */
export const Sidebar = ({ projectTitle }: SidebarProps) => {
  const fileTreeData = useFileTree()

  return (
    <div className="flex h-full">
      <SidebarTabs>
        <SidebarTabsGroup>
          <SidebarTab icon={FilesIcon} id="files" />
          <SidebarTab icon={SearchIcon} id="search" />
          <SidebarTab icon={Share2Icon} id="share" />
          <SidebarTab icon={FolderInputIcon} id="projects" />
        </SidebarTabsGroup>
        <SidebarTabsGroup position="bottom">
          <SidebarTab icon={SettingsIcon} id="settings" />
        </SidebarTabsGroup>
      </SidebarTabs>

      <div className="flex-1">
        <SidebarPanel
          actions={<FileExplorerActions {...fileTreeData} />}
          id="files"
          title={projectTitle}
        >
          <FileExplorer tree={fileTreeData.tree} />
        </SidebarPanel>
        <SidebarPanel id="search" title="Search">
          <PlaceholderPanel message="Search panel coming soon..." />
        </SidebarPanel>
        <SidebarPanel id="share" title="Share">
          <PlaceholderPanel message="Share panel coming soon..." />
        </SidebarPanel>
        <SidebarPanel id="projects" title="Projects">
          <PlaceholderPanel message="Projects panel coming soon..." />
        </SidebarPanel>
        <SidebarPanel id="settings" title="Settings">
          <PlaceholderPanel message="Settings panel coming soon..." />
        </SidebarPanel>
      </div>
    </div>
  )
}

Sidebar.Panel = SidebarPanel
Sidebar.Tab = SidebarTab
Sidebar.Tabs = SidebarTabs
Sidebar.TabsGroup = SidebarTabsGroup
