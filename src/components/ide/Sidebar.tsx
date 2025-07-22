import { NavigationPanel } from "./NavigationPanel"
import { ResizeHandle } from "./ResizeHandle"
import { FileExplorer } from "./sidebar/FileExplorer"

export const Sidebar = () => {
  return (
    <div className="sidebar flex w-[343px]">
      <NavigationPanel />
      <FileExplorer />
      <ResizeHandle />
    </div>
  )
}
