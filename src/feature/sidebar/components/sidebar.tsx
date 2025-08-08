import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import { useParams } from "react-router-dom" // ":projectId" 부분을 가져옴
import { Chats } from "@/feature/chat/components/chats-panel"
import { FileExplorerActions } from "@/feature/file-explorer/components/file-explorer-actions"
import { FileExplorer } from "@/feature/file-explorer/components/file-explorer-panel"
import { SearchPanel } from "@/feature/file-explorer/components/search-panel" //검색창
import { useFileTree } from "@/feature/file-explorer/hooks/use-file-tree"
import { Invitations } from "@/feature/members/components/invitations-panel"
import { Members } from "@/feature/members/components/members-panel"
import { useProjectMembers } from "@/feature/members/stores/use-project-members" // 멤버수
import { SidebarPanel } from "@/feature/sidebar/components/sidebar-panel"
import { SidebarPanels } from "@/feature/sidebar/components/sidebar-panels"
import { SidebarTab } from "@/feature/sidebar/components/sidebar-tab"
import { SidebarTabs } from "@/feature/sidebar/components/sidebar-tabs"

interface SidebarProps {
  projectTitle: string
}

const PlaceholderPanel = ({ message }: { message: string }) => (
  <div className="p-4 text-gray-500 text-sm">{message}</div>
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
  const { projectId = "" } = useParams<{ projectId: string }>() // URL에서 projectId 추출
  const { data: members = [] } = useProjectMembers(projectId) //멤버 수 가져오기
  const memberCount = members.length // 실제 멤버 수

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
              <Chats projectId={projectId} />
            </SidebarPanel>,
          ]}
          tab="files"
          topPanels={[
            // 항상 SidebarPanel을 렌더링하도록 수정
            <SidebarPanel
              actions={
                // FileExplorerActions는 항상 렌더링하되, tree가 null일 수 있음을 전달
                <FileExplorerActions
                  tree={fileTreeData.tree}
                  collapseAll={fileTreeData.collapseAll}
                  expandAll={fileTreeData.expandAll}
                  startRenaming={fileTreeData.startRenaming}
                />
              }
              id="files"
              key="files"
              title={projectTitle}
            >
              {/* tree가 있을 때만 FileExplorer를 렌더링 */}
              {fileTreeData.tree ? (
                <FileExplorer tree={fileTreeData.tree} />
              ) : (
                // tree가 없으면 사용자에게 안내 메시지 표시
                <PlaceholderPanel message="Project is empty. Create a file or folder." />
              )}
            </SidebarPanel>,
          ]}
        />

        <SidebarPanels
          tab="search"
          topPanels={[
            <SidebarPanel id="search" key="search" title="Search">
              {fileTreeData.tree ? (
                <SearchPanel tree={fileTreeData.tree} />
              ) : (
                <PlaceholderPanel message="Loading file tree..." />
              )}
            </SidebarPanel>,
          ]}
        />

        <SidebarPanels
          bottomPanels={[
            <SidebarPanel countBadge={memberCount} id="members" key="members" title="members">
              <Members projectId={projectId} />
            </SidebarPanel>,
          ]}
          tab="share"
          topPanels={[
            <SidebarPanel id="invitations" key="invitations" title="invitations">
              <Invitations projectId={projectId} />
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
              <Chats projectId={projectId} />
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
