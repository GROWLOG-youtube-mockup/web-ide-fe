import { create } from "zustand"
import type { Project, ProjectFilter } from "@/shared/types/project.ts"
import { transformProjectResponse } from "@/shared/utils/project-transform.ts"
import { getProjects } from "../api/project-api.ts"

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

  // API 호출 액션들
  fetchProjects: (filter?: ProjectFilter) => Promise<void>
  refreshProjects: () => Promise<void>
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

  // API 호출 액션들
  fetchProjects: async filter => {
    set({ loading: true, error: null })

    try {
      // 실제 API 호출
      const apiFilter = filter === "own" ? "own" : filter === "joined" ? "joined" : undefined
      const projects = await getProjects(apiFilter)

      // ProjectResponse[]를 Project[]로 변환
      const transformedProjects = projects.map(transformProjectResponse)

      set({
        projects: transformedProjects,
        loading: false,
        currentFilter: filter || "all",
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "프로젝트를 불러오는데 실패했습니다.",
        loading: false,
      })
    }
  },

  refreshProjects: async () => {
    const { currentFilter, fetchProjects } = get()
    await fetchProjects(currentFilter)
  },
}))
