import Calendar from '@/components/Calendar'
import { useFullScreen } from '@/hooks/useFullScreen'
import { Button } from 'antd'
import { type MouseEvent, useRef } from 'react'

const CalendarPage = () => {
	const { toggleFullscreen } = useFullScreen()
	const calendarWpRef = useRef<HTMLDivElement>(null)

	const handleToggleFullscreen = (e: MouseEvent) => {
		e.stopPropagation()
		toggleFullscreen(calendarWpRef.current as HTMLElement)
	}

	return (
		<>
			<Button onClick={handleToggleFullscreen}>toggle全屏</Button>

			<div ref={calendarWpRef}>
				<Calendar />
			</div>
		</>
	)
}

export default CalendarPage
