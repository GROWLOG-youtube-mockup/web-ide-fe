// Divider SVG (공통 asset)
import DividerSvg from "./divider.svg"
export const dividerSvg = DividerSvg

// Lucide React 아이콘 import (shadcn/ui)
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Files,
  FileText,
  Folder,
  FolderOpen,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react"

// 아이콘 크기 상수 정의 (Tailwind 기준)
export const ICON_SIZES = {
  lg: "h-6 w-6", // 24px
  md: "h-5 w-5", // 20px
  sm: "h-4 w-4", // 16px
  xl: "h-8 w-8", // 32px
  xs: "h-3 w-3", // 12px
} as const

// Lucide React 아이콘들 (shadcn/ui에서 사용 가능)
export const LucideIcons = {
  // File Explorer
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,

  // Navigation Panel
  files: Files,
  fileText: FileText,

  // File Tree
  folder: Folder,
  folderOpen: FolderOpen,
  // Top Bar
  logOut: LogOut,
  plus: Plus,
  refreshCw: RefreshCw,
  search: Search,
  settings: Settings,

  // Code Editor
  x: X, // close icon
} as const

// 피그마에서만 제공되는 특수 아이콘들 (URL로 사용)
export const FigmaIcons = {
  // File Explorer - 특정 스타일의 파일/폴더 추가 아이콘들
  addFile1: "http://localhost:3845/assets/c7747302fb4b52d7f709e403fb48d18124854c52.svg",
  addFile2: "http://localhost:3845/assets/9d979465adad74273b075624976357a48a88287d.svg",
  addFile3: "http://localhost:3845/assets/f5e33b32e1d47b724aef211bcea6d5c227211cbb.svg",
  addFile4: "http://localhost:3845/assets/814fb6ea6c4a64eef94b977e1766785dd1b12670.svg",
  addFolder1: "http://localhost:3845/assets/3e5746067b57c3ec416b06ee9efa8c6f8541b9b7.svg",
  addFolder2: "http://localhost:3845/assets/ea5fcff2bd41a3d6c4a2b78554f453d90a5c1487.svg",
  addFolder3: "http://localhost:3845/assets/814fb6ea6c4a64eef94b977e1766785dd1b12670.svg",
  // Top Bar - 아바타 및 특수 로그아웃 아이콘들
  avatar: "http://localhost:3845/assets/4531c5c82247cfaef6c2bc1adb76e99040b20574.png",

  // 특정 파일 타입 아이콘들
  file1: "http://localhost:3845/assets/f2e777b920ef6bc99b7bae90e759dfd2117dbd2f.svg",
  file2: "http://localhost:3845/assets/108894fda7b685dafa1ff253b696884340e7c2ce.svg",
  folderInput1: "http://localhost:3845/assets/60175f039dd799d782269e8fa3510d4c1db4caa1.svg",
  folderInput2: "http://localhost:3845/assets/4e2af0293a2f7965d6494b7206f7febe241559af.svg",
  folderInput3: "http://localhost:3845/assets/c75adfe5828ecd5a9403251062a9c93fd22bd454.svg",

  // Navigation Panel - 특수 아이콘들 (Live Share, Folder Input 등)
  liveShare: "http://localhost:3845/assets/ba6b38725b527fa168bc4e3877b71fe5c42a0a40.svg",
  logOut1: "http://localhost:3845/assets/4a76ec6d9d1c12f54e05471670cf97ba4d75096f.svg",
  logOut2: "http://localhost:3845/assets/655cbc1d404341184aaec34efbe86c463c09c7b3.svg",
  logOut3: "http://localhost:3845/assets/8ffa3aa4b162f8a315ea7a6d42618590bdbfbe24.svg",

  // 프로젝트 리스트 아이콘 (완전한 버전)
  projectList: "/src/assets/folder-input.svg",
} as const

// 하위 호환성을 위한 레거시 icons 객체 (기존 코드에서 사용 중인 경우)
export const icons = {
  // File Explorer icons
  addFile1: FigmaIcons.addFile1,
  addFile2: FigmaIcons.addFile2,
  addFile3: FigmaIcons.addFile3,
  addFile4: FigmaIcons.addFile4,
  addFolder1: FigmaIcons.addFolder1,
  addFolder2: FigmaIcons.addFolder2,
  addFolder3: FigmaIcons.addFolder3,
  avatar: FigmaIcons.avatar,

  // File Tree icons
  file1: FigmaIcons.file1,
  file2: FigmaIcons.file2,
  folderInput1: FigmaIcons.folderInput1,
  folderInput2: FigmaIcons.folderInput2,
  folderInput3: FigmaIcons.folderInput3,

  // Navigation Panel icons
  liveShare: FigmaIcons.liveShare,
  // Top Bar icons
  logOut1: FigmaIcons.logOut1,
  logOut2: FigmaIcons.logOut2,
  logOut3: FigmaIcons.logOut3,
  projectList: FigmaIcons.projectList,
} as const
