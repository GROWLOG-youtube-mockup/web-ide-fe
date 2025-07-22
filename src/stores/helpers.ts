// stores/split-editor/helpers.ts
import type { MosaicNode } from "react-mosaic-component"
import type { PanelPosition, SplitLayout, SplitType } from "@/types/editor/types"

/**
 * 패널 순서를 위치별로 정렬하여 반환합니다
 * @param layout - 현재 레이아웃 정보
 * @returns 정렬된 패널 ID 배열
 */
export const getPanelOrder = (layout: SplitLayout): string[] => {
  const { panelPositions } = layout
  const order: string[] = []

  // 위치별로 정렬 (좌상단부터 시계방향)
  const positions: PanelPosition[] = ["main", "right", "bottom", "bottom-right"]

  positions.forEach(position => {
    const panelsInPosition = Object.entries(panelPositions)
      .filter(([_, pos]) => pos === position)
      .map(([panelId]) => panelId)
    order.push(...panelsInPosition)
  })

  return order
}

/**
 * 분할 타입에 따른 Mosaic 노드를 생성합니다
 * @param panelIds - 패널 ID 배열
 * @param splitType - 분할 타입
 * @returns Mosaic 노드 또는 null
 */
export const createMosaicNode = (
  panelIds: string[],
  splitType: SplitType
): MosaicNode<string> | null => {
  if (panelIds.length === 0) return null
  if (panelIds.length === 1) return panelIds[0]

  switch (splitType) {
    case "vertical":
      return {
        direction: "row",
        first: panelIds[0],
        second: panelIds[1],
        splitPercentage: 50,
      }

    case "horizontal":
      return {
        direction: "column",
        first: panelIds[0],
        second: panelIds[1],
        splitPercentage: 50,
      }

    case "quad":
      return {
        direction: "row",
        first: {
          direction: "column",
          first: panelIds[0] || "main",
          second: panelIds[2] || "bottom-left",
          splitPercentage: 50,
        },
        second: {
          direction: "column",
          first: panelIds[1] || "top-right",
          second: panelIds[3] || "bottom-right",
          splitPercentage: 50,
        },
        splitPercentage: 50,
      }

    default:
      return panelIds[0]
  }
}

/**
 * 패널 ID를 기반으로 고유한 새 패널 ID를 생성합니다
 * @param existingIds - 기존 패널 ID 목록
 * @param prefix - 접두사 (기본값: 'panel')
 * @returns 고유한 패널 ID
 */
export const generateUniqueId = (existingIds: string[], prefix = "panel"): string => {
  let counter = 1
  let newId = `${prefix}-${counter}`

  while (existingIds.includes(newId)) {
    counter++
    newId = `${prefix}-${counter}`
  }

  return newId
}

/**
 * 패널 위치를 기반으로 다음 분할 위치를 제안합니다
 * @param currentPosition - 현재 패널 위치
 * @param splitDirection - 분할 방향 ('horizontal' | 'vertical')
 * @returns 제안된 새 패널 위치
 */
export const suggestNextPosition = (
  currentPosition: PanelPosition,
  splitDirection: "horizontal" | "vertical"
): PanelPosition => {
  if (splitDirection === "vertical") {
    return currentPosition === "main" ? "right" : "bottom-right"
  }
  return currentPosition === "main" ? "bottom" : "bottom-right"
}

/**
 * 파일 확장자를 기반으로 파일 타입을 반환합니다
 * @param fileName - 파일명
 * @returns 파일 타입 문자열
 */
export const getFileType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase()

  const typeMap: Record<string, string> = {
    css: "CSS",
    html: "HTML",
    js: "JavaScript",
    json: "JSON",
    jsx: "JavaScript React",
    md: "Markdown",
    scss: "SCSS",
    ts: "TypeScript",
    tsx: "TypeScript React",
    txt: "Text",
  }

  return typeMap[extension || ""] || "Unknown"
}

/**
 * 패널 레이아웃이 유효한지 검증합니다
 * @param layout - 검증할 레이아웃
 * @param panelIds - 현재 패널 ID 목록
 * @returns 유효성 검증 결과
 */
export const validateLayout = (
  layout: SplitLayout,
  panelIds: string[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // 패널 위치 검증
  const positionPanels = Object.keys(layout.panelPositions)
  const missingPanels = panelIds.filter(id => !positionPanels.includes(id))
  const extraPanels = positionPanels.filter(id => !panelIds.includes(id))

  if (missingPanels.length > 0) {
    errors.push(`Missing panels in layout: ${missingPanels.join(", ")}`)
  }

  if (extraPanels.length > 0) {
    errors.push(`Extra panels in layout: ${extraPanels.join(", ")}`)
  }

  // 분할 타입과 패널 수 일치 검증
  if (layout.type === "single" && panelIds.length !== 1) {
    errors.push("Single layout should have exactly 1 panel")
  }

  if (layout.type === "quad" && panelIds.length !== 4) {
    errors.push("Quad layout should have exactly 4 panels")
  }

  return {
    errors,
    isValid: errors.length === 0,
  }
}
