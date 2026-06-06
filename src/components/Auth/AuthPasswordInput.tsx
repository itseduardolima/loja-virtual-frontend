'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { authInputClass } from './AuthField'

interface AuthPasswordInputProps {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: boolean
  placeholder?: string
  autoComplete?: string
}

export function AuthPasswordInput({
  id,
  value,
  onChange,
  onBlur,
  error = false,
  placeholder = 'Digite sua senha',
  autoComplete,
}: AuthPasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(authInputClass(error), 'pr-11')}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={show}
        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-nxi3 transition-colors hover:bg-nxbg hover:text-nxi1"
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </>
  )
}
