import { FilesIcon, FolderInputIcon, SearchIcon, SettingsIcon, Share2Icon } from "lucide-react"
import { CodeEditor } from "@/components/ide/CodeEditor"
import { FileExplorer } from "@/components/ide/sidebar/file-explorer/FileExplorer"
import { Sidebar } from "@/components/ide/sidebar/Sidebar"
import { TopBar } from "@/components/ide/TopBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { mockFileTree } from "@/data/mock-file-tree"

const PlaceholderPanel = ({ message }: { message: string }) => (
  <div className="p-4 text-gray-500">{message}</div>
)

export const IdeLayout = () => {
  const projectTitle = "Project Title"

  return (
    <div className="flex h-screen w-full flex-col">
      <TopBar />
      <main className="flex flex-1">
        <Sidebar.Tabs>
          <Sidebar.TabsGroup>
            <Sidebar.Tab icon={FilesIcon} id="files" />
            <Sidebar.Tab icon={SearchIcon} id="search" />
            <Sidebar.Tab icon={Share2Icon} id="share" />
            <Sidebar.Tab icon={FolderInputIcon} id="projects" />
          </Sidebar.TabsGroup>
          <Sidebar.TabsGroup position="bottom">
            <Sidebar.Tab icon={SettingsIcon} id="settings" />
          </Sidebar.TabsGroup>
        </Sidebar.Tabs>

        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} maxSize={45} minSize={0}>
            <Sidebar.Panels>
              <Sidebar.Panel id="files" title={projectTitle}>
                <FileExplorer.Tree nodes={mockFileTree} />
              </Sidebar.Panel>

              <Sidebar.Panel id="search" title="Search">
                <PlaceholderPanel message="Search panel coming soon..." />
              </Sidebar.Panel>

              <Sidebar.Panel id="share" title="Share">
                <PlaceholderPanel message="Share panel coming soon..." />
              </Sidebar.Panel>

              <Sidebar.Panel id="projects" title="Projects">
                <PlaceholderPanel message="Projects panel coming soon..." />
              </Sidebar.Panel>

              <Sidebar.Panel id="settings" title="Settings">
                <PlaceholderPanel message="Settings panel coming soon..." />
              </Sidebar.Panel>
            </Sidebar.Panels>
          </ResizablePanel>

          <ResizableHandle className="bg-zinc-200 transition-all duration-150 hover:scale-x-500 hover:bg-zinc-300" />

          <ResizablePanel>
            <CodeEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
