'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckIcon } from './CheckIcon'

interface PricingFeature {
  text: string
}

interface PricingCardProps {
  name: string
  description: string
  price: string
  period: string
  features: PricingFeature[]
  ctaText: string
  ctaHref: string
}

export function PricingCard({
  name,
  description,
  price,
  period,
  features,
  ctaText,
  ctaHref,
}: PricingCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-blue-600 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-center"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">{name}</h3>
        <p className="text-sm sm:text-base text-blue-100">{description}</p>
      </motion.div>
      <div className="p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex items-baseline justify-center flex-wrap">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">R$</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 ml-1 sm:ml-2"
            >
              {price}
            </motion.span>
            <span className="text-base sm:text-lg md:text-xl text-gray-600 ml-1 sm:ml-2">/{period}</span>
          </div>
        </motion.div>
        <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="flex items-start"
            >
              <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">{feature.text}</span>
            </motion.li>
          ))}
        </ul>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={ctaHref}
            className="block w-full bg-blue-600 text-white text-center py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

