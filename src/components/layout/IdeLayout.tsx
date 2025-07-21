import { CodeEditor } from "@/components/ide/CodeEditor"
import { Sidebar } from "@/components/ide/Sidebar"
import { TopBar } from "@/components/ide/TopBar"

interface IdeLayoutProps {
  projectName?: string
  content?: string
}

export const IdeLayout = ({
  projectName = "Growlog IDE",
  content = "hello world",
}: IdeLayoutProps) => {
  return (
    <div className="flex h-full w-full flex-col">
      <TopBar projectName={projectName} />

      {/* Main Content */}
      <div className="flex h-[850px] flex-1">
        <Sidebar />
        <CodeEditor content={content} />
      </div>
    </div>
  )
}
