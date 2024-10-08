import CountUp from 'react-countup'

interface NumberJumpingProps {
	startValue?: number
	endValue: number
	duration?: number
	className?: string
}

const NumberJumping = ({ endValue, duration }: NumberJumpingProps) => {
	return <CountUp end={endValue} duration={duration} />
}

export default NumberJumping
