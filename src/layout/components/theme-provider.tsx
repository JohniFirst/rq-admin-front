import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectCurrentTheme } from '@/store/slice/system-info'

interface ThemeProviderProps {
  children: ReactNode
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const currentTheme = useAppSelector(selectCurrentTheme)

  useEffect(() => {
    // 应用主题颜色到 CSS 变量
    const root = document.documentElement
    for (const [key, value] of Object.entries(currentTheme.colors)) {
      root.style.setProperty(`--color-${key}`, value as string)
    }

    // 设置暗色/亮色模式
    if (currentTheme.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [currentTheme])

  return <>{children}</>
}

export default ThemeProvider
