import {
  AppstoreOutlined,
  ExperimentOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons'
import { Drawer, Switch, Tabs, message } from 'antd'
import { animate, motion, useMotionValue } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CommonMenu, DrawerMenu, TopMenu } from '@/assets/svgs/nav-type/system-svgs'
import { LocalStorageKeys } from '@/enums/localforage'
import { LayoutModeEnum } from '@/enums/system'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setlayoutMode, setShowNavigationBar } from '@/store/slice/system-info'
import ThemeConfig from './theme-config'

// 布局模式配置
const layoutModeArr = [
  { svg: <CommonMenu />, title: '常规菜单', value: LayoutModeEnum.COMMON_MENU },
  { svg: <DrawerMenu />, title: '可折叠菜单', value: LayoutModeEnum.DRAWER_MENU },
  { svg: <TopMenu />, title: '顶部菜单', value: LayoutModeEnum.HEADER_MENU },
]

// 其他设置项配置
const settingsItems = [
  {
    key: 'navigationBar',
    label: '显示导航标签栏',
    description: '显示顶部页面导航标签',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'pageAnimation',
    label: '页面切换动画',
    description: '页面切换时的过渡动画效果',
    icon: <ExperimentOutlined />,
  },
  {
    key: 'progressBar',
    label: '显示加载进度条',
    description: '顶部显示页面加载进度',
    icon: <TableOutlined />,
  },
]

