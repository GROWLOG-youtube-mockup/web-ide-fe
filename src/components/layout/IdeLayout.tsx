import { CodeEditor } from "@/components/ide/CodeEditor"
import { TopBar } from "@/components/ide/TopBar"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

/**
 * IDE 전체 레이아웃을 관리하는 최상위 컴포넌트
 *
 * @remarks
 * - TopBar와 리사이저블 패널(Sidebar + Editor)로 구성
 * - 사이드바와 에디터 영역의 크기를 자유롭게 조절 가능
 */
export const IdeLayout = () => {
  const projectTitle = "Project Title"

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <main className="flex min-h-0 flex-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel collapsedSize={30} maxSize={45} minSize={0}>
            <Sidebar projectTitle={projectTitle} />
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
