import type { ChatMessage, ChatMessagePart, ParsedChatMessage } from "@/shared/types/chat.ts"

// 경로에서 :라인번호를 제거하고, 파일명만 추출하는 유틸
const extractPathAndFileName = (rawPath: string) => {
  // '경로:라인번호' 형태라면 :라인번호 제거
  const cleanPath = rawPath.replace(/:\d+$/, "")
  let fileName = cleanPath.split("/").pop() || cleanPath
  // 혹시 파일명에 :라인번호가 붙어있으면 제거
  if (fileName.includes(":")) fileName = fileName.split(":")[0]
  return { cleanPath, fileName }
}

/**
 * 코드 링크(파일+라인) 정보를 모두 추출
 * - [파일명:라인번호](ide://경로)
 * - #file:경로:라인번호
 */
const parseAllCodeLinks = (text: string) => {
  const result = []
  // [파일명:라인번호](ide://경로)
  const bracketRegex = /\[([^:]+):(\d+)\]\(ide:\/\/([^)]+)\)/g
  for (const match of text.matchAll(bracketRegex)) {
    const { cleanPath, fileName } = extractPathAndFileName(match[3])
    result.push({
      fileName,
      lineNumber: parseInt(match[2], 10),
      fullPath: cleanPath,
      originalText: match[0],
    })
  }
  // #file:경로:라인번호
  const hashFileRegex = /#file:([^\s:]+):(\d+)/g
  for (const match of text.matchAll(hashFileRegex)) {
    const { cleanPath, fileName } = extractPathAndFileName(match[1])
    result.push({
      fileName,
      lineNumber: parseInt(match[2], 10),
      fullPath: cleanPath,
      originalText: match[0],
    })
  }
  return result
}

/**
 * 메시지 본문을 텍스트/링크 조각 배열로 분리
 * - 일반 텍스트와 코드 링크(두 패턴 모두)를 순서대로 분리
 */
const splitMessageParts = (text: string): ChatMessagePart[] => {
  const parts: ChatMessagePart[] = []
  const matches: { idx: number; match: RegExpMatchArray; type: "bracket" | "hashfile" }[] = []

  // [파일명:라인번호](ide://경로)
  const bracketRegex = /\[([^:]+):(\d+)\]\(ide:\/\/([^)]+)\)/g
  for (const m of text.matchAll(bracketRegex)) {
    matches.push({ idx: m.index ?? 0, match: m, type: "bracket" })
  }
  // #file:경로:라인번호
  const hashFileRegex = /#file:([^\s:]+):(\d+)/g
  for (const m of text.matchAll(hashFileRegex)) {
    matches.push({ idx: m.index ?? 0, match: m, type: "hashfile" })
  }
  // 매치 순서대로 정렬
  matches.sort((a, b) => a.idx - b.idx)
  let lastIndex = 0
  for (const { idx, match, type } of matches) {
    if (idx > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, idx) })
    }
    if (type === "bracket") {
      const { cleanPath, fileName } = extractPathAndFileName(match[3])
      parts.push({
        type: "link",
        fileName,
        lineNumber: parseInt(match[2], 10),
        fullPath: cleanPath,
        originalText: match[0],
      })
      lastIndex = idx + match[0].length
    } else if (type === "hashfile") {
      const { cleanPath, fileName } = extractPathAndFileName(match[1])
      parts.push({
        type: "link",
        fileName,
        lineNumber: parseInt(match[2], 10),
        fullPath: cleanPath,
        originalText: match[0],
      })
      lastIndex = idx + match[0].length
    }
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) })
  }
  return parts
}

// ChatMessage를 ParsedChatMessage로 변환
export const toParsedChatMessage = (msg: ChatMessage): ParsedChatMessage => {
  return {
    ...msg,
    links: parseAllCodeLinks(msg.content),
    parts: splitMessageParts(msg.content),
  }
}

// 날짜(요일) 라벨 포맷: 2025.08.03 (Sun)
export const getDateLabel = (dateString: string) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ""
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
  return `${year}.${month}.${day} (${weekDay})`
}

export const groupMessagesByDateWithParsedContent = (messages: ParsedChatMessage[]) => {
  // 각 사용자별로 마지막 메시지 타입을 추적하여 중복 ENTER 필터링
  const userLastMessageType: Record<number, "ENTER" | "LEAVE"> = {}

  const filteredMessages = messages.filter(msg => {
    // ENTER/LEAVE가 아닌 메시지는 그대로 포함
    if (msg.messageType !== "ENTER" && msg.messageType !== "LEAVE") return true

    // userId가 없으면 그대로 포함
    if (!msg.userId) return true

    const lastType = userLastMessageType[msg.userId]

    // 첫 번째 메시지이거나, 이전과 다른 타입이면 포함
    if (!lastType || lastType !== msg.messageType) {
      userLastMessageType[msg.userId] = msg.messageType
      return true
    }

    // 같은 타입의 연속 메시지는 제외 (ENTER->ENTER 또는 LEAVE->LEAVE)
    return false
  })

  const groups: { date: string; messages: ParsedChatMessage[] }[] = []
  filteredMessages.forEach(msg => {
    const date = new Date(msg.sentAt)
    if (Number.isNaN(date.getTime())) return
    const dateKey = date.toISOString().slice(0, 10) // YYYY-MM-DD
    if (groups.length === 0 || groups[groups.length - 1].date !== dateKey) {
      groups.push({ date: dateKey, messages: [msg] })
    } else {
      groups[groups.length - 1].messages.push(msg)
    }
  })
  return groups
}
