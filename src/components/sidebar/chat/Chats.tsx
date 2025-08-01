import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const ChatMessageList = () => {
  const messages = [1, 2, 3, 4, 5, 6, 7]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-4">
      {messages.map(id => (
        <div key={id} className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Card className="max-w-[100%] rounded-2xl py-3">
            <CardContent className="px-3 py-1">
              <div className="text-[var(--card-foreground)] text-sm leading-relaxed">
                Hello, this is a mock message {id}! Hello, this is a mock message Hello, this is a
                mock message Hello, this is a mock message Hello, this is a mock message Hello, this
                is a mock message Hello, this is a mock message
              </div>
              <div className="mt-1 w-full text-right text-[var(--muted-foreground)] text-xs">
                12:3{id} PM
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

const ChatInput = () => (
  <form className="flex items-center gap-2 bg-[var(--background)] px-4 py-3">
    <Input placeholder="Type a message..." />
    <Button type="submit" className="rounded-lg px-6">
      Send
    </Button>
  </form>
)

export const Chats = () => (
  <div className="flex h-full flex-col bg-[var(--background)]">
    <ChatMessageList />
    <div className="sticky bottom-0 shrink-0">
      <Separator />
      <ChatInput />
    </div>
  </div>
)
