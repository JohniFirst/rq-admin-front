import { SettingOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps, Switch, TimePicker, message } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentTheme, setTheme } from '@/store/slice/system-info'
import dayjs from 'dayjs'

type ThemeMode = 'light' | 'dark' | 'system' | 'auto'

interface AutoThemeConfig {
  enabled: boolean
  lightTime: string // HH:mm 格式
  darkTime: string // HH:mm 格式
}

// Styled Components
const ThemeButton = styled(motion.button)<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .icon {
    font-size: 18px;
  }

  .text {
    font-size: 14px;
    font-weight: 500;
  }

  .setting-icon {
    font-size: 12px;
    opacity: 0.6;
  }
`

const DropdownContainer = styled.div<{ $isDark: boolean }>`
  .ant-dropdown-menu {
    min-width: 280px;
    padding: 8px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, ${props => (props.$isDark ? '0.3' : '0.1')});
    backdrop-filter: blur(10px);
    background: ${props => (props.$isDark ? 'var(--color-surface)' : 'var(--color-background)')};
    border: 1px solid var(--color-border);
  }

  .ant-dropdown-menu-item {
    border-radius: 8px;
    margin: 2px 0;
    padding: 8px 12px;
    transition: all 0.2s ease;
    color: var(--color-text);

    &:hover {
      background-color: var(--color-surface-hover);
    }
  }

  .ant-dropdown-menu-item-divider {
    margin: 8px 0;
    border-color: var(--color-border);
  }

  .ant-dropdown-menu-item-selected {
    background-color: var(--color-primary);
    color: var(--color-background);
  }
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 256px;
`

const MenuItemContent = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CheckMark = styled.span`
  color: var(--color-primary);
  font-weight: bold;
