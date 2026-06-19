'use client'

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-[26px] bg-nxbg">
      <div className="flex items-center gap-[11px]">
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-nxp text-[20px] font-black tracking-[-0.04em] text-white">
          N
        </span>
        <span className="text-[26px] font-black tracking-[-0.04em] text-nxp">nexo</span>
      </div>
      <span className="h-[40px] w-[40px] animate-spin rounded-full border-[3px] border-nxp border-t-transparent" />
    </div>
  )
}
