import { Link } from "react-router-dom"

export function DevNavigationPage() {
  const pages = [
    { name: "로그인", path: "/login" },
    { name: "회원가입", path: "/signup" },
    { name: "프로필 수정", path: "/profile/edit" },
    { name: "IDE", path: "/ide" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-4xl text-gray-900">Web IDE</h1>
          <h2 className="mb-8 font-bold text-2xl text-gray-700">개발용 네비게이션</h2>
          <p className="mb-12 text-gray-600">
            개발 중 페이지 간 이동을 편리하게 하기 위한 네비게이션 페이지입니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pages.map(page => (
            <Link
              className="block rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg"
              key={page.path}
              to={page.path}
            >
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 text-xl">{page.name}</h3>
                <p className="mt-2 text-gray-500 text-sm">{page.path}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
