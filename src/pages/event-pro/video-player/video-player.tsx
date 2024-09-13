import pause from '@/assets/svgs/video-player/pause.svg'
import play from '@/assets/svgs/video-player/play.svg'
import { useEffect, useState } from 'react'
import VideoPlayProgress from './components/video-play-progress.tsx'
import VideoTimesSpeed from './components/video-times-speed.tsx'
import './css/video.css'

import type { MouseEvent } from 'react'

function VideoPlayer() {
	// 视频播放/暂停
	const [isPlay, setIsPlay] = useState(false)
	// 视频总时长
	const [duration, setDuration] = useState(0)
	// 当前播放时间
	const [currentTime, setCurrentTime] = useState(0)
	// 显示控制层
	const [isShowControls, setIsShowControls] = useState(false)

	useEffect(() => {
		videoPlayingTimer()

		window.addEventListener('resize', initControlsSize)

		return () => {
			window.removeEventListener('resize', initControlsSize)
		}
	}, [])

	/**
	 * 初始化控制层大小
	 */
	const initControlsSize = () => {
		// 不要迷信框架，业务实现怎么方便怎么来
		// 获取video-wp的宽高
		const video = document.querySelector('#video') as HTMLVideoElement
		const videoWpWidth = video.offsetWidth
		const videoWpHeight = video.offsetHeight

		const videoControls = document.querySelector(
			'.video-controls',
		) as HTMLDivElement
		videoControls.style.width = `${videoWpWidth}px`
		videoControls.style.height = `${videoWpHeight}px`

		setIsShowControls(true)
	}

	/**
	 * 视频播放计时器
	 */
	const videoPlayingTimer = () => {
		const video = document.querySelector('#video') as HTMLVideoElement

		video.oncanplay = () => {
			setDuration(video.duration)

			initControlsSize()
		}

		video.addEventListener('timeupdate', (e: Event) => {
			const video = e.target as HTMLVideoElement

			setCurrentTime(video.currentTime)
		})

		video.addEventListener('play', () => {
			setIsPlay(true)
		})

		video.addEventListener('pause', () => {
			setIsPlay(false)
		})
	}

	/**
	 * 格式化时间
	 * @param time 当前播放进度，单位 s
	 * @returns 如果时长大于一小时 hh:mm:ss，否则 mm:ss
	 */
	const formatTime = (time: number) => {
		const hours = Math.floor(time / 3600)
		const minutes = Math.floor((time % 3600) / 60)
		const seconds = Math.floor(time % 60)

		const timePadStart = (time: number, length = 2) => {
			return time.toString().padStart(length, '0')
		}

		let formatResult = `${timePadStart(minutes)}:${timePadStart(seconds)}`

		if (hours > 0) {
			formatResult += `${timePadStart(hours)}:`
		}

		return formatResult
	}

	/**
	 * 处理视频播放/暂停
	 * @param _event
	 */
	const handleVideoPlay = (e: MouseEvent): void => {
		e.stopPropagation()
		const video = document.querySelector('#video') as HTMLVideoElement

		if (video.paused) {
			video.play()
		} else {
			video.pause()
		}
	}

	const handleVideoFullScreen = (event: MouseEvent): void => {
		event.stopPropagation()
		console.log(event, '这里写全屏实现代码')
	}

	function handleVideoPlayProgress(newVal: number): void {
		const video = document.querySelector('#video') as HTMLVideoElement

		video.currentTime = +newVal
	}

	const changeVideoTimesSpeed = (newValue: number): void => {
		const video = document.querySelector('#video') as HTMLVideoElement

		video.playbackRate = newValue
	}

	return (
		<div className='video-controls-wp' onDoubleClick={handleVideoFullScreen}>
			<video id='video' width='960' src='/demo.mp4' height='540' />

			<div className='video-controls'>
				<div
					className='controls-bottom-wp'
					style={{ display: isShowControls ? 'block' : 'none' }}
				>
					<div className='controls-top-play-time-wp'>
						{/* 小的播放/暂停按钮 */}
						<img
							onClick={handleVideoPlay}
							style={{ cursor: 'pointer' }}
							src={isPlay ? pause : play}
							width={50}
							height={50}
							alt='播放/暂停'
						/>

						{/* 播放时间展示 */}
						<p className='paly-time'>
							{formatTime(currentTime)}/{formatTime(duration)}
						</p>
					</div>

					{/* 播放进度条 */}
					<VideoPlayProgress
						max={duration}
						value={currentTime}
						onChange={handleVideoPlayProgress}
					/>

					{/* 底部操作栏 */}
					<div className='controls-bottom-setting-wp'>
						<VideoTimesSpeed onChange={changeVideoTimesSpeed} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default VideoPlayer
