import React, { useState, useCallback } from 'react'
import { Button, ButtonProps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingButtonProps extends ButtonProps {
  onClick?: () => Promise<void> | void
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ onClick, ...props }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    if (!onClick) return

    setLoading(true)
    try {
      const result = onClick()
      // 检查是否是Promise
      if (result && typeof (result as Promise<void>).then === 'function') {
        await result
      }
    } catch (error) {
      console.error('Button click error:', error)
      // 可以在这里添加错误处理逻辑
    } finally {
      setLoading(false)
    }
  }, [onClick])

  return (
    <Button
      {...props}
      onClick={handleClick}
      loading={loading}
      icon={loading ? <LoadingOutlined /> : props.icon}
    />
  )
}

export default LoadingButton
