import { Camera } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/common/ToastContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AUTH_LAYOUT } from "@/constants/auth-styles"

interface ProfileAvatarProps {
  src?: string
  onImageChange?: (imageUrl: string) => void
  onImageSelect: (file: File) => void // Required로 변경
}

export function ProfileAvatar({
  src = "https://github.com/shadcn.png",
  onImageChange,
  onImageSelect,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewSrc, setPreviewSrc] = useState<string>(src)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const { addToast } = useToast()

  // src prop이 변경되면 previewSrc도 업데이트
  useEffect(() => {
    setPreviewSrc(src)
  }, [src])

  // cleanup: Object URL 해제
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // UI에서 기본적인 파일 유효성 검사
    // 파일 크기 체크 (5MB 제한)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      addToast({
        type: "error",
        title: "File size too large. Please select a file under 5MB.",
        duration: 3000,
      })
      return
    }

    // 이미지 파일 타입 검사 (보안상 SVG 제외)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      addToast({
        type: "error",
        title: "Please select a valid image file.",
        duration: 3000,
      })
      return
    }

    // 파일 선택 처리: 업로드는 부모 컴포넌트에 위임
    onImageSelect(file)
    // 이전 Object URL 정리
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }
    // 미리보기를 위해 새 URL 생성
    const previewUrl = URL.createObjectURL(file)
    setObjectUrl(previewUrl)
    setPreviewSrc(previewUrl)
    onImageChange?.(previewUrl)
  }

  return (
    <div className={AUTH_LAYOUT.avatarWrapper}>
      <button
        className={`${AUTH_LAYOUT.avatarInner} group relative cursor-pointer`}
        onClick={handleAvatarClick}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleAvatarClick()
          }
        }}
        type="button"
      >
        <Avatar className="h-full w-full">
          <AvatarImage alt="avatar" src={previewSrc} />
          <AvatarFallback>AvatarImg</AvatarFallback>
        </Avatar>

        {/* 호버 시 반투명 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />
      </button>
    </div>
  )
}