// 加载/保存设置到 localStorage
const loadSettings = () => {
  try {
    const saved = localStorage.getItem(LocalStorageKeys.SETTINGS)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const saveSettings = (settings: Record<string, boolean>) => {
  localStorage.setItem(LocalStorageKeys.SETTINGS, JSON.stringify(settings))
}

// Styled Components
const FloatingButton = styled(motion.div)`
  position: fixed;
  z-index: 1000;
  cursor: grab;
  touch-action: none;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
  }

  &:active {
    cursor: grabbing;
  }

  .setting-icon {
    font-size: 24px;
    color: white;
    transition: transform 0.3s ease;
  }

  &:hover .setting-icon {
    transform: rotate(90deg);
  }
`

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    border-bottom: 1px solid var(--color-border);
  }

  .ant-drawer-body {
    padding: 0;
  }
`

const DrawerContent = styled.div`
  padding: 24px;
`

const Section = styled.section`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;

  .section-icon {
    font-size: 18px;
    color: var(--color-primary);
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }
`

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`

const LayoutItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border-radius: 12px;
  border: 2px solid ${props => (props.$isSelected ? 'var(--color-primary)' : 'var(--color-border)')};
  background: ${props =>
    props.$isSelected ? 'rgba(102, 126, 234, 0.08)' : 'var(--color-surface)'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: var(--color-primary);
    background: ${props =>
      props.$isSelected ? 'rgba(102, 126, 234, 0.12)' : 'var(--color-surface-hover)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .layout-title {
    font-size: 13px;
    font-weight: 500;
    margin-top: 10px;
    color: ${props => (props.$isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  }

  .selected-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    background: var(--color-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
  }
`

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }

  .setting-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .setting-icon {
    font-size: 20px;
    color: var(--color-primary);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 8px;
  }

  .setting-text {
    flex: 1;
  }

  .setting-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 2px;
  }

  .setting-desc {
    font-size: 12px;
    color: var(--color-text-disabled);
  }
`

const DrawerTab = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0;
    padding: 0 24px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .ant-tabs-tab {
    padding: 12px 0;
    font-size: 14px;
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--color-primary);
    font-weight: 500;
  }

  .ant-tabs-ink-bar {
    background: var(--color-primary);
  }
`

const SystemSettings: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState('layout')

  // 从 localStorage 加载设置
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const saved = loadSettings()
    return (
      saved || {
        navigationBar: true,
        pageAnimation: true,
        progressBar: true,
      }
    )
  })

  const x = useMotionValue(window.innerWidth - 80)
  const y = useMotionValue(window.innerHeight / 2)

  const layoutMode = useAppSelector(state => state.systemInfo.layoutMode)
  const showNavigationBar = useAppSelector(state => state.systemInfo.showNavigationBar)
  const dispatch = useAppDispatch()

  // 合并 Redux 状态和本地设置
  const mergedSettings = useMemo(
    () => ({
      ...settings,
      navigationBar: showNavigationBar,
    }),
    [settings, showNavigationBar],
  )

  // 保存设置到 localStorage
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  // 处理窗口 resize
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - 50
      const maxY = window.innerHeight - 50

      if (x.get() > maxX) x.set(maxX)
      if (y.get() > maxY) y.set(maxY)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [x, y])

  // 处理拖拽结束
  const handleDragEnd = useCallback(() => {
    const currentX = x.get()
    const windowWidth = window.innerWidth
    const targetX = currentX < windowWidth / 2 ? 16 : windowWidth - 66

    animate(x, targetX, {
      type: 'spring',
      duration: 0.2,
      bounce: 0,
    })

    setTimeout(() => setIsDragging(false), 0)
  }, [x])

  // 打开抽屉
  const showDrawer = useCallback(() => {
    if (!isDragging) {
      setOpen(true)
    }
  }, [isDragging])

  // 关闭抽屉
  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  // 切换布局模式
  const handleLayoutChange = useCallback(
    (newLayout: LayoutModeEnum) => {
      if (layoutMode !== newLayout) {
        dispatch(setlayoutMode(newLayout))
        message.success('布局切换成功')
      }
    },
    [dispatch, layoutMode],
  )

  // 切换设置项
  const handleSettingChange = useCallback(
    (key: string, checked: boolean) => {
      setSettings(prev => ({ ...prev, [key]: checked }))

      switch (key) {
        case 'navigationBar':
          dispatch(setShowNavigationBar(checked))
          message.success(checked ? '已显示导航标签栏' : '已隐藏导航标签栏')
          break
        case 'pageAnimation':
          message.success(checked ? '已开启页面动画' : '已关闭页面动画')
          break
        case 'progressBar':
          message.success(checked ? '已显示加载进度条' : '已隐藏加载进度条')
          break
      }
    },
    [dispatch],
  )

  // Tab 内容
  const tabItems = useMemo(
    () => [
      {
        key: 'layout',
        label: '布局设置',
        children: (
          <DrawerContent>
            <Section>
              <SectionHeader>
                <MenuFoldOutlined className="section-icon" />
                <h4 className="section-title">导航菜单布局</h4>
              </SectionHeader>
              <LayoutGrid>
                {layoutModeArr.map(item => (
                  <LayoutItem
                    key={item.value}
                    $isSelected={layoutMode === item.value}
                    onClick={() => handleLayoutChange(item.value)}
                  >
                    {item.svg}
                    <span className="layout-title">{item.title}</span>
                    {layoutMode === item.value && <span className="selected-badge">✓</span>}
                  </LayoutItem>
                ))}
              </LayoutGrid>
            </Section>

            <Section>
              <SectionHeader>
                <AppstoreOutlined className="section-icon" />
                <h4 className="section-title">其他设置</h4>
              </SectionHeader>
              <SettingsList>
                {settingsItems.map(item => (
                  <SettingItem key={item.key}>
                    <div className="setting-info">
                      <div className="setting-icon">{item.icon}</div>
                      <div className="setting-text">
                        <div className="setting-label">{item.label}</div>
                        <div className="setting-desc">{item.description}</div>
                      </div>
                    </div>
                    <Switch
                      checked={mergedSettings[item.key as keyof typeof mergedSettings]}
                      onChange={checked => handleSettingChange(item.key, checked)}
                    />
                  </SettingItem>
                ))}
              </SettingsList>
            </Section>
          </DrawerContent>
        ),
      },
      {
        key: 'theme',
        label: '主题配置',
        children: <ThemeConfig />,
      },
      {
        key: 'about',
        label: '关于',
        children: (
          <DrawerContent>
            <Section>
              <SectionHeader>
                <QuestionCircleOutlined className="section-icon" />
                <h4 className="section-title">关于系统</h4>
              </SectionHeader>
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <SafetyOutlined
                  style={{ fontSize: 48, color: 'var(--color-primary)', marginBottom: 16 }}
                />
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>RQ Admin</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>版本 1.0.0</p>
                <p style={{ color: 'var(--color-text-disabled)', fontSize: 12 }}>
                  基于 React + TypeScript + Vite 构建
                </p>
              </div>
            </Section>
          </DrawerContent>
        ),
      },
    ],
    [layoutMode, mergedSettings, handleLayoutChange, handleSettingChange],
  )

  return (
    <>
      <FloatingButton
        style={{ x, y }}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0, modifyTarget: target => target }}
        dragConstraints={{
          left: 16,
          right: window.innerWidth - 66,
          top: 16,
          bottom: window.innerHeight - 66,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: isDragging ? 1 : 1.1 }}
        whileDrag={{ scale: 1.1 }}
      >
        <SettingOutlined className="setting-icon" onClick={showDrawer} />
      </FloatingButton>

      <StyledDrawer title="系统设置" placement="right" onClose={onClose} open={open} size="60%">
        <DrawerTab activeKey={activeTab} onChange={key => setActiveTab(key)} items={tabItems} />
      </StyledDrawer>
    </>
  )
}

export default SystemSettings
