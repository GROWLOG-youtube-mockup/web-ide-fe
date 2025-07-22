// components/Editor/TabDragDropProvider.tsx
import { createContext, type ReactNode, useContext, useState } from "react"

interface DragDropContextType {
  draggedTab: string | null
  setDraggedTab: (tabId: string | null) => void
  onTabMove: (fromId: string, toId: string) => void
}

const DragDropContext = createContext<DragDropContextType | null>(null)

interface Props {
  children: ReactNode
  enabled: boolean
  onTabMove: (fromId: string, toId: string) => void
}

export function TabDragDropProvider({ children, enabled, onTabMove }: Props) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <DragDropContext.Provider value={{ draggedTab, onTabMove, setDraggedTab }}>
      <div className="flex">{children}</div>
    </DragDropContext.Provider>
  )
}

export const useDragDrop = () => {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error("useDragDrop must be used within TabDragDropProvider")
  }
  return context
}
