import { Plus } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const ProjectListHeader = () => {
  return (
    <div className="mt-12 flex items-end justify-between px-0 py-2">
      {/* Profile Section */}
      <div className="flex items-end gap-4">
        <div className="flex items-end justify-center">
          <Avatar className="h-[72px] w-[72px] rounded-full border-2 border-white">
            <AvatarImage alt="Profile" src="/api/placeholder/72/72" />
          </Avatar>
        </div>
        <div className="mb-3 flex items-center gap-2.5">
          <h2 className="font-semibold text-2xl text-black leading-8 tracking-[-0.144px]">
            User123
          </h2>
        </div>
      </div>

      {/* New Project Button */}
      <div className="w-[140px]">
        <Button
          className="group h-11 w-[135px] gap-2 rounded-[50px] border-[#aeaeae] bg-white px-4 py-3 transition-colors duration-150 hover:border-[#767676] hover:bg-[#f5f5f5] hover:text-black"
          variant="outline"
        >
          <span className="font-semibold text-black/80 text-sm group-hover:text-black">
            New Project
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c1c1c1] bg-white p-3 transition-colors duration-150 group-hover:border-[#767676] group-hover:bg-[#ededed]">
            <Plus className="h-4 w-4 text-[#767676] group-hover:text-black" strokeWidth={1.5} />
          </div>
        </Button>
      </div>
    </div>
  )
}
