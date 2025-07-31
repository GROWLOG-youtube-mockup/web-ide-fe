import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import { FileExplorer } from "@/components/sidebar/file-explorer/FileExplorer"
import { FileExplorerActions } from "@/components/sidebar/file-explorer/FileExplorerActions"
import { SidebarPanel } from "@/components/sidebar/SidebarPanel"
import { SidebarTab } from "@/components/sidebar/SidebarTab"
import { SidebarTabs } from "@/components/sidebar/SidebarTabs"
import { SidebarTabsGroup } from "@/components/sidebar/SidebarTabsGroup"
import { InviteSidebar } from "@/components/sidebar/share/ShareSection"
import { useFileTree } from "@/hooks/file-explorer/useFileTree"

interface SidebarProps {
  projectTitle: string
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
          <InviteSidebar projectId="projectid" />
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
