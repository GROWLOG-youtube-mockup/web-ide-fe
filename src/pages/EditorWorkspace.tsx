// EditorWorkspace.tsx
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import axios from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { CollaborativeEditor } from "@/components/Editor/CollaborativeEditor"
import { FileExplorer } from "@/components/Editor/FileExplorer"
import { TabBar } from "@/components/Editor/TabBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/Resizable"

interface FileTab {
  fileId: string
  fileName: string
  filePath: string
}

export default function EditorWorkspace() {
  const { projectId } = useParams()
  const [openTabs, setOpenTabs] = useState<FileTab[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  // pages/EditorWorkspace.tsx의 openFile 함수 수정
  const openFile = async (fileId: string) => {
    const existingTab = openTabs.find(tab => tab.fileId === fileId)
    if (existingTab) {
      setActiveFileId(fileId)
      return
    }

    try {
      const apiUrl = `http://localhost:8080/api/projects/test-project-123/files/${fileId}/content`
      console.log("🔍 API 요청:", apiUrl)

      const response = await axios.get(apiUrl)
      console.log("📄 파일 데이터:", response.data)

      const fileData = response.data

      if (!fileData || typeof fileData !== "object" || !fileData.path) {
        console.error("파일 데이터가 올바르지 않습니다:", fileData)
        return
      }

      setOpenTabs(prev => [
        ...prev,
        {
          fileId: fileData.id || fileId,
          fileName: fileData.name || "unknown",
          filePath: fileData.path || "/unknown",
        },
      ])

      setActiveFileId(fileData.id || fileId)
    } catch (error) {
      console.error("파일을 불러올 수 없습니다:", error)
    }
  }

  const closeTab = (fileId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.fileId !== fileId))

    if (activeFileId === fileId) {
      const remainingTabs = openTabs.filter(tab => tab.fileId !== fileId)
      setActiveFileId(remainingTabs.length > 0 ? remainingTabs[0].fileId : null)
    }
  }

  return (
    <LiveblocksProvider publicApiKey="pk_dev_lWz_vEA2Xx6PMB60x9l8v8gggPv0ttPTJ7pCvm5etnhIZXYbcsSALmQF7-qdql7G">
      <ResizablePanelGroup className="h-screen" direction="horizontal">
        <ResizablePanel defaultSize={25} maxSize={40} minSize={5}>
          <FileExplorer onFileClick={openFile} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75}>
          <div className="editor-container flex h-full flex-col">
            <TabBar
              activeFileId={activeFileId}
              onTabClick={setActiveFileId}
              onTabClose={closeTab}
              tabs={openTabs}
            />

            <div className="flex-1">
              {activeFileId && (
                <RoomProvider id={`${projectId}-${activeFileId}`}>
                  <ClientSideSuspense fallback={<div>Loading...</div>}>
                    <CollaborativeEditor />
                  </ClientSideSuspense>
                </RoomProvider>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </LiveblocksProvider>
  )
}
