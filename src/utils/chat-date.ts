import type { ChatMessage } from "@/types/chat"

// 날짜(요일) 라벨 포맷: 2025.08.03 (토)
export const getDateLabel = (dateString: string) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ""
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
  return `${year}.${month}.${day} (${weekDay})`
}

// 날짜별로 메시지 그룹핑
export const groupMessagesByDate = (messages: ChatMessage[]) => {
  const groups: { date: string; messages: ChatMessage[] }[] = []
  messages.forEach(msg => {
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
