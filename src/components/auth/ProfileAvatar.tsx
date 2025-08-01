import { Camera } from "lucide-react"
import { useRef, useState } from "react"
import { useToast } from "@/components/common/ToastContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AUTH_LAYOUT } from "@/constants/auth-styles"
import { uploadProfileImage } from "@/services/api/users"

interface ProfileAvatarProps {
  src?: string
  onImageChange?: (imageUrl: string) => void
}

export function ProfileAvatar({
  src = "https://github.com/shadcn.png",
  onImageChange,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { addToast } = useToast()

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: "error",
        title: "File size too large. Please select a file under 5MB.",
        duration: 3000,
      })
      return
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      addToast({
        type: "error",
        title: "Please select a valid image file.",
        duration: 3000,
      })
      return
    }

    setIsUploading(true)
    try {
      const imageUrl = await uploadProfileImage(file)
      addToast({
        type: "success",
        title: "Profile image updated successfully!",
        duration: 2000,
      })
      onImageChange?.(imageUrl)
    } catch (error) {
      console.error("Profile image upload failed:", error)
      addToast({
        type: "error",
        title: "Failed to upload image. Please try again.",
        duration: 3000,
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
          <AvatarImage alt="avatar" src={src} />
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
