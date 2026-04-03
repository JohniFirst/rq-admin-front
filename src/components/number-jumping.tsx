import { memo, useMemo } from 'react'

interface NumberJumpingProps {
  startValue?: number
  endValue: number
  duration?: number
  className?: string
}

// 智能格式化数字，长的数字用万/亿单位显示
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

  return (
    <span className={className} style={{ whiteSpace: 'nowrap' }}>
      {displayValue}
    </span>
  )
})

NumberJumping.displayName = 'NumberJumping'

export default NumberJumping
