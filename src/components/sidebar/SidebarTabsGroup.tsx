import type { ReactNode } from "react"

interface SidebarTabsGroupProps {
  children: ReactNode
  position?: "top" | "bottom"
}

export const SidebarTabsGroup = ({ children, position = "top" }: SidebarTabsGroupProps) => {
  if (position === "bottom") {
    return <div className="flex flex-col gap-2">{children}</div>
  }
  return <div className="flex flex-col gap-2">{children}</div>
}
