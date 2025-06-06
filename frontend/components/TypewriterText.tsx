'use client'

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
}

export const TypewriterText = ({ text, className = "", delay = 0 }: TypewriterTextProps) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50) // Velocidad de escritura

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[2px] h-[1em] bg-current ml-[1px]"
      />
    </motion.p>
  )
} 