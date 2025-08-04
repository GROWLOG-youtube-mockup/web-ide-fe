import type { ChatMessage, ChatMessagePart, ParsedChatMessage } from "@/backup/types/chat"

// 코드 링크 파싱 타입
export interface ParsedCodeLink {
  fileName: string
  lineNumber: number
  fullPath: string
  originalText: string
}

/**
 * 문자열에서 모든 코드 링크를 파싱하여 ParsedCodeLink[]로 반환
 */
export function parseAllCodeLinks(text: string): ParsedCodeLink[] {
  const regex = /\[([^:]+):(\d+)\]\(ide:\/\/([^)]+)\)/g
  const result: ParsedCodeLink[] = []
  for (const match of text.matchAll(regex)) {
    result.push({
      fileName: match[1],
      lineNumber: parseInt(match[2], 10),
      fullPath: match[3],
      originalText: match[0],
    })
  }
  return result
}

/**
 * 메시지 본문을 텍스트/링크 조각 배열로 분리
 */
export function splitMessageParts(text: string): ChatMessagePart[] {
  const regex = /\[([^:]+):(\d+)\]\(ide:\/\/([^)]+)\)/g
  const parts: ChatMessagePart[] = []
  let lastIndex = 0
  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0
    if (idx > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, idx) })
    }
    parts.push({
      type: "link",
      fileName: match[1],
      lineNumber: parseInt(match[2], 10),
      fullPath: match[3],
      originalText: match[0],
      value: `${match[1]}:${match[2]}`,
    } as ChatMessagePart)
    lastIndex = idx + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) })
  }
  return parts
}

/**
 * ChatMessage를 ParsedChatMessage로 변환
 */
export function toParsedChatMessage(msg: ChatMessage): ParsedChatMessage {
  return {
    ...msg,
    links: parseAllCodeLinks(msg.content),
    parts: splitMessageParts(msg.content),
  }
}
// 코드 링크 파싱 타입
export interface ParsedCodeLink {
  fileName: string
  lineNumber: number
  fullPath: string
  originalText: string
}
