import { useState } from "react"
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSend: (msg: string) => void
  disabled?: boolean
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("")

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
        placeholder="메시지를 입력하세요..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <Button type="submit" className="rounded-lg px-6" disabled={disabled || !value.trim()}>
        전송
      </Button>
    </form>
  )
}

export default ChatInput
