import type { ReactNode } from "react"
import { SidebarSeparator } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export const SidebarTabs = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <nav className={cn("flex h-full w-14 flex-col justify-between bg-zinc-100 p-2")}>
        {children}
      </nav>
      <SidebarSeparator className="mx-0 bg-zinc-200" orientation="vertical" />
    </>
  )
}
