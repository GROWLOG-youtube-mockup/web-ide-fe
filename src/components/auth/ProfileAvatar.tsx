import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AUTH_LAYOUT } from "@/constants/auth-styles"

export function ProfileAvatar() {
  return (
    <div className={AUTH_LAYOUT.avatarWrapper}>
      <div className={AUTH_LAYOUT.avatarInner}>
        <Avatar className="h-full w-full">
          <AvatarImage alt="avatar" src="https://github.com/shadcn.png" />
          <AvatarFallback>AvatarImg</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
