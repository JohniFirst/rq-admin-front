import { SettingOutlined } from '@ant-design/icons'
import { Drawer, Switch } from 'antd'
import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

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

const SystemSettings: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(window.innerWidth - 80)
  const y = useMotionValue(window.innerHeight / 2)

  const layoutMode = useAppSelector(state => state.systemInfo.layoutMode)
  const currentTheme = useAppSelector(state => state.systemInfo.theme)
  const showNavigationBar = useAppSelector(state => state.systemInfo.showNavigationBar)
  const dispatch = useAppDispatch()

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
      <motion.div
        style={{
          position: 'fixed',
          x,
          y,
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
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
        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-colors duration-200 hover:from-blue-600 hover:to-indigo-700 group"
        whileHover={{ scale: isDragging ? 1 : 1.1 }}
        whileDrag={{ scale: 1.1 }}
      >
        <SettingOutlined
          className="text-2xl text-white group-hover:rotate-90 transition-all duration-300"
          onClick={showDrawer}
        />
      </motion.div>

      <Drawer
        title={<h3 className="text-lg font-semibold text-text">系统设置</h3>}
        placement="right"
        onClose={onClose}
        open={open}
        className="settings-drawer"
        maskClosable={true}
        width={720}
        styles={{
          body: {
            padding: '24px',
          },
        }}
      >
        <div className="space-y-8">
          <section>
            <h4 className="text-base font-medium text-text-secondary mb-4">主题配置</h4>
            <ThemeConfig currentTheme={currentTheme} onThemeChange={handleThemeChange} />
          </section>

          <section>
            <h4 className="text-base font-medium text-text-secondary mb-4">导航菜单布局</h4>
            <div className="grid grid-cols-3 gap-4">
              {layoutModeArr.map(item => (
                <div
                  key={item.value}
                  className={`
										relative p-2 rounded-lg cursor-pointer transition-all duration-300
										${
                      layoutMode === item.value
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'bg-surface hover:bg-surface-hover'
                    }
									`}
                  onClick={() => handleLayoutChange(item.value)}
                  onKeyUp={() => handleLayoutChange(item.value)}
                >
                  {item.imgSrc}

                  <p className="text-center text-sm mt-2 text-text-secondary">{item.title}</p>
                  {layoutMode === item.value && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-background rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-base font-medium text-text-secondary mb-4">其他设置</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <span className="text-text-secondary">显示应用内导航组件</span>
                <Switch
                  checked={showNavigationBar}
                  onChange={checked => dispatch(setShowNavigationBar(checked))}
                  className="bg-surface-hover"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <span className="text-text-secondary">开启页面动画</span>
                <Switch defaultChecked className="bg-surface-hover" />
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <span className="text-text-secondary">显示页面切换进度条</span>
                <Switch defaultChecked className="bg-surface-hover" />
              </div>
            </div>
          </section>
        </div>
      </Drawer>
    </>
  )
}

export default SystemSettings
