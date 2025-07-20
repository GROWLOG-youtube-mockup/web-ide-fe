// liveblocks.config.ts
import { createClient } from "@liveblocks/client"
import { createRoomContext } from "@liveblocks/react"

const client = createClient({
  publicApiKey: "pk_dev_lWz_vEA2Xx6PMB60x9l8v8gggPv0ttPTJ7pCvm5etnhIZXYbcsSALmQF7-qdql7G",
})

// suspense 버전 export
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
