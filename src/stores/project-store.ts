import { create } from "zustand"
import type { Project, ProjectFilter, ProjectsApiResponse } from "@/types/project"
import { transformProjectResponse } from "@/types/project"

interface ProjectStore {
  // 상태
  projects: Project[]
  loading: boolean
  error: string | null
  currentFilter: ProjectFilter

  // 액션들
  setProjects: (projects: Project[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilter: (filter: ProjectFilter) => void

  // 프로젝트 관련 액션들
  toggleProject: (projectId: number) => void
  updateProject: (projectId: number, updates: Partial<Project>) => void

  // API 호출 액션들
  fetchProjects: (filter?: ProjectFilter) => Promise<void>
  refreshProjects: () => Promise<void>
}

// Mock API 함수 (실제 구현 시 별도 파일로 분리)
const mockFetchProjects = async (filter?: ProjectFilter): Promise<ProjectsApiResponse> => {
  // 실제로는 axios 등을 사용해서 API 호출
  await new Promise(resolve => setTimeout(resolve, 1000)) // 로딩 시뮬레이션

  const mockData: ProjectsApiResponse = {
    success: true,
    data: [
      {
        projectId: 1,
        name: "webide-project",
        description: "Java 기반 테Java 기반 테스트용Java 기반 테스트용Java 기반 테스트용스트용",
        ownerName: "현아",
        memberNames: [
          { userId: 1, name: "현아", role: "owner" },
          { userId: 2, name: "지훈", role: "write" },
          { userId: 3, name: "민수", role: "read" },
          { userId: 4, name: "소영", role: "write" },
          { userId: 5, name: "정호", role: "read" },
          { userId: 6, name: "미경", role: "write" },
        ],
        myRole: "OWNER",
        status: "ACTIVE",
        createdAt: "2025-07-01T10:00:00",
        updatedAt: "2025-07-01T10:00:00",
      },
      {
        projectId: 4,
        name: "webide-project",
        description: "Java 기반 테Java 기반 테스트용Java 기반 테스트용Java 기반 테스트용스트용",
        ownerName: "현아",
        memberNames: [
          { userId: 1, name: "현아", role: "owner" },
          { userId: 2, name: "지훈", role: "write" },
          { userId: 3, name: "민수", role: "read" },
          { userId: 4, name: "소영", role: "write" },
          { userId: 5, name: "정호", role: "read" },
          { userId: 6, name: "미경", role: "write" },
        ],
        myRole: "OWNER",
        status: "ACTIVE",
        createdAt: "2025-07-01T10:00:00",
        updatedAt: "2025-07-01T10:00:00",
      },
      {
        projectId: 2,
        name: "react-project",
        description: "React 기반 프로젝트",
        ownerName: "지훈",
        memberNames: [
          { userId: 2, name: "지훈", role: "owner" },
          { userId: 1, name: "현아", role: "write" },
        ],
        myRole: "WRITE",
        status: "ACTIVE",
        createdAt: "2025-07-02T10:00:00",
        updatedAt: "2025-07-02T10:00:00",
      },
      {
        projectId: 3,
        name: "vue-project",
        description: "Vue.js 기반 프로젝트",
        ownerName: "민수",
        memberNames: [
          { userId: 3, name: "민수", role: "owner" },
          { userId: 1, name: "현아", role: "read" },
        ],
        myRole: "READ",
        status: "ACTIVE",
        createdAt: "2025-07-03T10:00:00",
        updatedAt: "2025-07-03T10:00:00",
      },
    ],
    error: null,
  }

  // 필터 적용
  if (filter) {
    mockData.data = mockData.data.filter(project => {
      if (filter === "own") return project.myRole === "OWNER"
      if (filter === "joined") return project.myRole !== "OWNER"
      return true
    })
  }
  return mockData
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // 초기 상태
  projects: [],
  loading: false,
  error: null,
  currentFilter: "all",

  // 기본 setter들
  setProjects: projects => set({ projects }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setFilter: filter => set({ currentFilter: filter }),

  // 프로젝트 관련 액션들
  toggleProject: projectId => {
    set(state => ({
      projects: state.projects.map(project =>
        project.id === projectId ? { ...project, isToggled: !project.isToggled } : project
      ),
    }))
  },

  updateProject: (projectId, updates) => {
    set(state => ({
      projects: state.projects.map(project =>
        project.id === projectId ? { ...project, ...updates } : project
      ),
    }))
  },

  // API 호출 액션들
  fetchProjects: async filter => {
    set({ loading: true, error: null })

    try {
      const response = await mockFetchProjects(filter)

      if (response.success) {
        const projects = response.data.map(transformProjectResponse)
        set({
          projects,
          loading: false,
          currentFilter: filter || "all",
        })
      } else {
        set({
          error: response.error || "프로젝트를 불러오는데 실패했습니다.",
          loading: false,
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        loading: false,
      })
    }
  },

  refreshProjects: async () => {
    const { currentFilter, fetchProjects } = get()
    await fetchProjects(currentFilter)
  },
}))
