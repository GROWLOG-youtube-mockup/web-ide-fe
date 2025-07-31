import type { ReactElement } from "react"
import { SidebarSeparator } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface SidebarTabsProps {
  topTabs: ReactElement[]
  bottomTabs?: ReactElement[]
}

export const SidebarTabs = ({ topTabs, bottomTabs = [] }: SidebarTabsProps) => {
  return (
    <>
      <nav className={cn("flex h-full w-14 flex-col justify-between bg-zinc-100 p-2")}>
        <div className="flex flex-col gap-2">{topTabs}</div>
        <div className="flex flex-col gap-2">{bottomTabs}</div>
      </nav>
      <SidebarSeparator className="mx-0 bg-zinc-200" orientation="vertical" />
    </>
  )
}
