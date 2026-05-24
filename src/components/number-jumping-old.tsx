import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface NumberJumpingProps {
  startValue?: number
  endValue: number
  duration?: number
  className?: string
}

const StyledSpan = styled.span``

function NumberJumping({
  startValue = 0,
  endValue,
  duration = 300,
  className,
}: NumberJumpingProps) {
  const [currentValue, setCurrentValue] = useState(startValue)

  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    let elapsedTime = 0

    const animate = () => {
      if (elapsedTime < duration) {
        const increment = (endValue - startValue) * Math.sqrt(elapsedTime / duration)
        setCurrentValue(prevValue => prevValue + increment)
        elapsedTime += 10
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCurrentValue(endValue)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [startValue, endValue, duration])

  return <StyledSpan className={className}>{currentValue}</StyledSpan>
}

export default NumberJumping
