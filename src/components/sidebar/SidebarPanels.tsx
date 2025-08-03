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
    <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden" data-tab={tab}>
      <div className="sidebar-panels-top flex min-h-0 flex-col overflow-hidden">{topPanels}</div>
      <div className="sidebar-panels-bottom flex min-h-0 flex-col overflow-hidden">
        {bottomPanels}
      </div>
    </div>
  )
}
