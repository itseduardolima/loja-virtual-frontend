'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-blue-50/50 backdrop-blur-md max-w-4xl mx-auto rounded-xl sm:rounded-2xl sticky top-2 sm:top-5 z-50 mx-2 sm:mx-auto"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Loja Virtual</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:hidden"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="text-sm sm:text-base text-gray-700 hover:text-gray-900 font-medium transition-colors hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base hidden sm:block"
            >
              Começar Agora
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

