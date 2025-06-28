import { motion } from 'framer-motion'
import { type ReactNode, useEffect, useState } from 'react'

interface FullscreenTransitionProps {
  children: ReactNode
}

const FullscreenTransition = ({ children }: FullscreenTransitionProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        scale: isFullscreen ? [1, 1.02, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        times: [0, 0.6, 1],
        ease: 'easeInOut',
      }}
      className="w-full h-full"
    >
      <motion.div
        layout
        className="grid gap-4"
        initial={false}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          delay: 0.1,
          staggerChildren: 0.1,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default FullscreenTransition
