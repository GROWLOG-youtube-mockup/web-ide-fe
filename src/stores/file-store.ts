// stores/file-store.ts
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useSplitEditorStore } from "./split-editor/split-editor-store.ts"

export interface FileTab {
  fileId: string
  fileName: string
  filePath: string
  isDirty?: boolean
  lastModified?: Date
}

type FileTabUpdate = Partial<Omit<FileTab, "fileId" | "filePath">>

interface FileStore {
  // === 기본 탭 관리 (분할 없을 때) ===
  openTabs: FileTab[]
  activeFileId: string | null

  // === 분할 모드 여부 ===
  isSplitMode: boolean

  // === 전역 파일 관리 ===
  recentFiles: FileTab[]

  // === 기본 파일 액션 ===
  openFile: (fileId: string, fileName: string, filePath: string) => void
  closeTab: (fileId: string) => void
  setActiveTab: (fileId: string) => void
  clearAllTabs: () => void

  // === 파일 상태 관리 ===
  updateTab: (fileId: string, updates: FileTabUpdate) => void
  addToRecentFiles: (file: FileTab) => void
  markFileDirty: (fileId: string, isDirty: boolean) => void

  // === 분할 모드 전환 ===
  enableSplitMode: () => void
  disableSplitMode: () => void
}

export const useFileStore = create<FileStore>()(
  devtools(
    (set, get) => ({
      activeFileId: null,

      // ===== � 최근 파일 관리 =====
      addToRecentFiles: file => {
        set(state => {
          const filtered = state.recentFiles.filter(f => f.fileId !== file.fileId)
          return {
            recentFiles: [{ ...file, lastModified: new Date() }, ...filtered].slice(0, 10),
          }
        })
      },

      // ===== 🧹 모든 탭 닫기 =====
      clearAllTabs: () => {
        console.log("🧹 [FileStore] 모든 탭 닫기")

        const { isSplitMode } = get()

        if (isSplitMode) {
          // 🔧 분할 모드에서는 개별 패널에서 처리
          console.log("🔄 [FileStore] 분할 모드 - 개별 패널에서 처리")
          return
        }
        // 일반 모드에서만 처리
        set({ activeFileId: null, openTabs: [] })
      },

      // ===== 🗑️ 탭 닫기 =====
      closeTab: fileId => {
        try {
          console.log("🗑️ [FileStore] 탭 닫기:", fileId)

          const { isSplitMode } = get()

          if (isSplitMode) {
            // 🔧 분할 모드에서는 개별 패널에서 처리하므로 여기서는 아무것도 안함
            console.log("🔄 [FileStore] 분할 모드 - 개별 패널에서 처리")
            return
          }
          // 일반 모드: 완전 독립적 처리
          const { openTabs, activeFileId } = get()
          const tabToClose = openTabs.find(tab => tab.fileId === fileId)

          if (tabToClose?.isDirty) {
            console.warn("⚠️ [FileStore] 저장되지 않은 변경사항:", tabToClose.fileName)
          }

          const remainingTabs = openTabs.filter(tab => tab.fileId !== fileId)

          let nextActiveId = null
          if (activeFileId === fileId && remainingTabs.length > 0) {
            nextActiveId = remainingTabs[remainingTabs.length - 1].fileId
          } else if (activeFileId !== fileId) {
            nextActiveId = activeFileId
          }

          set({
            activeFileId: nextActiveId,
            openTabs: remainingTabs,
          })
        } catch (error) {
          console.error("❌ [FileStore] 탭 닫기 실패:", error)
        }
      },

      disableSplitMode: () => {
        try {
          console.log("� [FileStore] 분할 모드 비활성화")

          const splitStore = useSplitEditorStore.getState()

          // 모든 패널의 탭들을 수집
          const allFiles: FileTab[] = []
          let lastActiveFileId: string | null = null

          Object.values(splitStore.panels).forEach(panel => {
            panel.openTabs.forEach(tab => {
              if (!allFiles.some(f => f.fileId === tab.fileId)) {
                allFiles.push(tab)
              }
            })

            // 포커스된 패널의 활성 파일을 우선
            if (panel.isFocused && panel.activeFileId) {
              lastActiveFileId = panel.activeFileId
            }
          })

          set({
            activeFileId: lastActiveFileId || (allFiles.length > 0 ? allFiles[0].fileId : null),
            isSplitMode: false,
            openTabs: allFiles,
          })
        } catch (error) {
          console.error("❌ [FileStore] 분할 모드 비활성화 실패:", error)
        }
      },

      // ===== 🔄 분할 모드 전환 =====
      enableSplitMode: () => {
        try {
          console.log("🔄 [FileStore] 분할 모드 활성화")

          const { openTabs, activeFileId } = get()

          set({ isSplitMode: true })

          // 기존 탭들을 SplitEditor의 메인 패널로 이전
          const splitStore = useSplitEditorStore.getState()

          openTabs.forEach(tab => {
            splitStore.openFileInPanel("main", tab.fileId, tab.fileName, tab.filePath)
          })

          if (activeFileId) {
            splitStore.setActiveTabInPanel("main", activeFileId)
          }

          splitStore.focusPanel("main")
        } catch (error) {
          console.error("❌ [FileStore] 분할 모드 활성화 실패:", error)
        }
      },
      isSplitMode: false,

      // ===== 🏷️ 파일 상태 변경 =====
      markFileDirty: (fileId, isDirty) => {
        const { updateTab } = get()
        updateTab(fileId, { isDirty, lastModified: new Date() })
      },

      // ===== � 파일 열기 (모드에 따라 분기) =====
      openFile: (fileId, fileName, filePath) => {
        try {
          console.log("� [FileStore] 파일 열기:", fileName)

          // 유효성 검사
          if (!fileId || !fileName || !filePath) {
            console.error("❌ [FileStore] 잘못된 파일 정보:", {
              fileId,
              fileName,
              filePath,
            })
            return
          }

          const { isSplitMode, addToRecentFiles } = get()

          // 최근 파일에 추가
          addToRecentFiles({ fileId, fileName, filePath })

          if (isSplitMode) {
            // 🔧 분할 모드일 때는 split-editor-store에만 완전 위임
            console.log("🔄 [FileStore] 분할 모드 - SplitEditor에 위임")
            const splitStore = useSplitEditorStore.getState()
            splitStore.openFileInFocusedPanel(fileId, fileName, filePath)
            return // 여기서 끝!
          }
          // 일반 모드에서만 file-store 사용
          console.log("📋 [FileStore] 일반 모드에서 파일 열기")
          const { openTabs } = get()

          // 이미 열린 파일인지 확인
          const existingTab = openTabs.find(tab => tab.fileId === fileId)
          if (existingTab) {
            console.log("🔄 [FileStore] 기존 탭 활성화:", fileName)
            set({ activeFileId: fileId })
            return
          }

          // 새 탭 생성 (완전 독립적)
          console.log("➕ [FileStore] 새 탭 생성:", fileName)
          set({
            activeFileId: fileId,
            openTabs: [...openTabs, { fileId, fileName, filePath, lastModified: new Date() }],
          })
        } catch (error) {
          console.error("❌ [FileStore] 파일 열기 실패:", error)
        }
      },
      // ===== 📊 초기 상태 =====
      openTabs: [],
      recentFiles: [],

      // ===== 👆 활성 탭 변경 =====
      setActiveTab: fileId => {
        console.log("� [FileStore] 활성 탭 변경:", fileId)

        const { isSplitMode } = get()

        if (isSplitMode) {
          // 🔧 분할 모드에서는 개별 패널에서 처리
          console.log("🔄 [FileStore] 분할 모드 - 개별 패널에서 처리")
          return
        }
        // 일반 모드
        set({ activeFileId: fileId })
      },

      // ===== 📝 탭 업데이트 =====
      updateTab: (fileId, updates) => {
        console.log("📝 [FileStore] 탭 업데이트:", fileId, updates)

        const { isSplitMode } = get()

        if (isSplitMode) {
          // 🔧 분할 모드에서는 개별 패널에서 처리
          console.log("🔄 [FileStore] 분할 모드 - 개별 패널에서 처리")
          return
        }
        // 일반 모드
        set(state => ({
          openTabs: state.openTabs.map(tab =>
            tab.fileId === fileId ? { ...tab, ...updates } : tab
          ),
        }))

        // 최근 파일 목록도 업데이트 (전역이므로 항상 처리)
        set(state => ({
          recentFiles: state.recentFiles.map(file =>
            file.fileId === fileId ? { ...file, ...updates } : file
          ),
        }))
      },
    }),
    { name: "FileStore" }
  )
)

// ===== 🎯 편의성을 위한 훅들 =====
export const useActiveFile = () => {
  return useFileStore(state => {
    if (state.isSplitMode) {
      const splitStore = useSplitEditorStore.getState()
      const focusedPanel = splitStore.getFocusedPanel()
      if (focusedPanel?.activeFileId) {
        return focusedPanel.openTabs.find(tab => tab.fileId === focusedPanel.activeFileId) || null
      }
      return null
    }
    if (!state.activeFileId) return null
    return state.openTabs.find(tab => tab.fileId === state.activeFileId) || null
  })
}

export const useOpenTabs = () => {
  return useFileStore(state => state.openTabs)
}
