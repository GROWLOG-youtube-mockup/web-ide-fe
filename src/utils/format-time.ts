// 시간만 hh:mm AM/PM 형식으로 포맷팅
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ""
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // 0시는 12로
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes
  return `${hours}:${minutesStr} ${ampm}`
}
