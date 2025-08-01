import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import { Chats } from "@/components/sidebar/chat/Chats"
import { FileExplorer } from "@/components/sidebar/file-explorer/FileExplorer"
import { FileExplorerActions } from "@/components/sidebar/file-explorer/FileExplorerActions"
import { SidebarPanel } from "@/components/sidebar/SidebarPanel"
import { SidebarPanels } from "@/components/sidebar/SidebarPanels"
import { SidebarTab } from "@/components/sidebar/SidebarTab"
import { SidebarTabs } from "@/components/sidebar/SidebarTabs"
import { Invitations } from "@/components/sidebar/share/Invitations"
import { Members } from "@/components/sidebar/share/Members"
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
      <SidebarTabs
        bottomTabs={[<SidebarTab icon={SettingsIcon} id="settings" key="settings" />]}
        topTabs={[
          <SidebarTab icon={FilesIcon} id="files" key="files" />,
          <SidebarTab icon={SearchIcon} id="search" key="search" />,
          <SidebarTab icon={Share2Icon} id="share" key="share" />,
          <SidebarTab icon={FolderInputIcon} id="projects" key="projects" />,
        ]}
      />

      <div className="flex flex-1 flex-col">
        <SidebarPanels
          bottomPanels={[
            <SidebarPanel id="chats" key="chats" title="chats">
              <PlaceholderPanel message="Chat panel coming soon..." />
            </SidebarPanel>,
          ]}
          tab="files"
          topPanels={[
            <SidebarPanel
              actions={<FileExplorerActions {...fileTreeData} />}
              id="files"
              key="files-tree"
              title={projectTitle}
            >
              <FileExplorer tree={fileTreeData.tree} />
            </SidebarPanel>,
          ]}
        />

        <SidebarPanels
          tab="search"
          topPanels={[
            <SidebarPanel id="search" key="search" title="search">
              <PlaceholderPanel message="Search panel coming soon..." />
            </SidebarPanel>,
          ]}
        />

        <SidebarPanels
          bottomPanels={[
            <SidebarPanel countBadge={30} id="members" key="members" title="members">
              <Members projectId={"3"} />
            </SidebarPanel>,
          ]}
          tab="share"
          topPanels={[
            <SidebarPanel id="invitations" key="invitations" title="invitations">
              <Invitations projectId={"3"} />
            </SidebarPanel>,
          ]}
        />

        <SidebarPanels
          tab="projects"
          topPanels={[
            <SidebarPanel id="projects" key="projects" title="projects">
              <PlaceholderPanel message="Projects panel coming soon..." />
            </SidebarPanel>,
          ]}
          bottomPanels={[
            <SidebarPanel id="chats" key="chats" title="chats">
              <Chats />
            </SidebarPanel>,
          ]}
        />

        <SidebarPanels
          tab="settings"
          topPanels={[
            <SidebarPanel id="settings" key="settings" title="settings">
              <PlaceholderPanel message="Settings panel coming soon..." />
            </SidebarPanel>,
          ]}
        />
      </div>
    </div>
  )
}

Sidebar.Panel = SidebarPanel
Sidebar.Tab = SidebarTab
Sidebar.Tabs = SidebarTabs
