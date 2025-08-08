// hooks/use-project-members.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useToast } from "@/shared/components/toast-context.tsx"
import type { ApiResponse, ProjectMember } from "@/shared/types/api.ts"
import type { UserPermission } from "../api/project-api.ts"
import { projectApi } from "../api/project-api.ts"

// Query Keys 상수화
export const projectQueryKeys = {
  members: (projectId: string) => ["projects", projectId, "members"] as const,
  permission: (projectId: string) => ["projects", projectId, "permission"] as const,
} as const

// 에러 메시지 추출 유틸
const extractErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    const apiResponse = error.response?.data as ApiResponse<null>
    if (apiResponse?.error?.message) {
      return apiResponse.error.message
    }
  }
  return defaultMessage
}

// 공통 에러 처리 함수 생성기
const createMutationErrorHandler = (
  queryClient: ReturnType<typeof useQueryClient>,
  addToast: ReturnType<typeof useToast>["addToast"],
  projectId: string
) => {
  return (
    error: unknown,
    defaultMessage: string,
    logMessage: string,
    context?: { previousMembers?: ProjectMember[] }
  ) => {
    if (context?.previousMembers) {
      queryClient.setQueryData(projectQueryKeys.members(projectId), context.previousMembers)
    }

    console.error(logMessage, error)
    addToast({
      type: "error",
      title: extractErrorMessage(error, defaultMessage),
      duration: 3000,
    })
  }
}

export const useInviteUser = (projectId: string) => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // 공통 함수 사용
  const handleMutationError = createMutationErrorHandler(queryClient, addToast, projectId)

  return useMutation({
    mutationFn: (emails: string[]) => projectApi.inviteUser(projectId, emails),

    onError: error => {
      handleMutationError(error, "사용자 초대에 실패했습니다.", "❌ 사용자 초대 실패:")
    },

    onSuccess: () => {
      addToast({
        type: "success",
        title: "Users invited successfully.",
        duration: 2000,
      })

      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.members(projectId),
      })
    },
  })
}

// TODO: IDE 페이지 여러 곳에서 사용 중 페이지 진입 시 한번만 받고 캐싱하기
export const useProjectMembers = (projectId: string) => {
  return useQuery<ProjectMember[]>({
    queryKey: projectQueryKeys.members(projectId),
    queryFn: () => projectApi.getProjectMembers(projectId),
    enabled: !!projectId,
  })
}

export const useProjectPermission = (projectId: string) => {
  return useQuery<UserPermission>({
    queryKey: projectQueryKeys.permission(projectId),
    queryFn: () => projectApi.getMyPermission(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateMemberRole = (projectId: string) => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // 공통 함수 사용
  const handleMutationError = createMutationErrorHandler(queryClient, addToast, projectId)

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "READ" | "WRITE" }) =>
      projectApi.updateMemberRole(projectId, userId, role),

    onMutate: async ({ userId, role }) => {
      await queryClient.cancelQueries({
        queryKey: projectQueryKeys.members(projectId),
      })

      const previousMembers = queryClient.getQueryData<ProjectMember[]>(
        projectQueryKeys.members(projectId)
      )

      queryClient.setQueryData<ProjectMember[]>(
        projectQueryKeys.members(projectId),
        old => old?.map(member => (member.userId === userId ? { ...member, role } : member)) || []
      )

      return { previousMembers }
    },

    onError: (error, _variables, context) => {
      handleMutationError(error, "Failed to update member role.", "❌ 권한 변경 실패:", context)
    },

    onSuccess: response => {
      addToast({
        type: "success",
        title: response.data as string,
        duration: 2000,
      })
    },
  })
}

export const useRemoveMember = (projectId: string) => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // 공통 함수 사용
  const handleMutationError = createMutationErrorHandler(queryClient, addToast, projectId)

  return useMutation({
    mutationFn: (userId: string) => projectApi.removeMember(projectId, userId),

    onMutate: async userId => {
      await queryClient.cancelQueries({
        queryKey: projectQueryKeys.members(projectId),
      })

      const previousMembers = queryClient.getQueryData<ProjectMember[]>(
        projectQueryKeys.members(projectId)
      )

      queryClient.setQueryData<ProjectMember[]>(
        projectQueryKeys.members(projectId),
        old => old?.filter(member => member.userId !== userId) || []
      )

      return { previousMembers }
    },

    onError: (error, _userId, context) => {
      handleMutationError(error, "Failed to remove member.", "❌ 멤버 삭제 실패:", context)
    },

    onSuccess: response => {
      addToast({
        type: "success",
        title: response.data as string,
        duration: 2000,
      })
    },
  })
}
