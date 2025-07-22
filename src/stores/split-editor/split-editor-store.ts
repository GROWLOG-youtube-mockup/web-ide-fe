// stores/split-editor-store.ts
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { SplitEditorStore } from "../../types/editor/types"
import { createLayoutActions } from "./layout-actions"
import { createPanelActions } from "./panel-actions"
import { createTabActions } from "./tab-actions"
import { createUtilsActions } from "./utils-actions"

/**
 * 분할 에디터 상태 관리를 위한 Zustand 스토어
 *
 * @description
 * - 패널 생성/삭제/포커스 관리
 * - 파일 탭 관리 (열기/닫기/이동)
 * - 레이아웃 변경 (분할 모드)
 * - 실시간 동기화 및 유틸리티 기능
 *
 * @example
 * ```typescript
 * const store = useSplitEditorStore();
 *
 * // 패널 생성
 * store.createPanel('right-panel', 'right');
 *
 * // 파일 열기
 * store.openFileInPanel('right-panel', 'file-1', 'App.tsx', '/src/App.tsx');
 *
 * // 레이아웃 변경
 * store.setSplitType('vertical');
 * ```
 */
export const useSplitEditorStore = create<SplitEditorStore>()(
  devtools(
    (set, get, store) => ({
      focusedPanelId: "main",
      layout: {
        mosaicNode: null,
        panelPositions: { main: "main" },
        type: "single",
      },
      // ===== 📊 초기 상태 =====
      panels: {
        main: {
          activeFileId: null,
          createdAt: new Date(),
          isFocused: true,
          lastFocusedAt: new Date(),
          openTabs: [],
          panelId: "main",
        },
      },

      // ===== 🖼️ 패널 관리 액션 =====
      ...createPanelActions(set, get, store),

      // ===== 🔧 레이아웃 관리 액션 =====
      ...createLayoutActions(set, get, store),

      // ===== 📂 탭 관리 액션 =====
      ...createTabActions(set, get, store),

      // ===== 🔧 유틸리티 액션 =====
      ...createUtilsActions(set, get, store),
    }),
    {
      // 개발 모드에서만 로깅
      enabled: process.env.NODE_ENV === "development",
      name: "SplitEditorStore",
    }
  )
)
