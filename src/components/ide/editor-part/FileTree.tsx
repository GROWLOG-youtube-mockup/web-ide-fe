import { useSplitEditorStore } from "@/stores/split-editor-store"

export function FileTree() {
  const openFile = useSplitEditorStore(state => state.openFile)

  const mockFiles = [
    { icon: "🌐", id: "index-html", name: "index.html", path: "/index.html" },
    { icon: "🟨", id: "main-js", name: "main.js", path: "/main.js" },
    { icon: "🎨", id: "style-css", name: "style.css", path: "/style.css" },
    { icon: "📝", id: "readme-md", name: "README.md", path: "/README.md" },
  ]

  const handleFileClick = (file: (typeof mockFiles)[0]) => {
    console.log(`📂 [FileTree] 파일 열기 요청: ${file.name}`)
    openFile(file.id, file.name, file.path)
  }

  return (
    <div className="filetree flex-1 px-1 py-2">
      <div className="mb-2 font-semibold text-sm">📁 프로젝트</div>
      {mockFiles.map(file => (
        <button
          className="flex cursor-pointer items-center gap-2 p-1 text-sm hover:bg-gray-200"
          key={file.id}
          onClick={() => handleFileClick(file)}
          type="button"
        >
          <span>{file.icon}</span>
          <span>{file.name}</span>
        </button>
      ))}
    </div>
  )
}
