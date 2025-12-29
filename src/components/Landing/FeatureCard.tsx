'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  gradientFrom: string
  gradientTo: string
  iconBgColor: string
  index?: number
}

export function FeatureCard({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  iconBgColor,
  index = 0,
}: FeatureCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow`}
    >
      <motion.div
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`w-12 h-12 sm:w-14 sm:h-14 ${iconBgColor} rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6`}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}

