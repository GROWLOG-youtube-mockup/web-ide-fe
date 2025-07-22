import { CodeEditor } from "@/components/ide/CodeEditor"
import { FileExplorerTree } from "@/components/ide/sidebar/FileExplorerTree"
import { SidebarNav } from "@/components/ide/sidebar/SidebarNav"
import { ViewManager } from "@/components/ide/sidebar/ViewManager"
import { TopBar } from "@/components/ide/TopBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { mockFileTree } from "@/data/mockFileTree"

interface IdeLayoutProps {
  /** 상단 바에 표시할 프로젝트 이름 */
  projectName?: string
  /** 코드 에디터에 표시할 초기 콘텐츠 */
  content?: string
}

export const IdeLayout = ({
  projectName = "Growlog IDE",
  content = "hello world",
}: IdeLayoutProps) => {
  const handleFileClick = (path: string) => {
    console.log("File clicked:", path)
    // TODO: 파일 열기 로직 추가
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <TopBar projectName={projectName} />
      <main className="flex flex-1">
        <SidebarNav />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} maxSize={45} minSize={0}>
            <ViewManager defaultOpen={true} title="Files">
              <FileExplorerTree nodes={mockFileTree} onFileClick={handleFileClick} />
            </ViewManager>
          </ResizablePanel>

          <ResizableHandle className="bg-zinc-200 transition-all duration-150 hover:scale-x-500 hover:bg-zinc-300" />

          <ResizablePanel>
            <CodeEditor content={content} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
