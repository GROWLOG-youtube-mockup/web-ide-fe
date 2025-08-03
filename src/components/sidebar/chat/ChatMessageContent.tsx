// ...existing code...
import { Button } from "@/components/ui/custom-button"
import type { ChatMessagePart } from "@/types/chat"

interface ChatMessageContentProps {
  parts: ChatMessagePart[]
  onCodeLinkClick?: (filePath: string, lineNumber: number) => void
}

export default function ChatMessageContent({ parts, onCodeLinkClick }: ChatMessageContentProps) {
  const handleClick = (filePath: string, lineNumber: number) => {
    const normalizedPath = `/${filePath}`
    if (onCodeLinkClick) {
      onCodeLinkClick(normalizedPath, lineNumber)
    } else {
      console.log(`[코드 링크 클릭]`, { filePath, lineNumber })
    }
  }

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "link") {
          const key = `${part.fileName}:${part.lineNumber}:${i}`
          return (
            <Button
              key={key}
              type="button"
              onClick={() => handleClick(part.fullPath, part.lineNumber)}
              className="h-auto bg-inherit px-0 py-0 align-baseline text-blue-500 underline hover:bg-inherit hover:text-blue-400"
            >
              {`${part.fileName}:${part.lineNumber}`}
            </Button>
          )
        }
        return <span key={`text-${i}-${(part.value as string).slice(0, 8)}`}>{part.value}</span>
      })}
    </>
  )
}
