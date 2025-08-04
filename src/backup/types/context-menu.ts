export interface ContextMenuItem {
  label: string
  action: () => void | Promise<void>
  variant: "default" | "destructive"
}
