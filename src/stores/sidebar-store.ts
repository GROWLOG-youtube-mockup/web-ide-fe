import { create } from "zustand"
import { devtools } from "zustand/middleware"

export type NavItem = "files" | "search" | "share" | "folder" | "settings"

interface SidebarState {
  activeView: NavItem
  setActiveView: (view: NavItem) => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    set => ({
      activeView: "files",
      setActiveView: view => set({ activeView: view }),
    }),
    { name: "sidebar-store" }
  )
)
