import { dividerSvg } from "@/assets/icons"
import { FormSection } from "@/components/common/FormSection"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const imgAvatar = "http://localhost:3845/assets/93a68586aba6dbdd0995dad680ca4c4b2159375f.png"

export default function SignUpPage() {
  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center bg-white">
      {/* Brand Title */}
      <div className="absolute top-[30px] left-[35px]">
        <h2 className="font-semibold text-[#333333] text-[20px]">Growlog IDE</h2>
      </div>

      {/* Main Content Container */}
      <div className="flex w-[310px] flex-col items-center gap-5">
        {/* Header */}
        <div className="flex w-full flex-col gap-[6.667px]">
          <h1 className="font-bold text-[20px] text-zinc-950">Sign up</h1>
          <p className="font-medium text-[9.33px] text-zinc-500 leading-4">
            Enter your information to sign up!
          </p>
        </div>

        {/* Divider */}
        <div className="w-full">
          <img alt="divider" className="h-px w-full" src={dividerSvg} />
        </div>

        {/* Avatar */}
        <div className="flex items-center justify-center">
          <div className="h-28 w-[110px] rotate-180 scale-y-[-100%]">
            <img alt="" className="h-full w-full" height={112} src={imgAvatar} width={110} />
          </div>
        </div>

        {/* Form Fields (공통 컴포넌트 적용) */}
        <div className="flex w-full flex-col gap-2.5">
          {/* Email Section */}
          <FormSection htmlFor="email" label="Email">
            <div className="flex w-full flex-col gap-1.5">
              <div className="flex h-[30px] gap-1.5">
                <div className="relative flex-1">
                  <Input
                    className="h-full rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <Button className="h-full w-[55px] rounded-[5.368px] bg-zinc-700 font-semibold text-[8px] hover:bg-zinc-600">
                  Send code
                </Button>
              </div>
              <div className="flex h-[30px] gap-1.5">
                <div className="relative flex-1">
                  <Input
                    className="h-full rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
                    placeholder="Enter your code"
                  />
                </div>
                <Button className="h-full w-[55px] rounded-[5.368px] bg-zinc-500 font-semibold text-[8px] hover:bg-zinc-400">
                  Confirm
                </Button>
              </div>
            </div>
          </FormSection>

          {/* Password Section */}
          <FormSection
            description="Must be at least 8 characters long, including both letters and numbers."
            htmlFor="password"
            label="Password"
          >
            <Input
              className="h-[35px] rounded-[5.333px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
              id="password"
              placeholder="Enter your password"
              type="password"
            />
          </FormSection>

          {/* Name Section */}
          <FormSection htmlFor="name" label="Name">
            <Input
              className="h-[35px] rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
              id="name"
              placeholder="Enter your name"
            />
          </FormSection>
        </div>

        {/* Bottom Section */}
        <div className="flex w-full flex-col items-center gap-5 pt-0 pb-5">
          {/* Sign Up Button */}
          <Button className="h-[35px] w-full rounded-[5.368px] bg-zinc-950 font-semibold text-[10.667px] text-neutral-50 hover:bg-zinc-800">
            Sign Up
          </Button>

          {/* Sign In Link */}
          <div className="flex items-center gap-0.5 text-[9.333px] text-zinc-500 leading-[13.333px]">
            <span className="font-medium">Already have an account?</span>
            <span className="cursor-pointer font-semibold underline">Sign In</span>
          </div>
        </div>
      </div>
    </div>
  )
}
