// EditorWorkspace.tsx
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { CollaborativeEditor } from "@/components/Editor/CollaborativeEditor"
import { FileExplorer } from "@/components/Editor/FileExplorer"
import { TabBar } from "@/components/Editor/TabBar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/Resizable"

/**
 * 파일 탭 정보 인터페이스
 * - 열린 파일의 식별 및 표시 정보
 */
interface FileTab {
  fileId: string // 고유 식별자
  fileName: string // 표시할 파일명
  filePath: string // 전체 파일 경로
}

/**
 * 통합 에디터 워크스페이스 컴포넌트
 * - 파일 탐색기, 탭바, 협업 에디터를 통합한 IDE 환경
 * - 실시간 협업 기능 제공 (Liveblocks)
 * - 리사이징 가능한 패널 레이아웃
 * - 멀티 파일 탭 시스템
 */
export default function EditorWorkspace() {
  const { projectId } = useParams() // URL에서 프로젝트 ID 추출
  const [openTabs, setOpenTabs] = useState<FileTab[]>([]) // 열린 파일 탭 목록
  const [activeFileId, setActiveFileId] = useState<string | null>(null) // 현재 활성 파일 ID

  /**
   * 파일 열기 핸들러
   * - 파일 탐색기에서 파일 선택 시 호출
   * - 중복 탭 방지: 이미 열린 파일이면 기존 탭으로 전환
   * - 새 파일이면 새 탭 생성 및 활성화
   */
  const openFile = (fileId: string, fileName: string, filePath: string) => {
    // 이미 열린 파일인지 확인
    const existingTab = openTabs.find(tab => tab.fileId === fileId)
    if (existingTab) {
      // 기존 탭으로 전환
      setActiveFileId(fileId)
      return
    }

    // 새 탭 생성 및 추가
    setOpenTabs(prev => [
      ...prev,
      {
        fileId,
        fileName,
        filePath,
      },
    ])

    // 새로 열린 파일을 활성화
    setActiveFileId(fileId)
  }

  /**
   * 탭 닫기 핸들러
   * - 선택한 탭 제거
   * - 활성 탭이 닫힌 경우 다른 탭으로 자동 전환
   * - 모든 탭이 닫히면 에디터 영역 비움
   */
  const closeTab = (fileId: string) => {
    // 닫을 탭을 제외한 나머지 탭들
    const remainingTabs = openTabs.filter(tab => tab.fileId !== fileId)
    setOpenTabs(remainingTabs)

    // 현재 활성 탭을 닫는 경우 처리
    if (activeFileId === fileId) {
      // 남은 탭이 있으면 첫 번째 탭을 활성화, 없으면 null
      setActiveFileId(remainingTabs.length > 0 ? remainingTabs[0].fileId : null)
    }
  }

  return (
    /* 실시간 협업 시스템 초기화 */
    <LiveblocksProvider publicApiKey="pk_dev_lWz_vEA2Xx6PMB60x9l8v8gggPv0ttPTJ7pCvm5etnhIZXYbcsSALmQF7-qdql7G">
      {/* 리사이징 가능한 수평 패널 그룹 */}
      <ResizablePanelGroup className="h-screen" direction="horizontal">
        {/* 왼쪽 패널: 파일 탐색기 */}
        <ResizablePanel defaultSize={25} maxSize={40} minSize={5}>
          <FileExplorer onFileClick={openFile} />
        </ResizablePanel>

        {/* 패널 구분선 (드래그 가능) */}
        <ResizableHandle withHandle />

        {/* 오른쪽 패널: 에디터 영역 */}
        <ResizablePanel defaultSize={75}>
          <div className="editor-container flex h-full flex-col">
            {/* 상단: 파일 탭바 */}
            <TabBar
              activeFileId={activeFileId}
              onTabClick={setActiveFileId} // 탭 전환 핸들러
              onTabClose={closeTab} // 탭 닫기 핸들러
              tabs={openTabs}
            />

            {/* 하단: 에디터 영역 */}
            <div className="flex-1">
              {activeFileId && (
                /* 파일별 독립된 협업 룸 생성 */
                <RoomProvider id={`${projectId}-${activeFileId}`}>
                  {/* 클라이언트 사이드 렌더링 (SSR 방지) */}
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
