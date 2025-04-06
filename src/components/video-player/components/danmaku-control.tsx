import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from '../video-player.module.css'

interface DanmakuControlProps {
	isEnabled: boolean
	onToggle: () => void
	onSend: (text: string) => void
}

const DanmakuControl: React.FC<DanmakuControlProps> = ({
	isEnabled,
	onToggle,
	onSend,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [text, setText] = useState('')
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

	const handleSend = () => {
		if (text.trim()) {
			onSend(text)
			setText('')
			setIsOpen(false)
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSend()
		}
	}

	return (
		<div
			ref={containerRef}
			className={styles.danmakuControlContainer}
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
		>
			<button
				className={`${styles.controlButton} ${isEnabled ? styles.active : ''}`}
				onClick={onToggle}
				aria-label='Toggle Danmaku'
				type='button'
			>
				💬
			</button>
			{isOpen && (
				<div className={styles.danmakuInputContainer}>
					<input
						type='text'
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder='输入弹幕内容'
						className={styles.danmakuInput}
					/>
					<button
						type='button'
						onClick={handleSend}
						className={styles.danmakuSendButton}
						disabled={!text.trim()}
					>
						发送
					</button>
				</div>
			)}
		</div>
	)
}

export default DanmakuControl
