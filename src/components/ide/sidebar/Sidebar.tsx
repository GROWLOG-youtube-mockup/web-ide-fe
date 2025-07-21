import { ResizeHandle } from "../ResizeHandle"
import { FileExplorer } from "./FileExplorer"
import { NavigationPanel } from "./NavigationPanel"

export const Sidebar = () => {
  return (
    <div className="flex w-[343px]">
      <NavigationPanel />
      <FileExplorer />
      <ResizeHandle />
    </div>
  )
}
