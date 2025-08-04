import { Switch } from "@/shared/ui/switch"
import { cn } from "@/shared/utils"

interface ProjectToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export const ProjectToggle = ({ checked, onCheckedChange, className }: ProjectToggleProps) => {
  const handleToggleClick = (checked: boolean) => {
    onCheckedChange(checked)
  }

  return (
    <div className="origin-center scale-80 cursor-pointer border-none bg-transparent p-0">
      <Switch
        checked={checked}
        onCheckedChange={handleToggleClick}
        className={cn("cursor-pointer", className)}
        onClick={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      />
    </div>
  )
}