`

const AutoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const AutoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TimeSettings = styled.div`
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`

const ThemeSwitcher = () => {
  const currentTheme = useAppSelector(selectCurrentTheme)
  const dispatch = useAppDispatch()
  const [autoConfig, setAutoConfig] = useState<AutoThemeConfig>({
    enabled: false,
    lightTime: '06:00',
    darkTime: '18:00',
  })
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light')
  const [currentMode, setCurrentMode] = useState<ThemeMode>('light')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isDark = currentTheme.isDark

  // 计算下次主题切换时间
  const getNextSwitchTime = () => {
    const now = dayjs()
    const lightTime = dayjs(autoConfig.lightTime, 'HH:mm')
    const darkTime = dayjs(autoConfig.darkTime, 'HH:mm')

    // 设置今天的切换时间
    const todayLightTime = dayjs().hour(lightTime.hour()).minute(lightTime.minute()).second(0)
    const todayDarkTime = dayjs().hour(darkTime.hour()).minute(darkTime.minute()).second(0)

    // 判断当前应该是什么主题
    let shouldBeLight = false
    let nextSwitchTime: dayjs.Dayjs

    if (lightTime.isBefore(darkTime)) {
      // 同一天内：06:00 - 18:00 为浅色
      shouldBeLight = now.isAfter(todayLightTime) && now.isBefore(todayDarkTime)
      nextSwitchTime = shouldBeLight ? todayDarkTime : todayLightTime
    } else {
      // 跨天：18:00 - 06:00 为深色
      shouldBeLight = now.isAfter(todayLightTime) || now.isBefore(todayDarkTime)
      nextSwitchTime = shouldBeLight ? todayDarkTime : todayLightTime
    }

    // 如果下次切换时间已经过了，设置为明天
    if (nextSwitchTime.isBefore(now)) {
      nextSwitchTime = nextSwitchTime.add(1, 'day')
    }

    return { shouldBeLight, nextSwitchTime }
  }

  // 设置自动主题切换定时器
  const setupAutoThemeTimer = () => {
    // 清除之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (!autoConfig.enabled) return

    const { shouldBeLight, nextSwitchTime } = getNextSwitchTime()
    const targetTheme = shouldBeLight ? 'default-light' : 'purple-dark'

    // 立即应用当前应该的主题
    if (currentTheme.id !== targetTheme) {
      dispatch(setTheme(targetTheme))
    }

    // 计算到下次切换的毫秒数
    const delay = nextSwitchTime.diff(dayjs())

    // 设置一次性定时器
    timerRef.current = setTimeout(() => {
      // 切换主题
      const newTheme = targetTheme === 'default-light' ? 'purple-dark' : 'default-light'
      dispatch(setTheme(newTheme))

      // 递归设置下次切换
      setupAutoThemeTimer()
    }, delay)
  }

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemMode = e.matches ? 'dark' : 'light'
      setSystemMode(newSystemMode)

      // 如果当前是跟随系统模式，则立即切换主题
      if (currentMode === 'system') {
        const systemTheme = newSystemMode === 'dark' ? 'purple-dark' : 'default-light'
        dispatch(setTheme(systemTheme))
      }
    }

    // 初始化系统主题
    setSystemMode(mediaQuery.matches ? 'dark' : 'light')

    // 监听系统主题变化
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [dispatch, currentMode])

  // 自动主题切换逻辑
  useEffect(() => {
    setupAutoThemeTimer()

    // 清理定时器
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [autoConfig.enabled, autoConfig.lightTime, autoConfig.darkTime, currentTheme.id, dispatch])

  // 获取当前主题模式
  const getCurrentThemeMode = (): ThemeMode => {
    if (autoConfig.enabled) return 'auto'
    if (currentTheme.id === 'purple-dark') return 'dark'
    if (currentTheme.id === 'default-light') return 'light'
    return 'system'
  }

  // 处理主题切换
  const handleThemeChange = (mode: ThemeMode) => {
    setCurrentMode(mode)

    switch (mode) {
      case 'light': {
        setAutoConfig(prev => ({ ...prev, enabled: false }))
        dispatch(setTheme('default-light'))
        break
      }
      case 'dark': {
        setAutoConfig(prev => ({ ...prev, enabled: false }))
        dispatch(setTheme('purple-dark'))
        break
      }
      case 'system': {
        setAutoConfig(prev => ({ ...prev, enabled: false }))
        // 根据当前系统主题设置
        const systemTheme = systemMode === 'dark' ? 'purple-dark' : 'default-light'
        dispatch(setTheme(systemTheme))
        break
      }
      case 'auto': {
        setAutoConfig(prev => ({ ...prev, enabled: true }))
        // 立即设置自动切换
        setupAutoThemeTimer()
        break
      }
    }
  }

  // 处理自动切换时间设置
  const handleAutoTimeChange = (type: 'light' | 'dark', time: dayjs.Dayjs | null) => {
    if (!time) return

    const timeStr = time.format('HH:mm')
    setAutoConfig(prev => ({
      ...prev,
      [type === 'light' ? 'lightTime' : 'darkTime']: timeStr,
    }))

    if (autoConfig.enabled) {
      // 如果自动切换已启用，重新设置定时器
      setupAutoThemeTimer()
    }
  }

  // 切换自动模式开关
  const handleAutoToggle = (enabled: boolean) => {
    setAutoConfig(prev => ({ ...prev, enabled }))
    if (enabled) {
      setCurrentMode('auto')
      handleThemeChange('auto')
      message.success('已启用自动主题切换')
    } else {
      // 清除定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      message.info('已关闭自动主题切换')
    }
  }

  // 获取当前主题图标
  const getThemeIcon = () => {
    const mode = getCurrentThemeMode()
    switch (mode) {
      case 'dark':
        return '🌙'
      case 'light':
        return '☀️'
      case 'system':
        return '🖥️'
      case 'auto':
        return '⏰'
      default:
        return isDark ? '🌙' : '☀️'
    }
  }

  // 获取当前主题文本
  const getThemeText = () => {
    const mode = getCurrentThemeMode()
    switch (mode) {
      case 'dark':
        return '深色'
      case 'light':
        return '浅色'
      case 'system':
        return '跟随系统'
      case 'auto':
        return '自动切换'
      default:
        return isDark ? '深色' : '浅色'
    }
  }

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'light',
      label: (
        <MenuItem>
          <MenuItemContent>
            <span>☀️</span>
            <span>浅色主题</span>
          </MenuItemContent>
          {getCurrentThemeMode() === 'light' && <CheckMark>✓</CheckMark>}
        </MenuItem>
      ),
      onClick: () => handleThemeChange('light'),
    },
    {
      key: 'dark',
      label: (
        <MenuItem>
          <MenuItemContent>
            <span>🌙</span>
            <span>深色主题</span>
          </MenuItemContent>
          {getCurrentThemeMode() === 'dark' && <CheckMark>✓</CheckMark>}
        </MenuItem>
      ),
      onClick: () => handleThemeChange('dark'),
    },
    {
      key: 'system',
      label: (
        <MenuItem>
          <MenuItemContent>
            <span>🖥️</span>
            <span>跟随系统</span>
          </MenuItemContent>
          {getCurrentThemeMode() === 'system' && <CheckMark>✓</CheckMark>}
        </MenuItem>
      ),
      onClick: () => handleThemeChange('system'),
    },
    {
      type: 'divider',
    },
    {
      key: 'auto',
      label: (
        <AutoSection>
          <AutoHeader>
            <MenuItemContent>
              <span>⏰</span>
              <span>自动切换</span>
            </MenuItemContent>
            <div onClick={e => e.stopPropagation()}>
              <Switch size="small" checked={autoConfig.enabled} onChange={handleAutoToggle} />
            </div>
          </AutoHeader>
          {autoConfig.enabled && (
            <TimeSettings>
              <TimeRow>
                <span>浅色时间:</span>
                <div onClick={e => e.stopPropagation()}>
                  <TimePicker
                    size="small"
                    format="HH:mm"
                    value={dayjs(autoConfig.lightTime, 'HH:mm')}
                    onChange={time => handleAutoTimeChange('light', time)}
                  />
                </div>
              </TimeRow>
              <TimeRow>
                <span>深色时间:</span>
                <div onClick={e => e.stopPropagation()}>
                  <TimePicker
                    size="small"
                    format="HH:mm"
                    value={dayjs(autoConfig.darkTime, 'HH:mm')}
                    onChange={time => handleAutoTimeChange('dark', time)}
                  />
                </div>
              </TimeRow>
            </TimeSettings>
          )}
        </AutoSection>
      ),
      onClick: () => {
        if (!autoConfig.enabled) {
          handleAutoToggle(true)
        }
      },
    },
  ]

  return (
    <DropdownContainer $isDark={isDark}>
      <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" trigger={['click']}>
        <ThemeButton
          $isDark={isDark}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="主题设置"
        >
          <span className="icon">{getThemeIcon()}</span>
          <span className="text">{getThemeText()}</span>
          <SettingOutlined className="setting-icon" />
        </ThemeButton>
      </Dropdown>
    </DropdownContainer>
  )
}

export default ThemeSwitcher
