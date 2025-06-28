import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import DanmakuControl from './components/danmaku-control'
import PlaybackRateControl from './components/playback-rate-control'
import ProgressBar from './components/progress-bar'
import QualityControl from './components/quality-control'
// 导入子组件
import VolumeControl from './components/volume-control'
import styles from './video-player.module.css'

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  width?: number | string
  height?: number | string
  captions?: Array<{
    src: string
    label: string
    srcLang: string
  }>
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className = '',
  width = '100%',
  height = 'auto',
  captions = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showPlayIcon, setShowPlayIcon] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null)

  const showToast = useCallback(
    (message: string) => {
      if (toastTimeout) {
        clearTimeout(toastTimeout)
      }
      setToastMessage(message)
      const timeout = setTimeout(() => {
        setToastMessage(null)
      }, 2000)
      setToastTimeout(timeout)
    },
    [toastTimeout],
  )

  useEffect(() => {
    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout)
      }
    }
  }, [toastTimeout])

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (!videoRef.current || isDragging) return
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setShowPlayIcon(true)
  }

  const handleTimeChange = (time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return
    videoRef.current.volume = value
    setVolume(value)
    if (value === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handleMuteToggle = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Space') {
      e.preventDefault()
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play()
          setIsPlaying(true)
          showToast('开始播放')
        } else {
          videoRef.current.pause()
          setIsPlaying(false)
          showToast('已暂停')
        }
      }
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault()
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5)
        showToast('快退 5 秒')
      }
    } else if (e.code === 'ArrowRight') {
      e.preventDefault()
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration,
          videoRef.current.currentTime + 5,
        )
        showToast('快进 5 秒')
      }
    } else if (e.code === 'ArrowUp') {
      e.preventDefault()
      if (videoRef.current) {
        videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1)
        setVolume(videoRef.current.volume)
        showToast(`音量: ${Math.round(videoRef.current.volume * 100)}%`)
      }
    } else if (e.code === 'ArrowDown') {
      e.preventDefault()
      if (videoRef.current) {
        videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1)
        setVolume(videoRef.current.volume)
        showToast(`音量: ${Math.round(videoRef.current.volume * 100)}%`)
      }
    } else if (e.code === 'KeyM') {
      e.preventDefault()
      handleMuteToggle()
    } else if (e.code === 'KeyF') {
      e.preventDefault()
      toggleFullscreen()
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      setShowPlayIcon(false)
    }

    const handlePause = () => {
      setIsPlaying(false)
      setShowPlayIcon(true)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.focus()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${styles.videoPlayer} ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
      role="application"
      aria-label="Video Player"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className={styles.video}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onLoadedMetadata={handleLoadedMetadata}
      >
        {captions.map((caption, index) => (
          <track
            key={index}
            kind="captions"
            src={caption.src}
            label={caption.label}
            srcLang={caption.srcLang}
          />
        ))}
      </video>
      {showPlayIcon && !isPlaying && !isDragging && (
        <div className={styles.centerPlayButton} onClick={togglePlay}>
          <button
            type="button"
            className={styles.playButton}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      )}
      <div
        className={`${styles.controls} ${showControls ? styles.visible : ''}`}
        onMouseEnter={() => setShowControls(true)}
      >
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onTimeChange={handleTimeChange}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          videoRef={videoRef}
        />
        <div className={styles.controlBar}>
          <div className={styles.leftControls}>
            <button
              type="button"
              className={styles.controlButton}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={handleMuteToggle}
            />
          </div>
          <div className={styles.rightControls}>
            <PlaybackRateControl
              playbackRate={playbackRate}
              onPlaybackRateChange={handlePlaybackRateChange}
            />
            <QualityControl currentQuality="auto" onQualityChange={() => {}} />
            <DanmakuControl isEnabled={false} onToggle={() => {}} onSend={() => {}} />
            <button
              type="button"
              className={styles.controlButton}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? '⤓' : '⤢'}
            </button>
          </div>
        </div>
      </div>
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
    </div>
  )
}

export default VideoPlayer
