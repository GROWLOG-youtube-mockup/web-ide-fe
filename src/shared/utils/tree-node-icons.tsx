import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"
import { ICON_STYLES, TREE_STYLES } from "@/shared/constants/file-explorer"
import { cn } from "@/shared/utils/utils"

export const renderExpandIcon = (isFolder: boolean, isExpanded: boolean) => {
  if (!isFolder) {
    return <span className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.BASE)} />
  }

  return (
    <ChevronRight
      className={cn(
        TREE_STYLES.ICON_SIZE,
        ICON_STYLES.CHEVRON,
        isExpanded && ICON_STYLES.CHEVRON_EXPANDED
      )}
    />
  )
}

export const renderFileIcon = (isFolder: boolean, hasChildren: boolean, isExpanded: boolean) => {
  if (!isFolder) {
    return <File className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FILE)} />
  }

  if (hasChildren && isExpanded) {
    return <FolderOpen className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FOLDER)} />
  }

  return <Folder className={cn(TREE_STYLES.ICON_SIZE, ICON_STYLES.FOLDER)} />
}
