import type { TreeInstance } from "@headless-tree/core"
import { useEffect } from "react"
import { TreeNode } from "@/feature/file-explorer/ui/tree-node"
import type { FileData } from "@/shared/types/file-explorer"
import { Input } from "@/shared/ui/input"

interface SearchPanelProps {
  tree: TreeInstance<FileData>
}

/**
 * 파일 트리 검색을 위한 UI와 결과 목록을 제공하는 패널 컴포넌트.
 * 전체 트리를 보여주면서 검색 결과는 하이라이트 처리한다.
 * @param tree - useFileTree 훅에서 생성된 tree 인스턴스
 */
export const SearchPanel = ({ tree }: SearchPanelProps) => {
  useEffect(() => {
    // 패널이 표시될 때 검색 모드를 활성화합니다.
    tree.openSearch()
    // 패널이 사라질 때 검색 상태를 초기화합니다.
    return () => {
      tree.closeSearch()
    }
  }, [tree])

  // 필터링된 결과가 아닌 전체 아이템 목록을 가져옵니다.
  const allItems = tree.getItems()
  // 검색 결과 카운트를 위해 일치하는 아이템 목록을 별도로 가져옵니다.
  const matchingItems = tree.getSearchMatchingItems()

  return (
    <div className="flex h-full flex-col p-2">
      <div className="relative mb-2">
        <Input
          placeholder="Search files..."
          {...tree.getSearchInputElementProps()}
          className="w-full pr-16"
        />
        <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-xs">
          {matchingItems.length} results
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {allItems.length > 0 ? (
          <ul className="m-0 list-none">
            {/*
              전체 파일 트리를 렌더링합니다.
              하이라이트 처리는 TreeNode 내부에서 item.isMatchingSearch()를 통해 자동으로 이루어집니다.
            */}
            {allItems.map(item => (
              <TreeNode item={item} key={item.getId()} />
            ))}
          </ul>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            File tree is empty.
          </div>
        )}
      </div>
    </div>
  )
}
