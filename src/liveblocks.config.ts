// liveblocks.config.ts
import { createClient } from "@liveblocks/client"
import { createLiveblocksContext, createRoomContext } from "@liveblocks/react"

//라이브 블록 관련 설정파일입니다. api키는 일단 여기서 관리하고 공식 문서상에서 권장하는 방식대로 설정파일에서 라이브블록과 룸관련 컨텍스트를 관리합니다.

const client = createClient({
  publicApiKey: "pk_dev_wQ0VERKYYvbkxVssDWq-bPhRUmTxr9DLbqcRIpBPpLuN3FqqnmILO5Njp40g5HEi",
})

// Room 컨텍스트 (개별 방 관련)
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useOthers,
    useBroadcastEvent,
    useEventListener,
  },
} = createRoomContext(client)

// Liveblocks 컨텍스트 (전역 기능)
export const { LiveblocksProvider, useInboxNotifications } = createLiveblocksContext(client)
