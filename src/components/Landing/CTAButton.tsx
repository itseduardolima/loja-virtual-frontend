'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'white'
  className?: string
}

export function CTAButton({ href, children, variant = 'primary', className = '' }: CTAButtonProps) {
  const baseClasses = 'px-6 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg w-full sm:w-auto inline-flex items-center justify-center'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400',
    white: 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  )
}

