import apiClient from "@/services/api/index"
import type {
  ApiResponse,
  FileNode,
  FileOpenResponse,
  FileSearchResponse,
  TreeInitPayload,
  TreeNodeDto,
  WebSocketMessage,
} from "@/types/api"

// STOMP 클라이언트 타입들
interface StompMessage {
  body: string
}

interface StompSubscription {
  unsubscribe: () => void
}

interface StompClient {
  subscribe: (destination: string, callback: (message: StompMessage) => void) => StompSubscription
  send: (destination: string, headers?: Record<string, string>, body?: string) => void
}

/**
 * 파일 시스템 API (함수 객체 방식)
 */
export const createFileSystemApi = (projectId: string, stompClient?: StompClient) => ({
  // ========== WebSocket: 파일 트리 ==========
  getFileTree: async (): Promise<TreeInitPayload> => {
    if (!stompClient) {
      console.log("[FileSystemApi] WebSocket 클라이언트 없음, 빈 트리 반환")
      return {
        type: "tree:init",
        payload: [
          {
            path: "/",
            type: "folder" as const,
            children: [],
          },
        ],
      }
    }

    return new Promise((resolve, reject) => {
      const subscription = stompClient.subscribe(
        `/topic/projects/${projectId}/tree`,
        (message: StompMessage) => {
          try {
            const data: WebSocketMessage = JSON.parse(message.body)

            if (data.type === "tree:init") {
              const treeInitPayload: TreeInitPayload = {
                type: "tree:init",
                payload: convertTreeNodeDtoToFileNode(data.payload as TreeNodeDto[]),
              }

              subscription.unsubscribe()
              resolve(treeInitPayload)
            }
          } catch (error) {
            subscription.unsubscribe()
            reject(error)
          }
        }
      )

      stompClient.send(`/app/projects/${projectId}/tree/init`, {})

      setTimeout(() => {
        subscription.unsubscribe()
        reject(new Error("WebSocket 응답 타임아웃"))
      }, 10000)
    })
  },

  // ========== REST API: 파일 조작들 ==========

  // GET /projects/{projectId}/files - 파일 열기
  openFile: async (filePath: string): Promise<FileOpenResponse> => {
    const response = await apiClient.get<ApiResponse<FileOpenResponse>>(
      `/projects/${projectId}/files`,
      { params: { path: filePath } }
    )

    if (!response.data.data) {
      throw new Error(`파일을 열 수 없습니다: ${filePath}`)
    }

    return response.data.data
  },

  // PUT /projects/{projectId}/files - 파일 저장
  saveFile: async (filePath: string, content: string): Promise<void> => {
    await apiClient.put(`/projects/${projectId}/files`, {
      path: filePath,
      content: content,
    })
  },

  // POST /projects/{projectId}/files - 파일 생성
  createFile: async (parentPath: string, fileName: string): Promise<void> => {
    const fullPath = parentPath === "/" ? `/${fileName}` : `${parentPath}/${fileName}`
    await apiClient.post(`/projects/${projectId}/files`, {
      type: "file",
      path: fullPath,
    })
  },

  // POST /projects/{projectId}/files - 폴더 생성
  createFolder: async (parentPath: string, folderName: string): Promise<void> => {
    const fullPath = parentPath === "/" ? `/${folderName}` : `${parentPath}/${folderName}`
    await apiClient.post(`/projects/${projectId}/files`, {
      type: "folder",
      path: fullPath,
    })
  },

  // DELETE /projects/{projectId}/files/{filePath} - 삭제
  delete: async (filePath: string): Promise<void> => {
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath

    await apiClient.delete(`/projects/${projectId}/files/${encodeURIComponent(cleanPath)}`)
  },

  // PATCH /projects/{projectId}/files/{filePath} - 이름 변경/이동
  rename: async (oldPath: string, newName: string): Promise<void> => {
    const directory = oldPath.substring(0, oldPath.lastIndexOf("/"))
    const newPath = `${directory}/${newName}`

    await apiClient.patch(
      `/projects/${projectId}/files/{filePath}`, // 실제 엔드포인트로 변경 필요
      {
        fromPath: oldPath,
        toPath: newPath,
      }
    )
  },

  move: async (sourcePath: string, targetPath: string): Promise<void> => {
    await apiClient.patch(
      `/projects/${projectId}/files/{filePath}`, // 실제 엔드포인트로 변경 필요
      {
        fromPath: sourcePath,
        toPath: targetPath,
      }
    )
  },

  // GET /projects/{projectId}/files/search - 검색
  searchFiles: async (query: string): Promise<FileSearchResponse[]> => {
    const response = await apiClient.get<ApiResponse<FileSearchResponse[]>>(
      `/projects/${projectId}/files/search`,
      { params: { q: query } }
    )
    return response.data.data || []
  },

  refreshTree: async (): Promise<void> => {
    if (stompClient) {
      console.log("[API] 트리 새로고침 요청")
      stompClient.send(`/app/projects/${projectId}/tree/init`, {})
    }
  },
})

