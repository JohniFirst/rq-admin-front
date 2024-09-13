import { type MouseEvent, useState } from 'react'

import '../css/video.css'

interface VideoTimesSpeedProps {
	onChange: (newValue: number) => void
}

const speedChangeList = ['3.0', '2.0', '1.5', '1.0', '0.75', '0.5'] as const

function VideoTimesSpeed({ onChange }: VideoTimesSpeedProps) {
	const [playTimes, setPlayTimes] = useState(1)

	function changePlaySpeed(event: MouseEvent<HTMLUListElement>): void {
		const target = event.target as HTMLLIElement

		setPlayTimes(+target.innerText)

		onChange(+target.innerText)
	}

	return (
		<div className='relative'>
			<p className='play-times-speed-btn'>
				{playTimes === 1 ? '倍速' : `${playTimes}x`}
			</p>

			<ul className='play-times-speed-select-wp' onClick={changePlaySpeed}>
				{speedChangeList.map((item) => (
					<li key={item} className={playTimes === +item ? 'speed-acive' : ''}>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}

export default VideoTimesSpeed
