import { SettingOutlined } from '@ant-design/icons'
import { Drawer, Switch } from 'antd'
import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { CommonMenu, DrawerMenu, TopMenu } from '@/assets/svgs/nav-type/system-svgs'
import { LayoutModeEnum } from '@/enums/system'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setlayoutMode, setShowNavigationBar, setTheme } from '@/store/slice/system-info'
import ThemeConfig from './theme-config'

const layoutModeArr = [
  {
    imgSrc: CommonMenu,
    title: '常规菜单',
    value: LayoutModeEnum.COMMON_MENU,
  },
  {
    imgSrc: DrawerMenu,
    title: '可折叠的子菜单',
    value: LayoutModeEnum.DRAWER_MENU,
  },
  {
    imgSrc: TopMenu,
    title: '顶部导航菜单',
    value: LayoutModeEnum.HEADER_MENU,
  },
]

// Styled Components
const FloatingButton = styled(motion.div)<{ $isDark: boolean }>`
  position: fixed;
  z-index: 1000;
  cursor: grab;
  touch-action: none;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  background: ${props =>
    props.$isDark
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }

  &:active {
    cursor: grabbing;
  }

  .setting-icon {
    font-size: 24px;
    color: white;
    transition: all 0.3s ease;
  }

  &:hover .setting-icon {
    transform: rotate(90deg);
  }
`

const StyledDrawer = styled(Drawer)<{ $isDark: boolean }>`
  .ant-drawer-content {
    background: ${props => (props.$isDark ? 'var(--color-surface)' : 'var(--color-background)')};
    border-left: 1px solid var(--color-border);
  }

  .ant-drawer-header {
    background: ${props => (props.$isDark ? 'var(--color-surface)' : 'var(--color-background)')};
    border-bottom: 1px solid var(--color-border);
  }

  .ant-drawer-title {
    color: var(--color-text);
  }

  .ant-drawer-close {
    color: var(--color-text);
  }

  .ant-drawer-body {
    background: ${props => (props.$isDark ? 'var(--color-surface)' : 'var(--color-background)')};
    color: var(--color-text);
  }
`

const Section = styled.section`
  margin-bottom: 32px;
`

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
`

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`

const LayoutItem = styled.div<{ $isSelected: boolean; $isDark: boolean }>`
  position: relative;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props =>
    props.$isSelected
      ? 'var(--color-primary)'
      : props.$isDark
        ? 'var(--color-surface)'
        : 'var(--color-surface)'};
  border: 2px solid ${props => (props.$isSelected ? 'var(--color-primary)' : 'transparent')};

  &:hover {
    background: ${props =>
      props.$isSelected ? 'var(--color-primary)' : 'var(--color-surface-hover)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .layout-title {
    text-align: center;
    font-size: 14px;
    margin-top: 8px;
    color: ${props => (props.$isSelected ? 'white' : 'var(--color-text-secondary)')};
  }

  .selected-indicator {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    background: var(--color-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .selected-dot {
    width: 8px;
    height: 8px;
    background: var(--color-background);
    border-radius: 50%;
  }
`

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SettingItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  background: ${props => (props.$isDark ? 'var(--color-surface)' : 'var(--color-surface)')};
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }

  .setting-label {
    color: var(--color-text-secondary);
    font-size: 14px;
  }
`

const SystemSettings: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(window.innerWidth - 80)
  const y = useMotionValue(window.innerHeight / 2)

  const layoutMode = useAppSelector(state => state.systemInfo.layoutMode)
  const currentTheme = useAppSelector(state => state.systemInfo.theme)
  const showNavigationBar = useAppSelector(state => state.systemInfo.showNavigationBar)
  const dispatch = useAppDispatch()

  const isDark = typeof currentTheme === 'string' ? currentTheme === 'dark' : false

  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - 50
      const maxY = window.innerHeight - 50
      const currentX = x.get()
      const currentY = y.get()

      if (currentX > maxX) x.set(maxX)
      if (currentY > maxY) y.set(maxY)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [x, y])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    const currentX = x.get()
    const windowWidth = window.innerWidth
    const targetX = currentX < windowWidth / 2 ? 16 : windowWidth - 66

    animate(x, targetX, {
      type: 'spring',
      duration: 0.2,
      bounce: 0,
    })

    setTimeout(() => setIsDragging(false), 0)
  }

  const showDrawer = () => {
    if (!isDragging) {
      setOpen(true)
    }
  }

  const onClose = () => {
    setOpen(false)
  }

  const handleLayoutChange = (newLayout: LayoutModeEnum) => {
    if (layoutMode !== newLayout) {
      dispatch(setlayoutMode(newLayout))
    }
  }

  const handleThemeChange = (themeId: string) => {
    dispatch(setTheme(themeId))
  }

  return (
    <>
      <FloatingButton
        $isDark={isDark}
        style={{
          x,
          y,
        }}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragTransition={{
          power: 0,
          timeConstant: 0,
          modifyTarget: target => target,
        }}
        dragConstraints={{
          left: 16,
          right: window.innerWidth - 66,
          top: 16,
          bottom: window.innerHeight - 66,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: isDragging ? 1 : 1.1 }}
        whileDrag={{ scale: 1.1 }}
      >
        <SettingOutlined className="setting-icon" onClick={showDrawer} />
      </FloatingButton>

      <StyledDrawer
        $isDark={isDark}
        title={
          <h3 style={{ color: 'var(--color-text)', fontSize: '18px', fontWeight: 600 }}>
            系统设置
          </h3>
        }
        placement="right"
        onClose={onClose}
        open={open}
        maskClosable={true}
        width={720}
        styles={{
          body: {
            padding: '24px',
          },
        }}
      >
        <div>
          <Section>
            <SectionTitle>主题配置</SectionTitle>
            <ThemeConfig currentTheme={currentTheme} onThemeChange={handleThemeChange} />
          </Section>

          <Section>
            <SectionTitle>导航菜单布局</SectionTitle>
            <LayoutGrid>
              {layoutModeArr.map(item => (
                <LayoutItem
                  key={item.value}
                  $isSelected={layoutMode === item.value}
                  $isDark={isDark}
                  onClick={() => handleLayoutChange(item.value)}
                >
                  {item.imgSrc}
                  <p className="layout-title">{item.title}</p>
                  {layoutMode === item.value && (
                    <div className="selected-indicator">
                      <div className="selected-dot" />
                    </div>
                  )}
                </LayoutItem>
              ))}
            </LayoutGrid>
          </Section>

          <Section>
            <SectionTitle>其他设置</SectionTitle>
            <SettingsList>
              <SettingItem $isDark={isDark}>
                <span className="setting-label">显示应用内导航组件</span>
                <Switch
                  checked={showNavigationBar}
                  onChange={checked => dispatch(setShowNavigationBar(checked))}
                />
              </SettingItem>
              <SettingItem $isDark={isDark}>
                <span className="setting-label">开启页面动画</span>
                <Switch defaultChecked />
              </SettingItem>
              <SettingItem $isDark={isDark}>
                <span className="setting-label">显示页面切换进度条</span>
                <Switch defaultChecked />
              </SettingItem>
            </SettingsList>
          </Section>
        </div>
      </StyledDrawer>
    </>
  )
}

export default SystemSettings