// 헬퍼 함수 (클래스 밖으로 이동)
const convertTreeNodeDtoToFileNode = (nodes: TreeNodeDto[]): FileNode[] => {
  return nodes.map(node => ({
    path: node.path.startsWith("/") ? node.path : `/${node.path}`,
    type: node.type,
    children: node.children ? convertTreeNodeDtoToFileNode(node.children) : undefined,
  }))
}

/**
 * Mock API (개발용)
 */
export const createMockFileSystemApi = () => ({
  getFileTree: async (): Promise<TreeInitPayload> => ({
    type: "tree:init" as const,
    payload: [
      {
        path: "/",
        type: "folder" as const,
        children: [
          {
            path: "/README1.md",
            type: "file" as const,
          },
          {
            path: "/src",
            type: "folder" as const,
            children: [
              {
                path: "/src/App.tsx",
                type: "file" as const,
              },
            ],
          },
        ],
      },
    ],
  }),

  openFile: async (filePath: string): Promise<FileOpenResponse> => ({
    projectId: 1,
    filePath,
    fileName: filePath.split("/").pop() || "",
    content: `// Mock content for ${filePath}\nconsole.log('Hello World');`,
    language: "typescript",
    editable: true,
  }),

  saveFile: async (filePath: string, content: string): Promise<void> => {
    console.log(`[Mock] 파일 저장: ${filePath}, content length: ${content.length}`)
  },

  createFile: async (parentPath: string, fileName: string): Promise<void> => {
    console.log(`[Mock] 파일 생성: ${parentPath}/${fileName}`)
  },

  createFolder: async (parentPath: string, folderName: string): Promise<void> => {
    console.log(`[Mock] 폴더 생성: ${parentPath}/${folderName}`)
  },

  delete: async (filePath: string): Promise<void> => {
    console.log(`[Mock] 파일 삭제: ${filePath}`)
  },

  rename: async (oldPath: string, newName: string): Promise<void> => {
    console.log(`[Mock] 파일 이름 변경: ${oldPath} → ${newName}`)
  },

  move: async (sourcePath: string, targetPath: string): Promise<void> => {
    console.log(`[Mock] 파일 이동: ${sourcePath} → ${targetPath}`)
  },

  searchFiles: async (query: string): Promise<FileSearchResponse[]> => {
    console.log(`[Mock] 파일 검색: ${query}`)
    return [
      {
        id: 1,
        name: `${query}.ts`,
        type: "file",
        path: `/src/${query}.ts`,
      },
    ]
  },

  refreshTree: async (): Promise<void> => {
    console.log(`[Mock] 파일 트리 새로고침`)
    // Mock에서는 실제로는 아무것도 안 함
  },
})

/**
 * 팩토리 함수
 */
export const createFileSystemService = (projectId: string, stompClient?: StompClient) => {
  // 개발환경이더라도 실제 API 사용
  return createFileSystemApi(projectId, stompClient)
}
