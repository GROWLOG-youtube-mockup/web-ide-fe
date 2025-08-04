import { Separator } from "@/components/ui/separator"
import { AUTH_LAYOUT, AUTH_STYLES } from "@/constants/auth-styles"

interface AuthHeaderProps {
  title: string
  subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className={AUTH_LAYOUT.header}>
        <h1 className={AUTH_STYLES.title}>{title}</h1>
        <p className={AUTH_STYLES.subtitle}>{subtitle}</p>
      </div>

      {/* Divider */}
      <div className={AUTH_LAYOUT.divider}>
        <Separator />
      </div>
    </>
  )
}
