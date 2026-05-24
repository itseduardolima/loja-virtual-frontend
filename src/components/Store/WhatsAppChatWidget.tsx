'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WhatsAppChatWidgetProps {
  whatsapp?: string | null
  storeName?: string | null
}

export function WhatsAppChatWidget({ whatsapp, storeName }: WhatsAppChatWidgetProps) {
  const [hovered, setHovered] = useState(false)

  if (!whatsapp) return null

  const phone = whatsapp.replace(/\D/g, '')
  const message = encodeURIComponent(
    `Olá! Vim da loja ${storeName ?? ''} e gostaria de tirar uma dúvida.`
  )
  const href = `https://wa.me/${phone}?text=${message}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            className="bg-gray-900 text-white text-[13px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none"
          >
            Falar no WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative w-14 h-14 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center flex-shrink-0"
      >
        {/* Ping pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

        {/* WhatsApp icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 text-white relative z-10"
          aria-hidden="true"
        >
          <path d="M12.001 2C6.477 2 2 6.477 2 12c0 1.89.523 3.66 1.435 5.18L2.047 22l4.948-1.37A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.524 2 12.001 2zm0 18a7.96 7.96 0 0 1-4.075-1.117l-.292-.173-3.053.847.864-2.981-.19-.307A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8.001-8C16.41 4 20 7.589 20 12s-3.59 8-7.999 8zm4.399-5.867c-.241-.12-1.427-.703-1.648-.783-.221-.08-.382-.12-.543.12-.161.24-.622.783-.763.944-.14.16-.281.18-.522.06-.241-.12-1.018-.375-1.939-1.196-.717-.639-1.201-1.428-1.341-1.669-.14-.24-.015-.37.105-.489.108-.107.241-.28.362-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.543-1.308-.743-1.789-.196-.47-.396-.406-.543-.413l-.462-.009c-.16 0-.422.06-.643.3-.22.24-.843.824-.843 2.01s.863 2.33.983 2.49c.12.16 1.698 2.593 4.116 3.637.575.248 1.024.396 1.374.507.577.184 1.102.158 1.517.096.463-.069 1.427-.583 1.628-1.146.2-.562.2-1.044.14-1.146-.06-.1-.221-.16-.462-.28z" />
        </svg>
      </motion.a>
    </div>
  )
}
