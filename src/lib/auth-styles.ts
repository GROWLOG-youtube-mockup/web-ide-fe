// 인증/프로필 공통 스타일 객체
export const AUTH_STYLES = {
  avatar: "h-28 w-[110px] rounded-full border border-zinc-200",

  // 버튼
  btn: "h-full rounded-[5.368px] font-semibold",
  btnDisabled: "bg-zinc-100 text-zinc-400 cursor-not-allowed",
  btnFull: "w-full h-[35px]",
  btnPri: "bg-zinc-700 hover:bg-zinc-600 text-neutral-50",
  btnSec: "bg-zinc-800 hover:bg-zinc-600 text-neutral-50",
  btnSm: "h-full rounded-[5.368px] font-semibold w-[55px] text-[8px]",

  //버튼 스타일
  desc: "text-[9px] text-zinc-500",
  disabled: "bg-zinc-100 text-zinc-400 cursor-not-allowed",
  divider: "h-px w-full",
  error: "border-red-500 text-red-500 bg-red-50 placeholder:text-red-400",

  // 에러 필드 스타일
  errorField: "bg-red-50 border-red-500 !border-red-500",

  // 에러 메시지
  errorMessage: "mb-1 text-red-500 text-[10px]",

  // 필드
  field:
    "h-full rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500 h-[35px]",
  focus: "focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200",
  help: "text-[9px] text-zinc-400",

  // 기타
  icon: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4",
  input:
    "h-full rounded-[5.368px] border-[0.667px] border-zinc-200 px-[13px] font-medium text-[10.667px] text-zinc-500 placeholder:text-zinc-500",

  // 텍스트
  label: "font-semibold text-[10px] text-zinc-700",
  link: "flex items-center gap-0.5 text-[9.333px] text-zinc-500 leading-[13.333px]",
  signupBtn:
    "h-full rounded-[5.368px] font-semibold w-full bg-zinc-950 text-[10.667px] text-neutral-50 hover:bg-zinc-800 h-[35px]",
  subtitle: "font-medium text-[9.33px] text-zinc-500 leading-4",
  success: "border-green-500 text-green-600 bg-green-50 placeholder:text-green-400",
  title: "font-bold text-[20px] text-zinc-950",
}

// 인증/프로필 레이아웃 스타일 객체
export const AUTH_LAYOUT = {
  avatarInner: "flex h-28 w-[110px] items-center justify-center",
  avatarWrapper: "flex items-center justify-center",
  bottom: "flex w-full flex-col items-center gap-5 pt-0 pb-5",
  container: "relative flex h-full min-h-screen w-full items-center justify-center bg-white",
  divider: "w-full",
  header: "flex w-full flex-col gap-[6.667px]",
  main: "flex w-[310px] flex-col items-center gap-5",
  section: "flex w-full flex-col gap-2.5",
}
