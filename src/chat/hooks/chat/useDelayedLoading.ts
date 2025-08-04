import { useEffect, useState } from "react"

/**
 * 일정 시간(isActive가 true) 이상 지속될 때만 true가 되는 딜레이 로딩 훅
 * @param isActive 로딩 등 상태
 * @param delayMs 딜레이(ms), 기본값 500
 */
export function useDelayedLoading(isActive: boolean, delayMs = 500) {
  const [delayed, setDelayed] = useState(false)
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    if (isActive) {
      timeout = setTimeout(() => setDelayed(true), delayMs)
    } else {
      setDelayed(false)
      if (timeout) clearTimeout(timeout)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isActive, delayMs])
  return delayed
}
