import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface ViewManagerProps {
  /** 섹션 제목 */
  title?: string
  /** 기본적으로 열려있는지 여부 */
  defaultOpen?: boolean
  /** 섹션 내부에 표시할 콘텐츠 */
  children: ReactNode
  /** 뷰 매니저의 너비 (픽셀 단위) */
  width?: number
}

/**
 * 사이드바 섹션을 위한 범용 뷰 매니저 컴포넌트
 *
 * 파일 탐색기, 검색 결과 등 다양한 콘텐츠 타입을 담을 수 있는 접을 수 있는 컨테이너를 제공합니다.
 * 크기 조절 가능한 너비와 스크롤 가능한 콘텐츠 영역을 특징으로 합니다.
 */
export const ViewManager = ({
  title = "Files",
  defaultOpen = true,
  children,
}: ViewManagerProps) => {
  return (
    <Collapsible
      className="group/collapsible h-full w-full min-w-0 overflow-hidden bg-zinc-50"
      defaultOpen={defaultOpen}
    >
      <CollapsibleTrigger asChild>
        <Button
          className={cn(
            "h-auto w-full justify-start border-zinc-200 border-b bg-zinc-50 px-3 py-2",
            "rounded-none font-medium text-sm"
          )}
          variant="ghost"
        >
          <span className="flex-1 truncate text-left">{title}</span>
          <ChevronDown className="ml-2 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-0 py-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
