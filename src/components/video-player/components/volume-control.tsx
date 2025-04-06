import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from '../video-player.module.css'

interface VolumeControlProps {
	volume: number
	isMuted: boolean
	onVolumeChange: (volume: number) => void
	onMuteToggle: () => void
}

const VolumeControl: React.FC<VolumeControlProps> = ({
	volume,
	isMuted,
	onVolumeChange,
	onMuteToggle,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onVolumeChange(Number(event.target.value))
	}

	return (
		<div
			ref={containerRef}
			className={styles.volumeControlContainer}
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				type='button'
				className={styles.controlButton}
				onClick={onMuteToggle}
				aria-label={isMuted ? 'Unmute' : 'Mute'}
			>
				{isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}
			</button>
			{isOpen && (
				<div className={styles.volumeSliderContainer}>
					<input
						type='range'
						min='0'
						max='1'
						step='0.1'
						value={isMuted ? 0 : volume}
						onChange={handleVolumeChange}
						className={styles.volumeSlider}
						aria-label='Volume'
					/>
				</div>
			)}
		</div>
	)
}

export default VolumeControl
