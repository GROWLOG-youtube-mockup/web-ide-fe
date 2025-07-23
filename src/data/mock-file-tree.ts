/**
 * 파일 트리 데이터를 위한 API 응답 타입들
 */

/** API 응답으로부터의 파일 노드 구조 */
export interface FileNode {
  /** 파일/폴더의 전체 경로 */
  path: string
  /** 노드의 타입 */
  type: "file" | "folder"
  /** 자식 노드들 (폴더용) */
  children?: FileNode[]
}

/** 트리 초기화를 위한 API 페이로드 구조 */
export interface TreeInitPayload {
  type: "tree:init"
  payload: FileNode[]
}

/**
 * 내부 컴포넌트 타입들
 */

/** 컴포넌트 렌더링을 위한 파일 트리 노드 */
export interface FileTreeNode {
  /** 표시명 (경로에서 추출됨) */
  name: string
  /** 전체 경로 */
  path: string
  /** 노드 타입 */
  type: "file" | "folder"
  /** 폴더가 기본적으로 확장되어야 하는지 여부 */
  defaultExpanded?: boolean
  /** 자식 노드들 */
  children?: FileTreeNode[]
}

/**
 * API 응답 데이터를 컴포넌트 친화적 형식으로 변환합니다
 *
 * @param apiNodes - API로부터의 파일 노드 배열
 * @param depth - 현재 중첩 깊이 (확장 로직용)
 * @returns 변환된 파일 트리 노드들
 */
export const transformApiTreeToFileTree = (apiNodes: FileNode[], depth = 0): FileTreeNode[] => {
  return apiNodes.map(node => {
    // 경로에서 표시명 추출
    const name = node.path.split("/").pop() || node.path

    const transformedNode: FileTreeNode = {
      defaultExpanded: depth <= 0, // 기본적으로 루트 레벨만 확장
      name,
      path: node.path,
      type: node.type,
    }

    // 자식들을 재귀적으로 변환
    if (node.children?.length) {
      transformedNode.children = transformApiTreeToFileTree(node.children, depth + 1)
    }

    return transformedNode
  })
}

/**
 * 목 데이터
 */

/** 테스트용 목 API 응답 데이터 */
export const mockApiResponse: TreeInitPayload = {
  payload: [
    {
      children: [
        {
          children: [
            {
              children: [
                {
                  children: [
                    { path: "/src/components/ide/CodeEditor.tsx", type: "file" },
                    { path: "/src/components/ide/ResizeHandle.tsx", type: "file" },
                    { path: "/src/components/ide/TopBar.tsx", type: "file" },
                    {
                      children: [
                        { path: "/src/components/ide/sidebar/ActionButton.tsx", type: "file" },
                        { path: "/src/components/ide/sidebar/AppSidebar.tsx", type: "file" },
                        { path: "/src/components/ide/sidebar/FileExplorer.tsx", type: "file" },
                        { path: "/src/components/ide/sidebar/FileTree.tsx", type: "file" },
                        { path: "/src/components/ide/sidebar/NavigationPanel.tsx", type: "file" },
                        { path: "/src/components/ide/sidebar/ViewManager.tsx", type: "file" },
                      ],
                      path: "/src/components/ide/sidebar",
                      type: "folder",
                    },
                  ],
                  path: "/src/components/ide",
                  type: "folder",
                },
                {
                  children: [{ path: "/src/components/layout/IdeLayout.tsx", type: "file" }],
                  path: "/src/components/layout",
                  type: "folder",
                },
                {
                  children: [
                    { path: "/src/components/ui/Button.tsx", type: "file" },
                    { path: "/src/components/ui/Input.tsx", type: "file" },
                    { path: "/src/components/ui/collapsible.tsx", type: "file" },
                    { path: "/src/components/ui/separator.tsx", type: "file" },
                    { path: "/src/components/ui/sheet.tsx", type: "file" },
                    { path: "/src/components/ui/sidebar.tsx", type: "file" },
                    { path: "/src/components/ui/skeleton.tsx", type: "file" },
                    { path: "/src/components/ui/tooltip.tsx", type: "file" },
                  ],
                  path: "/src/components/ui",
                  type: "folder",
                },
              ],
              path: "/src/components",
              type: "folder",
            },
            {
              children: [
                { path: "/src/pages/DevNavigationPage.tsx", type: "file" },
                { path: "/src/pages/ErrorPage.tsx", type: "file" },
                { path: "/src/pages/IdePage.tsx", type: "file" },
                { path: "/src/pages/LoginPage.tsx", type: "file" },
                { path: "/src/pages/ProfileEditPage.tsx", type: "file" },
                { path: "/src/pages/SignUpPage.tsx", type: "file" },
              ],
              path: "/src/pages",
              type: "folder",
            },
            {
              children: [
                { path: "/src/hooks/useMobile.ts", type: "file" },
                { path: "/src/hooks/useLocalStorage.ts", type: "file" },
                { path: "/src/hooks/useDebounce.ts", type: "file" },
              ],
              path: "/src/hooks",
              type: "folder",
            },
            {
              children: [
                { path: "/src/lib/utils.ts", type: "file" },
                { path: "/src/lib/api.ts", type: "file" },
                { path: "/src/lib/constants.ts", type: "file" },
              ],
              path: "/src/lib",
              type: "folder",
            },
            {
              children: [{ path: "/src/router/index.tsx", type: "file" }],
              path: "/src/router",
              type: "folder",
            },
            {
              children: [
                { path: "/src/assets/icons.ts", type: "file" },
                { path: "/src/assets/folder-input.svg", type: "file" },
              ],
              path: "/src/assets",
              type: "folder",
            },
            { path: "/src/main.tsx", type: "file" },
            { path: "/src/index.css", type: "file" },
            { path: "/src/global.css", type: "file" },
            { path: "/src/vite-env.d.ts", type: "file" },
          ],
          path: "/src",
          type: "folder",
        },
        {
          children: [
            { path: "/public/vite.svg", type: "file" },
            { path: "/public/favicon.ico", type: "file" },
          ],
          path: "/public",
          type: "folder",
        },
        { path: "/package.json", type: "file" },
        { path: "/README.md", type: "file" },
        { path: "/vite.config.ts", type: "file" },
        { path: "/tsconfig.json", type: "file" },
        { path: "/.gitignore", type: "file" },
        { path: "/biome.jsonc", type: "file" },
      ],
      path: "/",
      type: "folder",
    },
  ],
  type: "tree:init",
}

/** 컴포넌트 사용을 위한 변환된 파일 트리 데이터 */
export const mockFileTree: FileTreeNode[] = transformApiTreeToFileTree(mockApiResponse.payload)
