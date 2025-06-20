import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from '../video-player.module.css'

interface PlaybackRateControlProps {
	playbackRate: number
	onPlaybackRateChange: (rate: number) => void
}

const playbackRateOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0] as const

const PlaybackRateControl: React.FC<PlaybackRateControlProps> = ({ playbackRate, onPlaybackRateChange }) => {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div
			ref={containerRef}
			className={styles.playbackRateContainer}
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				className={styles.controlButton}
				onClick={() => setIsOpen(!isOpen)}
				aria-label='Playback Speed'
				type='button'
			>
				{playbackRate}x
			</button>
			{isOpen && (
				<div className={styles.playbackRateMenu}>
					{playbackRateOptions.map((rate) => (
						<button
							key={rate}
							type='button'
							className={`${styles.playbackRateOption} ${rate === playbackRate ? styles.active : ''}`}
							onClick={() => {
								onPlaybackRateChange(rate)
								setIsOpen(false)
							}}
						>
							{rate}x
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default PlaybackRateControl
