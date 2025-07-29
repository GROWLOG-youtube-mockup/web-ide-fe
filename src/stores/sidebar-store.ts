import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type NavItem = "files" | "search" | "share" | "projects" | "settings"

interface SidebarState {
  /** 현재 활성화된 사이드바 패널 */
  activePanel: NavItem

  /**
   * 활성 사이드바 패널 변경
   *
   * @param panel - 활성화할 패널 ID
   * @remarks
   * 사이드바 탭을 클릭했을 때 호출됩니다.
   */
  setActivePanel: (panel: NavItem) => void

  /** 각 패널의 확장/축소 상태 */
  expandedPanel: Record<NavItem, boolean>

  /**
   * 패널 확장/축소 상태 변경
   *
   * @param panel - 상태를 변경할 패널 ID
   * @param expanded - 확장 여부 (true: 확장, false: 축소)
   * @remarks
   * 각 패널의 헤더를 클릭했을 때 호출됩니다.
   */
  setExpandedPanel: (panel: NavItem, expanded: boolean) => void
}

const initialExpandedPanel: Record<NavItem, boolean> = {
  files: true,
  projects: true,
  search: true,
  settings: true,
  share: true,
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set): SidebarState => ({
        // 초기 상태
        activePanel: "files",
        expandedPanel: initialExpandedPanel,

        // 패널 관리
        setActivePanel: (panel: NavItem) => {
          set({ activePanel: panel })
        },

        // 패널 확장/축소 관리
        setExpandedPanel: (panel: NavItem, expanded: boolean) => {
          set(state => ({
            expandedPanel: {
              ...state.expandedPanel,
              [panel]: expanded,
            },
          }))
        },
      }),
      {
        name: "sidebar-store",
        partialize: state => ({
          activePanel: state.activePanel,
          expandedPanel: state.expandedPanel,
        }),
      }
    ),
    { name: "sidebar-store" }
  )
)
