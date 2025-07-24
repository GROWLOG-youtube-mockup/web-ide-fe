import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import { useCallback } from "react"
import { CodeEditor } from "@/components/ide/CodeEditor"
import { FileExplorerTree } from "@/components/ide/sidebar/file-explorer/FileExplorerTree"
import { Sidebar } from "@/components/ide/sidebar/Sidebar"
import { TopBar } from "@/components/ide/TopBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { mockFileTree } from "@/data/mock-file-tree"

const PlaceholderPanel = ({ message }: { message: string }) => (
  <div className="p-4 text-gray-500">{message}</div>
)

export const IdeLayout = () => {
  const projectTitle = "Project Title"

  const handleFileClick = useCallback((path: string) => {
    console.log("File clicked:", path)
    // TODO: 파일 열기 로직 추가
  }, [])

  return (
    <div className="flex h-screen w-full flex-col">
      <TopBar />
      <main className="flex flex-1">
        <Sidebar.Root>
          <Sidebar.Nav>
            <Sidebar.NavGroup>
              <Sidebar.NavItem icon={FilesIcon} id="files" />
              <Sidebar.NavItem icon={SearchIcon} id="search" />
              <Sidebar.NavItem icon={Share2Icon} id="share" />
              <Sidebar.NavItem icon={FolderInputIcon} id="folder" />
            </Sidebar.NavGroup>
            <Sidebar.NavGroup position="bottom">
              <Sidebar.NavItem icon={SettingsIcon} id="settings" />
            </Sidebar.NavGroup>
          </Sidebar.Nav>

          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} maxSize={45} minSize={0}>
              <Sidebar.Content>
                <Sidebar.Panel defaultExpanded={true} id="files" title={projectTitle}>
                  <FileExplorerTree nodes={mockFileTree} onFileClick={handleFileClick} />
                </Sidebar.Panel>

                <Sidebar.Panel id="search" title="Search">
                  {/* TODO: 검색 패널 구현 */}
                  <PlaceholderPanel message="Search panel coming soon..." />
                </Sidebar.Panel>

                <Sidebar.Panel id="share" title="Share">
                  {/* TODO: 공유 패널 구현 */}
                  <PlaceholderPanel message="Share panel coming soon..." />
                </Sidebar.Panel>

                <Sidebar.Panel id="folder" title="Folder">
                  {/* TODO: 폴더 패널 구현 */}
                  <PlaceholderPanel message="Folder panel coming soon..." />
                </Sidebar.Panel>

                <Sidebar.Panel id="settings" title="Settings">
                  {/* TODO: 설정 패널 구현 */}
                  <PlaceholderPanel message="Settings panel coming soon..." />
                </Sidebar.Panel>
              </Sidebar.Content>
            </ResizablePanel>

            <ResizableHandle className="bg-zinc-200 transition-all duration-150 hover:scale-x-500 hover:bg-zinc-300" />

            <ResizablePanel>
              <CodeEditor />
            </ResizablePanel>
          </ResizablePanelGroup>
        </Sidebar.Root>
      </main>
    </div>
  )
}
