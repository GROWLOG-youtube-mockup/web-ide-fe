import { Input } from "@/components/ui/input"

interface ProjectSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const ProjectSearch = ({ searchQuery, onSearchChange }: ProjectSearchProps) => {
  return (
    <div className="flex flex-col items-start justify-center gap-2.5 px-10 py-4 ">
      <div className="h-[35px] w-[760px]">
        <Input
          className="h-full rounded-none border-0 border-black border-b-2 bg-transparent px-0 font-medium text-black/60 text-xs shadow-none placeholder:text-black/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Find your project"
          value={searchQuery}
        />
      </div>
    </div>
  )
}
