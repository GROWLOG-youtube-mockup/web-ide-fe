import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type TabId = "files" | "search" | "share" | "projects" | "settings"
export type PanelId = "files" | "chats" | "search" | "share" | "projects" | "settings"

interface SidebarState {
  /** 현재 활성화된 탭 (탑레벨 탭) */
  activeTab: TabId
  /** 열려있는 패널 id 목록 */
  expandedPanels: PanelId[]
  /** 탭 활성화 */
  setActiveTab: (id: TabId) => void
  /** 패널 열기 (id 기준) */
  addExpandedPanel: (id: PanelId) => void
  /** 패널 닫기 (id 기준) */
  removeExpandedPanel: (id: PanelId) => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set): SidebarState => ({
        // 초기 상태
        activeTab: "files",
        expandedPanels: [],
        setActiveTab: (id: TabId) => {
          set({ activeTab: id })
        },
        addExpandedPanel: (id: PanelId) => {
          set((state: SidebarState) =>
            state.expandedPanels.includes(id)
              ? state
              : { expandedPanels: [...state.expandedPanels, id] }
          )
        },
        removeExpandedPanel: (id: PanelId) => {
          set((state: SidebarState) => ({
            expandedPanels: state.expandedPanels.filter(pre => pre !== id),
          }))
        },
      }),
      {
        name: "sidebar-store",
        partialize: (state: SidebarState) => ({
          activeTab: state.activeTab,
          expandedPanels: state.expandedPanels,
        }),
      }
    ),
    { name: "sidebar-store" }
  )
)
