import { useRouteError } from "react-router-dom"

export function ErrorPage() {
  const error = useRouteError() as Error

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="font-bold text-4xl text-destructive">오류가 발생했습니다</h1>
        <p className="text-muted-foreground">
          {error?.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.href = "/"
          }}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  )
}
