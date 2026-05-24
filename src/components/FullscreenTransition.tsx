import { motion } from 'framer-motion'
import styled from 'styled-components'
import { type ReactNode, useEffect, useState } from 'react'

interface FullscreenTransitionProps {
  children: ReactNode
}

const OuterContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
`

const InnerContainer = styled(motion.div)`
  display: grid;
  gap: 16px;
`

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
    <OuterContainer
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
    >
      <InnerContainer
        layout
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
      </InnerContainer>
    </OuterContainer>
  )
}

export default FullscreenTransition
