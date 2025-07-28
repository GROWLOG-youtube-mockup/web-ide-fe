import {
  dragAndDropFeature,
  expandAllFeature,
  selectionFeature,
  syncDataLoaderFeature,
  type TreeInstance,
} from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { useMemo } from "react"
import { mockFileTree } from "@/data/mock-file-tree"
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
 *
 * @returns {{
 *   tree: TreeInstance<FileData> - Headless Tree 인스턴스 (렌더링용)
 *   expandAll: () => void - 모든 폴더 확장
 *   collapseAll: () => void - 모든 폴더 축소
 * }}
 *
 * @example
 * ```tsx
 * const { tree, expandAll, collapseAll } = useFileTree()
 *
 * // 트리 렌더링
 * <TreeRenderer tree={tree} />
 *
 * // 액션 버튼
 * <button onClick={expandAll}>전체 확장</button>
 * <button onClick={collapseAll}>전체 축소</button>
 * ```
 *
 * @remarks
 * - Headless Tree의 "Manage the entire state yourself" 패턴 구현
 * - Zustand를 통한 상태 지속성 (브라우저 새로고침 시에도 확장 상태 유지)
 * - 현재는 목업 데이터 사용, 추후 실제 API 연동 가능
 */
export const useFileTree = () => {
  // 목업 데이터를 Headless Tree 형식으로 변환 (성능 최적화를 위해 메모이제이션)
  const treeData = useMemo(() => convertToTreeData(mockFileTree), [])

  // 트리 데이터 로더 생성 (Headless Tree가 데이터를 가져올 때 사용)
  const dataLoader = useMemo(() => createFileTreeDataLoader(treeData), [treeData])

  // Zustand 스토어에서 트리 상태와 상태 업데이트 함수 가져오기
  // 이를 통해 확장/축소 상태가 localStorage에 자동으로 저장됨
  const { treeState, setState } = useFileTreeStore()

  // Headless Tree 인스턴스 생성 및 설정
  const tree: TreeInstance<FileData> = useTree<FileData>({
    // === 상태 관리 ===
    state: treeState, // Zustand 스토어의 트리 상태
    setState, // 상태 업데이트 함수 (localStorage 자동 저장)

    // === 기본 트리 구조 설정 ===
    rootItemId: "/", // 루트 폴더 ID
    getItemName: item => String(item.getItemData().name || ""), // 아이템 이름 추출
    isItemFolder: item => item.getItemData().type === "folder", // 폴더 여부 판단
    dataLoader, // 데이터 로더
    indent: 12, // 들여쓰기 픽셀 단위

    // === 활성화된 기능들 ===
    features: [
      syncDataLoaderFeature, // 데이터 로더 동기화
      selectionFeature, // 파일/폴더 선택 기능
      dragAndDropFeature, // 드래그 앤 드롭 기능
      expandAllFeature, // 전체 확장/축소 기능
    ],

    // === 드래그 앤 드롭 규칙 ===
    canDrag: items => items.length > 0, // 드래그 가능 조건: 선택된 아이템이 있을 때
    canDrop: (_items, target) => target.item.getItemData().type === "folder", // 드롭 가능 조건: 대상이 폴더일 때
    canReorder: false, // 같은 레벨에서 순서 변경 불가

    // 드롭 이벤트 핸들러 (실제 파일 이동 로직은 추후 구현)
    onDrop: (items, target) => {
      console.log(
        "파일 이동:",
        items.map(item => item.getItemData().path),
        "→",
        target.item.getItemData().path
      )
      // TODO: 실제 파일 시스템 API 호출하여 파일 이동 처리
    },
  })

  // 외부에서 사용할 수 있는 메서드들과 트리 인스턴스 반환
  return {
    tree, // 트리 렌더링에 필요한 인스턴스
    expandAll: tree.expandAll, // 모든 폴더 확장 (액션 버튼용)
    collapseAll: tree.collapseAll, // 모든 폴더 축소 (액션 버튼용)
  }
}
