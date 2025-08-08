import type { ReactElement } from "react"
import { SidebarSeparator } from "@/shared/ui/sidebar.tsx"
import { cn } from "@/shared/utils/utils.ts"

interface SidebarTabsProps {
  topTabs: ReactElement[]
  bottomTabs?: ReactElement[]
}

export const SidebarTabs = ({ topTabs, bottomTabs = [] }: SidebarTabsProps) => {
  return (
    <>
      <nav
        className={cn(
          "flex h-full w-14 flex-col items-center justify-between bg-[var(--color-background)] p-2"
        )}
      >
        <div className="flex flex-col gap-2">{topTabs}</div>
        <div className="flex flex-col gap-2">{bottomTabs}</div>
      </nav>
      <SidebarSeparator className="mx-0 bg-[var(--color-border)]" orientation="vertical" />
    </>
  )
}
