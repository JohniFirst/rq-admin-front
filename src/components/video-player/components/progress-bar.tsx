import { Slider } from 'antd'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from '../video-player.module.css'

interface ProgressBarProps {
	currentTime: number
	duration: number
	onTimeChange: (time: number) => void
	onDragStart: () => void
	onDragEnd: () => void
	videoRef: React.RefObject<HTMLVideoElement>
}

const ProgressBar: React.FC<ProgressBarProps> = ({
	currentTime,
	duration,
	onTimeChange,
	onDragStart,
	onDragEnd,
	videoRef,
}) => {
	const previewCanvasRef = useRef<HTMLCanvasElement>(null)
	const [isPreviewVisible, setIsPreviewVisible] = useState(false)
	const [previewTime, setPreviewTime] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9)
	const [previewVideo, setPreviewVideo] = useState<HTMLVideoElement | null>(null)

	const formatTime = (time: number | undefined) => {
		if (time === undefined) return '0:00'
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	// 创建预览视频元素
	useEffect(() => {
		if (videoRef.current) {
			const video = videoRef.current
			const previewVideoElement = document.createElement('video')
			previewVideoElement.src = video.src
			previewVideoElement.muted = true
			previewVideoElement.preload = 'metadata'
			setPreviewVideo(previewVideoElement)

			return () => {
				previewVideoElement.pause()
				previewVideoElement.src = ''
			}
		}
	}, [videoRef])

	const handleSliderHover = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isDragging) return

		const sliderRect = e.currentTarget.getBoundingClientRect()
		const position = (e.clientX - sliderRect.left) / sliderRect.width
		const time = position * duration
		setPreviewTime(time)
		setIsPreviewVisible(true)

		// 更新预览画布
		updatePreviewCanvas(time)
	}

	const handleSliderLeave = () => {
		if (!isDragging) {
			setIsPreviewVisible(false)
		}
	}

	// 更新预览画布
	const updatePreviewCanvas = (time: number) => {
		if (!previewVideo || !previewCanvasRef.current) return

		const canvas = previewCanvasRef.current
		const ctx = canvas.getContext('2d')

		if (!ctx) return

		// 使用预览视频元素而不是主视频
		previewVideo.currentTime = time

		// 当视频seek完成时绘制预览
		const handleSeeked = () => {
			ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height)
			previewVideo.removeEventListener('seeked', handleSeeked)
		}

		previewVideo.addEventListener('seeked', handleSeeked)
	}

	// 初始化预览画布尺寸
	useEffect(() => {
		if (previewCanvasRef.current && videoRef.current) {
			const canvas = previewCanvasRef.current
			const video = videoRef.current

			// 获取视频的实际宽高比
			const videoWidth = video.videoWidth
			const videoHeight = video.videoHeight

			if (videoWidth && videoHeight) {
				const aspectRatio = videoWidth / videoHeight
				setVideoAspectRatio(aspectRatio)

				// 设置画布尺寸为固定宽度，高度根据视频比例计算
				const canvasWidth = 160
				const canvasHeight = Math.round(canvasWidth / aspectRatio)

				canvas.width = canvasWidth
				canvas.height = canvasHeight
			}
		}
	}, [videoRef])

	const handleMouseDown = () => {
		setIsDragging(true)
		onDragStart()
	}

	const handleMouseUp = () => {
		setIsDragging(false)
		onDragEnd()
	}

	const handleSliderChange = (value: number) => {
		onTimeChange(value)
	}

	return (
		<div className={styles.progressContainer}>
			<div className={styles.timeProgress}>
				<span className={styles.timeDisplay}>
					{formatTime(currentTime)} / {formatTime(duration)}
				</span>
			</div>
			<div
				className={styles.sliderContainer}
				onMouseMove={handleSliderHover}
				onMouseLeave={handleSliderLeave}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			>
				<Slider
					value={currentTime}
					max={duration}
					onChange={handleSliderChange}
					tooltip={{ formatter: formatTime }}
					className={styles.slider}
					styles={{
						rail: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
						track: { backgroundColor: '#1890ff' },
						handle: { borderColor: '#1890ff' },
					}}
				/>
			</div>
			<canvas
				ref={previewCanvasRef}
				className={`${styles.previewCanvas} ${isPreviewVisible ? styles.visible : ''}`}
				style={{
					left: `${(previewTime / duration) * 100}%`,
					border: 'none',
					height: `${Math.round(160 / videoAspectRatio)}px`,
				}}
			/>
		</div>
	)
}

export default ProgressBar
