import { CodeEditor } from "@/components/ide/CodeEditor"
import { FileExplorer } from "@/components/ide/FileExplorer"
import { NavigationPanel } from "@/components/ide/NavigationPanel"
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
        {/* File Explorer Sidebar */}
        <div className="flex w-[343px]">
          <NavigationPanel />
          <FileExplorer />
          {/* Resize Handle */}
          <div className="w-2 bg-zinc-400"></div>
        </div>

        <CodeEditor content={content} />
      </div>
    </div>
  )
}
