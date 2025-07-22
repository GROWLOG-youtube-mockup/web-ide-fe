// stores/userStore.ts

import type { JsonObject } from "@liveblocks/client"
import { create } from "zustand"

export interface UserInfo {
  color: string // 사용자 고유 색상 (커서, 이름 표시용)
  id: string // 사용자 고유 식별자
  name: string // 사용자 표시 이름
  avatar?: string // 프로필 이미지 URL (선택적)
}

// UserInfo를 JsonObject로 변환하는 함수(JsonObject는 라이브 블록 자체 지원)
export const toJsonObject = (userInfo: UserInfo): JsonObject => ({
  color: userInfo.color,
  id: userInfo.id,
  name: userInfo.name,
  ...(userInfo.avatar && { avatar: userInfo.avatar }),
})

interface UserStore {
  userInfo: UserInfo | null // 현재 사용자 정보
  getUserAsJsonObject: () => JsonObject | null // JsonObject 변환 함수
  setUserInfo: (info: UserInfo) => void // 사용자 정보 설정
  initializeUser: () => UserInfo // 사용자 초기화
}

export const useUserStore = create<UserStore>((set, get) => ({
  getUserAsJsonObject: () => {
    const { userInfo } = get() // 현재 userInfo 상태 가져오기
    return userInfo ? toJsonObject(userInfo) : null // 있으면 변환, 없으면 null
  },
  initializeUser: () => {
    const userInfo: UserInfo = {
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 일단 랜덤 색상
      id: Math.random().toString(36).substr(2, 9), // 일단 랜덤 ID
      name: "유저1", // 일단 하드코딩 이름(추후 계정 정보 가져와서 반영)
    }

    set({ userInfo }) // 스토어에 저장
    return userInfo // 생성된 정보 반환
  },

  setUserInfo: info => set({ userInfo: info }),
  userInfo: null,
}))
