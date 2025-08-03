import { cn } from "@/lib/utils"

interface ProjectToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export const ProjectToggle = ({ checked, onCheckedChange, className }: ProjectToggleProps) => {
  return (
    <button
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-[10.364px] w-[19px] shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-green-500" : "bg-gray-400",
        className
      )}
      onClick={e => {
        e.stopPropagation()
        onCheckedChange(!checked)
      }}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          "block h-2 w-2 rounded-full bg-white shadow-sm transition-transform",
          "absolute top-[1.182px] z-10",
          checked ? "left-[9px]" : "left-[1.182px]"
        )}
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      />
    </button>
  )
}
