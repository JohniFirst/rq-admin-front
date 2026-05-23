import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { headerButtonBase } from './styles'

const FullScreenWrapper = styled.button`
  ${headerButtonBase}
  padding: 0;
`

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Error attempting to toggle fullscreen:', err)
    }
  }

  return (
    <FullScreenWrapper onClick={toggleFullscreen} title={isFullscreen ? '退出全屏' : '全屏'}>
      {isFullscreen ? (
        <FullscreenExitOutlined style={{ fontSize: 18, color: 'var(--color-text-secondary)' }} />
      ) : (
        <FullscreenOutlined style={{ fontSize: 18, color: 'var(--color-text-secondary)' }} />
      )}
    </FullScreenWrapper>
  )
}

export default FullScreen
