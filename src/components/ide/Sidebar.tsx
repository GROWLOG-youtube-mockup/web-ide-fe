import { FileExplorer } from "./FileExplorer"
import { NavigationPanel } from "./NavigationPanel"
import { ResizeHandle } from "./ResizeHandle"

export const Sidebar = () => {
  return (
    <div className="flex w-[343px]">
      <NavigationPanel />
      <FileExplorer />
      <ResizeHandle />
    </div>
  )
}
