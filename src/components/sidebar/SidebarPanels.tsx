import type { ReactElement } from "react"
import type { TabId } from "@/stores/sidebar-store"
import { useSidebarStore } from "@/stores/sidebar-store"

interface SidebarPanelsGroupProps {
  tab: TabId
  topPanels?: ReactElement[]
  bottomPanels?: ReactElement[]
}

export const SidebarPanels = ({ tab, topPanels, bottomPanels = [] }: SidebarPanelsGroupProps) => {
  const { activeTab } = useSidebarStore()
  if (activeTab !== tab) return null

  return (
    <div className="sidebar-panels flex flex-1 flex-col justify-between" data-tab={tab}>
      <div className="sidebar-panels-top flex flex-col ">{topPanels}</div>
      <div className="sidebar-panels-bottom flex flex-col">{bottomPanels}</div>
    </div>
  )
}
