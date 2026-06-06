'use client'

import { GoogleColorIcon } from './GoogleColorIcon'

interface AuthGoogleButtonProps {
  onClick: () => void
  disabled?: boolean
  label?: string
}

export function AuthGoogleButton({
  onClick,
  disabled = false,
  label = 'Entrar com Google',
}: AuthGoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-nxborder bg-white text-[14px] font-semibold text-nxi1 transition-colors hover:border-nxi3 hover:bg-nxbg disabled:opacity-60"
    >
      <GoogleColorIcon /> {label}
    </button>
  )
}
