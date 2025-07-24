import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type NavItem = "files" | "search" | "share" | "projects" | "settings"

interface SidebarState {
  activePanel: NavItem
  setActivePanel: (panel: NavItem) => void

  sectionExpanded: Record<NavItem, boolean>
  setSectionExpanded: (section: NavItem, expanded: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set): SidebarState => ({
        activePanel: "files",
        sectionExpanded: {
          files: true,
          projects: true,
          search: true,
          settings: true,
          share: true,
        },
        setActivePanel: (panel: NavItem) => set({ activePanel: panel }),
        setSectionExpanded: (section: NavItem, expanded: boolean) =>
          set(state => ({
            sectionExpanded: { ...state.sectionExpanded, [section]: expanded },
          })),
      }),
      {
        name: "sidebar-store",
        partialize: state => ({
          activePanel: state.activePanel,
          sectionExpanded: state.sectionExpanded,
        }),
      }
    ),
    { name: "sidebar-store" }
  )
)
