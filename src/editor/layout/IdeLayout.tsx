import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import { useParams } from "react-router-dom"
import { Chats } from "@/chat/chat/ChatsPanel"
import { CodeEditor } from "@/editor/ide/CodeEditor"
import { TopBar } from "@/editor/ide/TopBar"
import { FileExplorerActions } from "@/file-explorer/file-explorer/FileExplorerActions"
import { FileExplorer } from "@/file-explorer/file-explorer/FileExplorerPanel"
import { useFileTree } from "@/file-explorer/hooks/file-explorer/useFileTree"
import { SearchPanel } from "@/file-explorer/search/SearchPanel"
import { Invitations } from "@/invite/InvitationsPanel"
import { Members } from "@/invite/MembersPanel"
import { useProjectMembers } from "@/invite/permissions/useProjectMembers"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shared/ui/resizable"
import { SidebarPanel } from "@/sidebar/SidebarPanel"
import { SidebarPanels } from "@/sidebar/SidebarPanels"
import { SidebarTab } from "@/sidebar/SidebarTab"
import { SidebarTabs } from "@/sidebar/SidebarTabs"

const PlaceholderPanel = ({ message }: { message: string }) => (
  <div className="p-4 text-gray-500 text-sm">{message}</div>
)

/**
 * IDE 전체 레이아웃을 관리하는 최상위 컴포넌트
 *
 * @remarks
 * - TopBar와 리사이저블 패널(Sidebar + Editor)로 구성
 * - 사이드바와 에디터 영역의 크기를 자유롭게 조절 가능
 */
export const IdeLayout = () => {
  const projectTitle = "Project Title"
  const fileTreeData = useFileTree()
  const { projectId = "" } = useParams<{ projectId: string }>()
  const { data: members = [] } = useProjectMembers(projectId)
  const memberCount = members.length

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <main className="flex min-h-0 flex-1">
        <ResizablePanelGroup direction="horizontal">
          <SidebarTabs
            bottomTabs={[<SidebarTab icon={SettingsIcon} id="settings" key="settings" />]}
            topTabs={[
              <SidebarTab icon={FilesIcon} id="files" key="files" />,
              <SidebarTab icon={SearchIcon} id="search" key="search" />,
              <SidebarTab icon={Share2Icon} id="share" key="share" />,
              <SidebarTab icon={FolderInputIcon} id="projects" key="projects" />,
            ]}
          />

          <ResizablePanel defaultSize={35} maxSize={45} minSize={0}>
            <div className="flex h-full flex-col">
              <SidebarPanels
                bottomPanels={[
                  <SidebarPanel id="chats" key="chats" title="chats">
                    <Chats projectId={projectId} />
                  </SidebarPanel>,
                ]}
                tab="files"
                topPanels={[
                  <SidebarPanel
                    actions={
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
                    {fileTreeData.tree ? (
                      <FileExplorer tree={fileTreeData.tree} />
                    ) : (
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
          </ResizablePanel>

          <ResizableHandle className="bg-muted-foreground/20 transition-all duration-150 hover:scale-x-500 hover:bg-muted-foreground/40" />

          <ResizablePanel>
            <CodeEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
