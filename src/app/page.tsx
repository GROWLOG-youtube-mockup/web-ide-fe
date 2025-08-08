import { Link } from "react-router-dom"
import logoSvg from "@/assets/logo.svg"
import logoWhiteSvg from "@/assets/logo-white.svg"
import { PATHS } from "@/routes"
import { Button } from "@/shared/components/custom-button"

export const Page = () => {
  // 간단한 정적 목업 데이터
  const mockProjects = [
    { name: "webide-hooks", description: "Java 기반 테스트용", isActive: true },
    { name: "dashboard", description: "React 기반 대시보드", isActive: false },
    { name: "mobile-app", description: "React Native 모바일 앱", isActive: true },
  ]

  const mockInvited = [
    { name: "collaboration", description: "팀 협업 도구 개발", isActive: true },
    { name: "ai-chatbot", description: "AI 기반 챗봇 시스템", isActive: false },
    { name: "platform", description: "Next.js 전자상거래 플랫폼", isActive: true },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center bg-background py-6">
      <div className="absolute top-[21px] left-[30px]">
        <div className="group flex cursor-pointer items-center gap-2">
          {/* 라이트 모드 로고 */}
          <img alt="Growlog IDE" className="h-[32px] dark:hidden" src={logoSvg} />
          {/* 다크 모드 로고 */}
          <img alt="Growlog IDE" className="hidden h-[32px] dark:block" src={logoWhiteSvg} />
        </div>
      </div>

      <div className="mt-[110px] flex flex-col items-center space-y-8">
        {/* 중앙 텍스트 및 버튼 */}
        <div className="flex flex-col items-center gap-6 pb-6">
          <div className="flex w-[563px] flex-col items-center gap-2.5">
            <div className="text-center">
              <h2 className="font-bold text-[38px] text-foreground leading-[42px] tracking-[-1.6px]">
                Code smarter, anywhere.
                <br />
                Unlock your <span className="text-foreground">cloud workspace.</span>
              </h2>
            </div>
          </div>

          {/* 중앙 정렬된 버튼들 */}
          <div className="flex gap-2">
            <Link to={PATHS.signup}>
              <div className="w-[123px] p-2.5">
                <Button
                  className="w-[124px] rounded-[20px] bg-foreground px-4 py-2 font-semibold text-background hover:bg-foreground/90"
                  size="sm"
                >
                  Join us
                </Button>
              </div>
            </Link>
            <Link to={PATHS.signin}>
              <div className="w-[123px] p-2.5">
                <Button
                  className="w-[124px] rounded-[20px] border-foreground/80 px-4 py-2 font-semibold text-foreground hover:bg-foreground/10"
                  size="sm"
                  variant="outline"
                >
                  Sign in
                </Button>
              </div>
            </Link>
          </div>
        </div>

        {/* 프로젝트 리스트 */}
        <div className="w-[850px] space-y-6">
          {/* 흐린 효과가 적용된 프로젝트 리스트 - 순수 UI */}
          <div className="pointer-events-none space-y-12 blur-[2px]">
            {/* Host 프로젝트 목록 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground/90 text-sm">Host</h3>
              <div className="space-y-3">
                {mockProjects.map(project => (
                  <div
                    className="flex items-center justify-between border-border border-b px-3 py-2"
                    key={project.name}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-[104px] font-semibold text-foreground/70 text-sm">
                        {project.name}
                      </div>
                      {/* 간단한 토글 표시 */}
                      <div
                        className={`h-[10px] w-[19px] rounded-full ${project.isActive ? "bg-green-600 dark:bg-green-500" : "bg-muted-foreground dark:bg-muted-foreground"} relative`}
                      >
                        <div
                          className={`absolute top-[1px] h-2 w-2 rounded-full bg-background transition-transform ${project.isActive ? "left-[9px]" : "left-[1px]"}`}
                        />
                      </div>
                    </div>
                    <div className="flex w-[583px] items-center justify-between">
                      <div className="font-medium text-muted-foreground text-xs">
                        {project.description}=
                      </div>
                      <div className="flex items-center justify-end gap-0 pr-[9px]">
                        {/* 간단한 아바타들 */}
                        {[1, 2, 3].map((_, avatarIndex) => (
                          <div
                            className="mr-[-9px] h-8 w-8"
                            key={`host-avatar-${project.name}-${avatarIndex}`}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted">
                              <span className="text-muted-foreground text-xs">U</span>
                            </div>
                          </div>
                        ))}
                        <div className="mr-[-9px] flex h-8 w-8 items-center justify-center rounded-[20px] bg-muted-foreground">
                          <div className="font-semibold text-primary-foreground text-sm">+2</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invited 프로젝트 목록 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground/90 text-sm">Invited</h3>
              <div className="space-y-3">
                {mockInvited.map(project => (
                  <div
                    className="flex items-center justify-between border-border border-b px-3 py-2"
                    key={project.name}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-[104px] font-semibold text-foreground/70 text-sm">
                        {project.name}
                      </div>
                      {/* 간단한 상태 점 */}
                      <div
                        className={`h-2 w-2 rounded-full ${project.isActive ? "bg-green-600 dark:bg-green-500" : "bg-red-500 dark:bg-red-400"}`}
                      />
                    </div>
                    <div className="flex w-[583px] items-center justify-between">
                      <div className="font-medium text-muted-foreground text-xs">
                        {project.description}
                      </div>
                      <div className="flex items-center justify-end gap-0 pr-[9px]">
                        {/* 간단한 아바타들 */}
                        {[1, 2, 3].map((_, avatarIndex) => (
                          <div
                            className="mr-[-9px] h-8 w-8"
                            key={`invited-avatar-${project.name}-${avatarIndex}`}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted">
                              <span className="text-muted-foreground text-xs">U</span>
                            </div>
                          </div>
                        ))}
                        <div className="mr-[-9px] flex h-8 w-8 items-center justify-center rounded-[20px] bg-muted-foreground">
                          <div className="font-semibold text-primary-foreground text-sm">+2</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
