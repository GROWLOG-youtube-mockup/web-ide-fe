import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const imgDivider = "http://localhost:3845/assets/ff535bc62866ed4ed8837c1a47b2949e7461b0f3.svg"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2f6f6] p-4">
      <div className="relative flex h-[720px] w-full max-w-[1375px] items-center justify-center bg-white">
        {/* Brand Title */}
        <div className="absolute top-[30px] left-[35px]">
          <h2 className="font-semibold text-[#333333] text-[20px]">Growlog IDE</h2>
        </div>

        {/* Main Content Container */}
        <div className="flex w-[310px] flex-col items-center gap-5">
          {/* Header */}
          <div className="flex w-full flex-col gap-[6.667px]">
            <h1 className="font-bold text-[20px] text-zinc-950">Sign In</h1>
            <p className="font-medium text-[10.667px] text-zinc-500 leading-4">
              Enter your username and password to sign in!
            </p>
          </div>

          {/* Divider */}
          <div className="w-full">
            <img alt="" className="h-px w-full" src={imgDivider} />
          </div>

          {/* Form Fields */}
          <div className="flex w-full flex-col gap-2.5">
            {/* Email Section */}
            <div className="flex w-full flex-col gap-1.5">
              <label className="font-semibold text-[10.667px] text-zinc-950" htmlFor="email">
                Email
              </label>
              <Input
                className="h-[35px] rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
                id="email"
                placeholder="Enter your email"
                type="email"
              />
            </div>

            {/* Password Section */}
            <div className="flex w-full flex-col gap-1.5">
              <div className="flex w-full items-center justify-between">
                <label className="font-semibold text-[10.667px] text-zinc-950" htmlFor="password">
                  Password
                </label>
                <span className="cursor-pointer font-medium text-[9.333px] text-zinc-500">
                  Forgot your password?
                </span>
              </div>
              <Input
                className="h-[35px] rounded-[5.333px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
                id="password"
                placeholder="Enter your password"
                type="password"
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex w-full flex-col items-center gap-5 pt-0 pb-5">
            {/* Sign In Button */}
            <Button className="h-[35px] w-full rounded-[5.368px] bg-zinc-950 font-semibold text-[10.667px] text-neutral-50 hover:bg-zinc-800">
              Sign in
            </Button>

            {/* Sign Up Link */}
            <div className="flex items-center gap-0.5 text-[9.333px] text-zinc-500 leading-[13.333px]">
              <span className="font-medium">Don't have an account?</span>
              <span className="cursor-pointer font-semibold underline">Sign Up</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
