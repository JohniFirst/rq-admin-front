import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from '../video-player.module.css'

interface QualityControlProps {
	currentQuality: string
	onQualityChange: (quality: string) => void
}

const qualityOptions = ['auto', '1080P', '720P', '480P']

const QualityControl: React.FC<QualityControlProps> = ({
	currentQuality,
	onQualityChange,
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

	return (
		<div
			ref={containerRef}
			className={styles.qualityControlContainer}
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				type='button'
				className={styles.controlButton}
				onClick={() => setIsOpen(!isOpen)}
				aria-label='Video Quality'
			>
				HD
			</button>
			{isOpen && (
				<div className={styles.qualityMenu}>
					{qualityOptions.map((quality) => (
						<button
							type='button'
							key={quality}
							className={`${styles.qualityOption} ${
								quality === currentQuality ? styles.active : ''
							}`}
							onClick={() => {
								onQualityChange(quality)
								setIsOpen(false)
							}}
						>
							{quality}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default QualityControl
