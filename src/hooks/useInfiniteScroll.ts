import type { RefObject } from "react"
import { useEffect, useRef } from "react"

export interface UseInfiniteScrollProps {
  itemsLength: number
  hasMore: boolean
  isFetching: boolean
  fetchNextPage: () => void
  containerRef: RefObject<HTMLElement | null>
  endRef: RefObject<HTMLElement | null>
}

export function useInfiniteScroll({
  itemsLength,
  hasMore,
  isFetching,
  fetchNextPage,
  containerRef,
  endRef,
}: UseInfiniteScrollProps) {
  const isFirstLoadRef = useRef(true)
  const prevHeightRef = useRef<number>(0)
  const prevItemsLen = useRef(itemsLength)

  // 최초 진입 하단 이동, 페이징 후 위치 보정
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 최초 진입 시 맨 아래로 이동
    if (isFirstLoadRef.current && endRef.current) {
      endRef.current.scrollIntoView({ block: "end" })
      isFirstLoadRef.current = false
      prevItemsLen.current = itemsLength
      return
    }

    // items가 늘어나면(페이징) 기존 위치 보정
    if (itemsLength > prevItemsLen.current) {
      const diff = container.scrollHeight - prevHeightRef.current
      if (diff > 0) container.scrollTop = diff
    }
    prevItemsLen.current = itemsLength
  }, [itemsLength, containerRef, endRef])

  // 무한 스크롤 (위로 스크롤 시 이전 데이터 로드)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !isFetching) {
        prevHeightRef.current = container.scrollHeight
        fetchNextPage()
      }
    }
    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [fetchNextPage, hasMore, isFetching, containerRef])
}
