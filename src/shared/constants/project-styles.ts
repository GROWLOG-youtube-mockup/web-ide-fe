// 프로젝트 관련 스타일 상수
import { AUTH_STYLES } from "@/shared/constants/auth-styles"

export const PROJECT_STYLES = {
  // 폼 레이아웃
  form: "mt-4 flex flex-col gap-4",

  // 라벨 스타일 (프로젝트 전용 - 세로 배치)
  label: "flex flex-col gap-1 font-medium text-xs text-zinc-700 mb-1",

  // 인풋 필드 스타일 (AUTH_STYLES에서 참조)
  field: AUTH_STYLES.field,

  // 에러 상태 필드 (AUTH_STYLES에서 참조)
  errorField: AUTH_STYLES.errorField,

  // 에러 메시지 (AUTH_STYLES에서 참조)
  errorMessage: AUTH_STYLES.errorMessage,
} as const
