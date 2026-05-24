import { memo, useMemo } from 'react'
import styled from 'styled-components'

interface NumberJumpingProps {
  startValue?: number
  endValue: number
  duration?: number
  className?: string
}

const StyledSpan = styled.span`
  white-space: nowrap;
`

const formatNumber = (num: number): string => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(num % 100000000 === 0 ? 0 : 1) + '亿'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(num % 10000 === 0 ? 0 : 1) + '万'
  }
  return num.toLocaleString()
}

const NumberJumping = memo<NumberJumpingProps>(({ endValue, className }) => {
  const displayValue = useMemo(() => formatNumber(endValue), [endValue])

  return <StyledSpan className={className}>{displayValue}</StyledSpan>
})

NumberJumping.displayName = 'NumberJumping'

export default NumberJumping
