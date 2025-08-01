import { Camera } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/common/ToastContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AUTH_LAYOUT } from "@/constants/auth-styles"
import { uploadProfileImage } from "@/services/api/users"

interface ProfileAvatarProps {
  src?: string
  onImageChange?: (imageUrl: string) => void
  onImageSelect?: (file: File) => void
}

export function ProfileAvatar({
  src = "https://github.com/shadcn.png",
  onImageChange,
  onImageSelect,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
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
    if (!isUploading) {
      fileInputRef.current?.click()
    }
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

    // 회원가입 중이라면 파일만 저장 (onImageSelect가 있는 경우)
    if (onImageSelect) {
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
      return
    }

    // 로그인 후라면 바로 업로드 (기존 로직)
    setIsUploading(true)
    try {
      const imageUrl = await uploadProfileImage(file)
      // 이전 Object URL 정리
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        setObjectUrl(null)
      }
      setPreviewSrc(imageUrl) // 업로드 성공 시 미리보기 업데이트
      addToast({
        type: "success",
        title: "Profile image updated successfully!",
        duration: 2000,
      })
      onImageChange?.(imageUrl)
    } catch (error) {
      console.error("Profile image upload failed:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image. Please try again."
      addToast({
        type: "error",
        title: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsUploading(false)
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className={AUTH_LAYOUT.avatarWrapper}>
      <button
        className={`${AUTH_LAYOUT.avatarInner} relative ${isUploading ? "cursor-wait" : "cursor-pointer"} group`}
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
          <Camera className={`h-6 w-6 text-white ${isUploading ? "animate-pulse" : ""}`} />
        </div>

        {/* 업로드 중 로딩 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
            <div className="h-6 w-6 animate-spin rounded-full border-white border-b-2"></div>
          </div>
        )}

        {/* 숨겨진 파일 입력 */}
        <input
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />
      </button>
    </div>
  )
}
