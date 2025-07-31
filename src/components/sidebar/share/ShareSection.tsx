import { InvitationsSection } from "./InvitationsSection"
import { MembersSection } from "./MembersSection"

interface InviteSidebarProps {
  projectId: string
}

export const InviteSidebar = ({ projectId }: InviteSidebarProps) => {
  //(테스트용) 임시 프로젝트 id 이후엔 접속한 프로젝트로 교체(7.31 18:30)
  projectId = "3"

  return (
    <div className="flex h-full w-full flex-col bg-gray-100 dark:bg-gray-800">
      <InvitationsSection projectId={projectId} />
      <MembersSection projectId={projectId} />
    </div>
  )
}
