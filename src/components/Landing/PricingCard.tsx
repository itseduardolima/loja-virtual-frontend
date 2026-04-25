'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, X } from 'lucide-react'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  name: string
  description: string
  price: string
  period: string
  features: PricingFeature[]
  ctaText: string
  ctaHref: string
  featured?: boolean
}

export function PricingCard({
  name,
  description,
  price,
  period,
  features,
  ctaText,
  ctaHref,
  featured = false,
}: PricingCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className={`flex flex-col rounded-2xl overflow-hidden border-2 shadow-lg ${
        featured ? 'border-gray-900 shadow-gray-200' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`px-6 py-5 ${featured ? 'bg-gray-900' : 'bg-white'}`}>
        {featured && (
          <div className="text-center mb-2">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
              Mais popular
            </span>
          </div>
        )}
        <h3 className={`text-lg font-bold text-center mb-0.5 ${featured ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </h3>
        <p className={`text-xs text-center ${featured ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>

      {/* Price */}
      <div className={`px-6 py-5 border-b ${featured ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="flex items-baseline justify-center gap-0.5">
          <span className={`text-sm font-medium ${featured ? 'text-gray-400' : 'text-gray-500'}`}>R$</span>
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
            className={`text-4xl font-bold tracking-tight ${featured ? 'text-white' : 'text-gray-900'}`}
          >
            {price}
          </motion.span>
          <span className={`text-sm ml-1 ${featured ? 'text-gray-400' : 'text-gray-400'}`}>/{period}</span>
        </div>
      </div>

      {/* Features */}
      <div className={`flex-1 px-6 py-5 ${featured ? 'bg-gray-900' : 'bg-white'}`}>
        <ul className="space-y-2.5">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -15 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
              className="flex items-center gap-2.5"
            >
              {feature.included ? (
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  featured ? 'bg-white/20' : 'bg-gray-900'
                }`}>
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                  <X className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />
                </div>
              )}
              <span className={`text-sm ${
                feature.included
                  ? featured ? 'text-gray-200' : 'text-gray-700'
                  : 'text-gray-400 line-through'
              }`}>
                {feature.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className={`px-6 pb-6 pt-1 ${featured ? 'bg-gray-900' : 'bg-white'}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={ctaHref}
            className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
              featured
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
