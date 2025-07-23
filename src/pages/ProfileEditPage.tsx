import { AlertDialog } from "@/components/AlertDialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const imgAvatar = "http://localhost:3845/assets/93a68586aba6dbdd0995dad680ca4c4b2159375f.png"
const imgDivider = "http://localhost:3845/assets/9813750d2c6daa3e03347ae7a9b8cb5ebb96a15d.svg"

export default function ProfileEditPage() {
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
            <h1 className="font-bold text-[20px] text-zinc-950">Profile</h1>
            <p className="font-medium text-[9.33px] text-gray-500 leading-5">
              This is how others will see you on the site.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full">
            <img alt="" className="h-3 w-full" src={imgDivider} />
          </div>

          {/* Avatar */}
          <div className="flex items-center justify-center">
            <div className="h-28 w-[110px] rotate-180 scale-y-[-100%]">
              <img alt="" className="h-full w-full" height={112} src={imgAvatar} width={110} />
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex w-full flex-col gap-2.5">
            {/* Email Section */}
            <div className="flex w-full flex-col gap-1.5">
              <label className="font-semibold text-[10.667px] text-zinc-950" htmlFor="email">
                Email
              </label>
              <Input
                className="h-[35px] rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-400"
                disabled
                id="email"
                type="email"
                value="jaeyeopme@gmail.com"
              />
            </div>

            {/* Password Section */}
            <div className="flex w-full flex-col gap-1.5">
              <label
                className="font-semibold text-[10.667px] text-zinc-950"
                htmlFor="currentPassword"
              >
                Password
              </label>
              <div className="flex w-full flex-col gap-[3px]">
                <p className="font-normal text-[9.333px] text-zinc-500 leading-[13.333px]">
                  Must be at least 8 characters long, including both letters and numbers.
                </p>
                <div className="flex flex-col gap-1.5">
                  <Input
                    className="h-[30px] rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
                    id="currentPassword"
                    placeholder="Enter your current password"
                    type="password"
                  />
                  <Input
                    className="h-[30px] rounded-[5.333px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500"
                    placeholder="Enter your new password"
                    type="password"
                  />
                </div>
              </div>
            </div>

            {/* Name Section */}
            <div className="flex w-full flex-col gap-1.5">
              <label className="font-semibold text-[10.667px] text-zinc-950" htmlFor="name">
                Name
              </label>
              <Input
                className="h-[35px] rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500"
                id="name"
                value="jaeyeopme"
              />
              <div className="flex w-full items-center justify-end">
                <AlertDialog
                  cancelText="Cancel"
                  confirmText="Delete"
                  description="Once deleted, the data cannot be recovered."
                  onCancel={() => {
                    // TODO: 취소 로직 구현
                    console.log("Account deletion cancelled")
                  }}
                  onConfirm={() => {
                    // TODO: 계정 삭제 로직 구현
                    console.log("Account deletion confirmed")
                  }}
                  showCloseButton={false}
                  title="Delete account"
                  trigger={
                    <span className="cursor-pointer font-semibold text-[9px] text-red-500">
                      Delete your account
                    </span>
                  }
                  variant="destructive"
                >
                  <div className="h-[35px] w-full rounded-[5.333px] bg-[#ffffff]">
                    <Input
                      className="h-full w-full rounded-[5.333px] border-[0.667px] border-zinc-200 border-solid font-['Inter:Medium',_sans-serif] font-medium text-[10.667px] text-zinc-500"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </div>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex w-full flex-col items-center gap-5">
            {/* Update Profile Button */}
            <Button className="h-[35px] w-full rounded-[5.368px] bg-zinc-950 font-semibold text-[10.667px] text-neutral-50 hover:bg-zinc-800">
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
