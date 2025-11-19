import { HomeOutlined } from '@ant-design/icons'
// import LucideIcon, { type LucideIconType } from '@/components/lucide-icon'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentTheme } from '@/store/slice/system-info'
import { pushNavItemAction } from '@/store/slice/system-info.ts'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'

const LayoutContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: var(--color-surface);
  overflow: hidden;
  box-sizing: border-box;
`

const Sidebar = styled(motion.aside)`
  width: 256px;
  min-width: 256px;
  max-height: 100vh;
  background: var(--color-background);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
`

const BrandHeader = styled(motion.div)`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
`

const BrandTitle = styled(motion.h1)`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary);
  }
`

const MenuWrapper = styled(Menu)`
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  border: none;
  flex: 1;
`

const MainSection = styled(motion.section)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--color-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 10;
  min-height: 64px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    min-height: 56px;
  }
`

const HomeIconWrapper = styled(motion.div)`
  display: inline-flex;
  align-items: center;
`

const HomeLink = styled(Link)`
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: var(--color-primary);
  }
`

const MainContent = styled(motion.main)`
  background: var(--color-surface);
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
`

const ContentWrapper = styled(motion.div)`
  opacity: 0;
  animation: fadeIn 0.4s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`

const menuItenWithIcon = (menu: MenuItem[]): MenuItem[] => {
  return menu.map(item => {
    const tempMenu: MenuItem = {
      key: item.url,
      label: item.title,
      title: item.title,
      // icon: <LucideIcon name={item.icon as LucideIconType} />,
    }

    if (item.children) {
      tempMenu.children = menuItenWithIcon(item.children)
    }
    return tempMenu
  })
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
}

/** * 常规菜单 */
function CommonMenu() {
  const navigate = useCustomNavigate()
  const dispatch = useAppDispatch()
  const menus = menuItenWithIcon(useAppSelector(state => state.menu))
  const currentTheme = useAppSelector(selectCurrentTheme)
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState([''])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const showNavigationBar = useAppSelector(state => state.systemInfo.showNavigationBar)

  // 找到当前选中项和需要展开的项
  const findSelectedAndOpenKeys = (items: MenuItem[], currentPath: string) => {
    let selectedKey = ''

    const findKeys = (items: MenuItem[]): string[] | undefined => {
      for (let i = 0, l = items.length; i < l; i++) {
        if (items[i].key === currentPath) {
          selectedKey = items[i].key
          return [items[i].key] // Ensure it returns an array
        }

        if (items[i].children) {
          const tempResult = findKeys(items[i].children)
          if (tempResult) {
            const tempOpenKey = [items[i].key]
            tempOpenKey.push(...tempResult) // Spread the result into the array
            return tempOpenKey
          }
        }
      }
    }

    const openKeys = findKeys(items) || [] // Default to an empty array if undefined

    return { selectedKey, openKeys }
  }

  useEffect(() => {
    const result = findSelectedAndOpenKeys(menus, location.pathname)
    setSelectedKey([result.selectedKey])
    setOpenKeys(result.openKeys as string[])
  }, [location])

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key)

    dispatch(
      pushNavItemAction({
        key: e.key,
        // @ts-ignore
        label: e.item.props.title,
        active: true,
        fixed: false,
      }),
    )
  }

  return (
    <LayoutContainer initial="hidden" animate="show" variants={containerVariants}>
      <Sidebar variants={itemVariants}>
        <BrandHeader variants={itemVariants}>
          <BrandTitle whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            RQ Admin
          </BrandTitle>
        </BrandHeader>

        <MenuWrapper
          onClick={onClick}
          selectedKeys={selectedKey}
          openKeys={openKeys}
          onOpenChange={keys => setOpenKeys(keys)}
          mode="inline"
          items={menus}
          theme={currentTheme.isDark ? 'dark' : 'light'}
        />
      </Sidebar>

      <MainSection variants={itemVariants}>
        <Header variants={itemVariants}>
          <HomeIconWrapper whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <HomeLink to="/dashboard">
              <HomeOutlined />
            </HomeLink>
          </HomeIconWrapper>

          <HeaderOperate />
        </Header>

        {showNavigationBar && <NavigationBar />}

        <MainContent
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            delay: 0.2,
          }}
        >
          <ContentWrapper
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </ContentWrapper>
        </MainContent>
      </MainSection>
    </LayoutContainer>
  )
}

export default CommonMenu
