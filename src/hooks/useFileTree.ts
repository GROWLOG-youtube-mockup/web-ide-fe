import {
  dragAndDropFeature,
  expandAllFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
  type TreeInstance,
} from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { useMemo } from "react"
import { mockFileTree } from "@/data/mock-file-tree"
import { fileSystemService } from "@/lib/file-system-service"
import { convertToTreeData, createFileTreeDataLoader } from "@/lib/tree-utils"
import { useFileTreeStore } from "@/stores/file-tree-store"
import type { FileData } from "@/types/file-explorer"

/**
 * 파일 탐색기용 Headless Tree 인스턴스를 생성하고 상태를 관리하는 커스텀 훅
 *
 * @description
 * 이 훅은 파일 탐색기의 핵심 기능을 제공합니다:
 * - 파일/폴더 구조의 트리 렌더링
 * - 확장/축소 상태 관리 (localStorage 지속)
 * - 드래그 앤 드롭을 통한 파일 이동
 * - 파일 선택 및 더블클릭으로 열기
 * - 전체 확장/축소 기능
 * - 파일/폴더 이름 변경 기능
 *
 * @returns {{
 *   tree: TreeInstance<FileData> - Headless Tree 인스턴스 (렌더링용)
 *   expandAll: () => void - 모든 폴더 확장
 *   collapseAll: () => void - 모든 폴더 축소
 *   startRenaming: (itemId: string) => void - 아이템 이름 변경 시작
 *   setFocusedItem: (itemId: string | null) => void - 아이템에 포커스 설정
 *   clearFocus: () => void - 포커스 해제
 * }}
 *
 * @remarks
 * - Headless Tree의 "Manage the entire state yourself" 패턴 구현
 * - Zustand를 통한 상태 지속성 (브라우저 새로고침 시에도 확장 상태 유지)
 * - 현재는 목업 데이터 사용, 추후 실제 API 연동 가능
 */
export const useFileTree = () => {
  const { treeState, setTreeState } = useFileTreeStore()

  const treeData = useMemo(() => convertToTreeData(mockFileTree), [])
  const dataLoader = useMemo(() => createFileTreeDataLoader(treeData), [treeData])

  const tree: TreeInstance<FileData> = useTree<FileData>({
    // zustand 스토어의 트리 상태
    state: treeState,
    // zustand 스토어의 트리 상태 업데이트 함수
    setState: setTreeState,

    rootItemId: "/", // 루트 폴더 ID
    // 아이템 이름 추출
    getItemName: item => String(item.getItemData().name || ""),
    // 폴더 여부 판단
    isItemFolder: item => item.getItemData().type === "folder",
    dataLoader,
    indent: 12,

    features: [
      // 데이터 로더 동기화
      syncDataLoaderFeature,
      // 파일/폴더 선택 기능
      selectionFeature,
      // 드래그 앤 드롭 기능
      dragAndDropFeature,
      // 전체 확장/축소 기능
      expandAllFeature,
      // 키보드 단축키 기능 (F2 등)
      hotkeysCoreFeature,
      // 파일/폴더 이름 변경 기능
      renamingFeature,
    ],

    // 드래그 가능 조건: 선택된 아이템이 있을 때
    canDrag: items => items.length > 0,
    // 드롭 가능 조건: 대상이 폴더일 때
    canDrop: (_items, target) => target.item.getItemData().type === "folder",
    // 같은 레벨에서 순서 변경 불가
    canReorder: false,

    onDrop: (items, target) => {
      const targetPath = target.item.getItemData().path

      items.forEach(item => {
        const itemPath = item.getItemData().path
        fileSystemService.move(itemPath, targetPath)
      })
    },

    onRename: (item, newName) => {
      const itemData = item.getItemData()
      fileSystemService.rename(itemData.path, newName)
    },
    canRename: item => {
      // 모든 파일과 폴더의 이름 변경 허용 (루트 제외)
      return item.getId() !== "/"
    },
  })

  /**
   * 파일/폴더 이름 변경을 시작하는 함수
   *
   * @param itemId - 변경할 아이템의 ID (경로)
   *
   * @remarks
   * - headless-tree의 내장 renaming feature를 사용
   * - 실제 이름 변경은 onRename 콜백에서 처리됨
   * - F2 키로도 이름 변경 모드 진입 가능
   */
  const startRenaming = (itemId: string) => {
    const item = tree.getItemInstance(itemId)
    if (item.canRename()) {
      item.startRenaming()
    }
  }

  return {
    tree,
    expandAll: tree.expandAll,
    collapseAll: tree.collapseAll,
    startRenaming,
  }
}
