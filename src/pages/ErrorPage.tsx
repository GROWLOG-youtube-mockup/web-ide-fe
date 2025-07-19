import { useRouteError } from 'react-router-dom'

export function ErrorPage() {
  const error = useRouteError() as Error

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold text-destructive">
          오류가 발생했습니다
        </h1>
        <p className="text-muted-foreground">
          {error?.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  )
}
