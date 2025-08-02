import { FigmaIcons, LucideIcons } from "@/assets/icons"
import LogoSvg from "@/assets/logo.svg"
import { ProjectAvatars } from "@/components/project-list/ProjectAvatars"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/custom-button"

export const TopBar = () => {
  const LogOutIcon = LucideIcons.logOut

  return (
    <div
      className="flex h-[50px] items-center bg-[var(--background)]"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex w-full items-center justify-between px-3 py-1">
        {/* Logo and Menu */}
        <div className="flex items-center gap-3 px-1">
          <img alt="Growlog IDE" className="h-7" src={LogoSvg} />
        </div>

        {/* User and Settings */}
        <div className="flex items-center gap-6">
          {/* Project Members */}
          <div className="flex items-center gap-3">
            {/* todo: 실제 프로젝트 멤버 데이터로 교체 */}
            <ProjectAvatars
              maxVisible={3}
              members={[
                {
                  userId: 1,
                  name: "User 1",
                  role: "WRITE",
                  profileImage: FigmaIcons.avatar,
                },
                {
                  userId: 2,
                  name: "User 2",
                  role: "WRITE",
                  profileImage: FigmaIcons.avatar,
                },
                {
                  userId: 3,
                  name: "User 3",
                  role: "READ",
                  profileImage: FigmaIcons.avatar,
                },
                {
                  userId: 4,
                  name: "User 4",
                  role: "READ",
                  profileImage: FigmaIcons.avatar,
                },
                {
                  userId: 5,
                  name: "User 5",
                  role: "READ",
                  profileImage: FigmaIcons.avatar,
                },
                {
                  userId: 6,
                  name: "User 6",
                  role: "READ",
                  profileImage: FigmaIcons.avatar,
                },
              ]}
              size="md"
            />
            <Avatar className="ml-3 h-8 w-8">
              {/* todo: 현재 사용자로 교체 */}
              <AvatarImage alt="현재 사용자 아바타" src={FigmaIcons.avatar} />
              <AvatarFallback
                className="bg-zinc-200 font-medium text-zinc-700"
                style={{ fontSize: "11px" }}
              >
                ME
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Exit Button */}
          <Button
            className="flex items-center gap-1 bg-zinc-50 px-3 text-zinc-900 hover:bg-zinc-200"
            size="sm"
            style={{
              fontSize: "12px",
              border: "1px solid var(--sidebar-ring)",
            }}
            variant="outline"
          >
            <LogOutIcon className="!h-3 shrink-0" />
            프로젝트 나가기
          </Button>
        </div>
      </div>
    </div>
  )
}
