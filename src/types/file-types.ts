export const getLanguage = (fileName: string): string => {
  if (!fileName) return "typescript"
  const ext = fileName.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "js":
    case "jsx":
      return "javascript"
    case "ts":
    case "tsx":
      return "typescript"
    case "html":
    case "htm":
      return "html"
    case "css":
      return "css"
    case "scss":
      return "scss"
    case "json":
      return "json"
    case "md":
      return "markdown"
    case "py":
      return "python"
    default:
      return "typescript"
  }
}
