export const TREE_STYLES = {
  DRAG_TARGET: "bg-blue-50",
  FOCUS_BG: "focus:outline-1 outline-offset-1",
  HOVER_BG: "hover:bg-zinc-200",
  ICON_SIZE: "h-4 w-4",
  INDENT_SIZE: 12,
  NODE_HEIGHT: "h-6",
  SELECTED_BG: "bg-zinc-200",
} as const

export const ICON_STYLES = {
  BASE: "flex-shrink-0",
  CHEVRON: "text-muted-foreground transition-transform",
  CHEVRON_EXPANDED: "rotate-90",
  FILE: "text-muted-foreground",
  FOLDER: "text-zinc-800",
} as const
