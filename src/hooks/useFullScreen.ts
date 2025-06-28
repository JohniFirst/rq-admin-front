import { type MouseEvent, useEffect, useState } from 'react'

class FullScreenManager {
  private static instance: FullScreenManager
  private isFullscreen: boolean

  private constructor() {
    this.isFullscreen = false
  }

  public static getInstance(): FullScreenManager {
    if (!FullScreenManager.instance) {
      FullScreenManager.instance = new FullScreenManager()
    }
    return FullScreenManager.instance
  }

  public toggleFullscreen(eOrElement?: MouseEvent | HTMLElement, isBody = false) {
    let target: HTMLElement | null = null
    if (eOrElement instanceof HTMLElement) {
      target = eOrElement
    } else if (eOrElement && 'currentTarget' in eOrElement) {
      target = eOrElement.currentTarget as HTMLElement
    }

    if (this.isFullscreen) {
      document.exitFullscreen()
    } else {
      if (isBody) {
        document.documentElement.requestFullscreen()
      } else if (target) {
        target.requestFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
    }
    this.isFullscreen = !this.isFullscreen
  }

  public getIsFullscreen() {
    return this.isFullscreen
  }
}

/**
 * Hook to manage full screen mode using a singleton pattern.
 *
 * @param {boolean} isBody - Whether to use the body element for full screen mode (default: false)
 * @return {{isFullscreen: boolean, toggleFullscreen: function}} An object containing the full screen state and toggle function.
 */
export function useFullScreen(isBody = false) {
  const [isFullscreen, setIsFullscreen] = useState(
    FullScreenManager.getInstance().getIsFullscreen(),
  )

  useEffect(() => {
    // 监听全屏变化事件
    const fullscreenchange = () => {
      setIsFullscreen(FullScreenManager.getInstance().getIsFullscreen())
    }

    document.addEventListener('fullscreenchange', fullscreenchange)

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenchange)
    }
  }, [])

  const toggleFullscreen = (eOrElement?: MouseEvent | HTMLElement) => {
    FullScreenManager.getInstance().toggleFullscreen(eOrElement, isBody)
  }

  return {
    isFullscreen,
    toggleFullscreen,
  }
}
