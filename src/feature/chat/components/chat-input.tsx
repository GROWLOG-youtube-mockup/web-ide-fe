import { useEffect, useState } from "react"
import { useLineClickStore } from "@/feature/editor/stores/line-click-store"
import { Button } from "@/shared/components/custom-button"
import { Input } from "@/shared/ui/input"

interface ChatInputProps {
  onSend: (msg: string) => void
  disabled?: boolean
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("")
  const { lastLineClick } = useLineClickStore()

  // 라인 클릭 시 자동 입력
  useEffect(() => {
    if (lastLineClick?.codeLinkMessage) {
      setValue(prev => prev + (prev.trim() ? " " : "") + lastLineClick.codeLinkMessage)
    }
  }, [lastLineClick])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSend(value)
      setValue("")
    }
  }

  return (
    <form
      className="flex items-center gap-2 bg-[var(--background)] px-4 py-3"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Type your message..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <Button type="submit" className="rounded-lg px-6" disabled={disabled || !value.trim()}>
        Send
      </Button>
    </form>
  )
}

export default ChatInput
