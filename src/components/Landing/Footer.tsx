'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4"
          >
            Loja Virtual
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-2"
          >
            A plataforma completa para vendedores online
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-t border-gray-800 pt-6 sm:pt-8"
          >
            <p className="text-gray-500 text-xs sm:text-sm px-2">
              © {new Date().getFullYear()} Loja Virtual. Todos os direitos reservados.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

