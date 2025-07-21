const img = "http://localhost:3845/assets/924875ff5fa0a6a90ced28e0c8142ed00a483101.svg"
const img1 = "http://localhost:3845/assets/6e3c47fd16d886e717a64de6960882fb23e3171a.svg"
const img2 = "http://localhost:3845/assets/ce853d562f86011f25ab48269406f8dc739aa19e.svg"

interface FolderInputIconProps {
  className?: string
}

export const FolderInputIcon = ({ className = "h-6 w-6" }: FolderInputIconProps) => {
  return (
    <div className={`relative ${className}`} data-name="icon/folder-input">
      <div className="absolute top-[12.5%] right-[8.333%] bottom-[16.667%] left-[8.333%]">
        <div className="-bottom-[5.294%] -left-[4.5%] -right-[4.5%] -top-[5.294%] absolute">
          <img alt="" className="block size-full max-w-none" src={img} />
        </div>
      </div>
      <div className="absolute top-[54.167%] right-1/2 bottom-[45.833%] left-[8.333%]">
        <div className="-bottom-[1.5px] -left-[9%] -right-[9%] -top-[1.5px] absolute">
          <img alt="" className="block size-full max-w-none" src={img1} />
        </div>
      </div>
      <div className="absolute top-[41.667%] right-1/2 bottom-[33.333%] left-[37.5%]">
        <div className="-bottom-[15%] -left-[30%] -right-[30%] -top-[15%] absolute">
          <img alt="" className="block size-full max-w-none" src={img2} />
        </div>
      </div>
    </div>
  )
}
