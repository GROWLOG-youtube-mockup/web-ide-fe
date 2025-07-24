import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { LiveblocksProvider, RoomProvider } from "@/liveblocks.config"
import type { ActiveFileContentProps, FileLoadingSpinnerProps } from "@/types/editor-type"
import { CollaborativeEditor } from "./CollaborativeEditor"

//로딩 중 표시입니다.
const FileLoadingSpinner = ({ fileName }: FileLoadingSpinnerProps) => (
  <div className="flex h-full items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="h-6 w-6 animate-spin rounded-full border-blue-500 border-b-2" />
      <div className="text-black/60 text-sm">{fileName} 로딩 중...</div>
    </div>
  </div>
)

export const ActiveFileContent = ({
  splitId = 1,
  activeFile,
  isVisible = true,
}: ActiveFileContentProps) => {
  const roomId = `project-${activeFile.fileId}`

  return (
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        display: isVisible ? "block" : "none",
        zIndex: isVisible ? 1 : 0,
      }}
    >
      <LiveblocksProvider>
        <RoomProvider id={roomId} key={roomId}>
          <ClientSideSuspense
            fallback={<FileLoadingSpinner fileName={activeFile.fileName} />}
            key={roomId}
          >
            <CollaborativeEditor activeFile={activeFile} splitId={splitId} />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  )
}
