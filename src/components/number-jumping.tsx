import { useState, useEffect, useRef } from 'react'

interface NumberJumpingProps {
  startValue?: number
  endValue: number
  duration?: number
  className?: string
}

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
        // 调整非线性的增量计算方式，实现更明显的先快后慢
        const increment =
          (endValue - startValue) * Math.sqrt(elapsedTime / duration)
        setCurrentValue((prevValue) => prevValue + increment)
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

  return <span className={className}>{currentValue}</span>
}

export default NumberJumping
