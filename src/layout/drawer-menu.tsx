import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ForageEnums } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppSelector } from '@/store/hooks'
import { forage } from '@/utils/localforage'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: var(--color-background);
  overflow: hidden;
  box-sizing: border-box;
`

const Sidebar = styled.aside`
  max-height: 100vh;
  display: flex;
  gap: 12px;
  padding: 16px;
`

const TopLevelMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-surface);
  padding: 12px 0;
  border-radius: 20px;
  user-select: none;
  min-width: 72px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`

const BaseTopLevelMenuItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 12px;
  margin: 4px 8px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 48px;
  justify-content: center;

  svg {
    font-size: 20px;
  }
`

const ActiveTopMenu = styled(BaseTopLevelMenuItem)`
  background: linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: #fff;
  box-shadow:
    0 8px 24px rgba(59, 130, 246, 0.35),
    0 2px 8px rgba(59, 130, 246, 0.2);

  svg {
    font-size: 20px;
  }
`

const TopLevelMenuItem = styled(BaseTopLevelMenuItem)`
  color: var(--color-text-secondary);
  background: transparent;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-primary);
  }
`

const TopMenuLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
`

const SubMenuList = styled.ul`
  width: 200px;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  background: var(--color-background);
  border-radius: 20px;
  padding: 12px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;

    &:hover {
      background: var(--color-border-hover);
    }
  }
`

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  margin: 2px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text-secondary);
  position: relative;

  svg {
    font-size: 16px;
    flex-shrink: 0;
  }

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
    padding-left: 20px;
  }

  &:active {
    transform: scale(0.98);
  }
`

const ActiveMenuItem = styled(MenuItem)`
  background: rgba(59, 130, 246, 0.08);
  color: var(--color-primary);
  font-weight: 500;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 40%;
    background: var(--color-primary);
    border-radius: 0 4px 4px 0;
  }
`

const SubMenuListInner = styled.ul`
  min-width: 180px;
  background: var(--color-background);
  border-radius: 16px;
  padding: 8px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
`

const MainSection = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  background: var(--color-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  min-height: 64px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: 56px;
  }
`

const ToggleButton = styled.button`
  font-size: 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-primary);
  }
`

const MainContent = styled.main`
  background: var(--color-surface);
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
`

function DrawerMenu() {
  const navigate = useCustomNavigate()
  const menusRaw = useAppSelector(state => state.menu)
  const menus: MenuItem[] = Array.isArray(menusRaw) ? menusRaw : []
  const showNavigationBar = useAppSelector(state => state.systemInfo.showNavigationBar)
  const [topActiveMenu, setTopActiveMenu] = useState<MenuItem>(menus[0])
  const [menuVisible, setMenuVisible] = useState(true)

  const location = useLocation()

  useEffect(() => {
    const findTopMenu = (items: MenuItem[], path: string): MenuItem | undefined => {
      for (const item of items) {
        if (item.key === path) return item
        if (Array.isArray(item.children)) {
          if (item.children.some((child: MenuItem) => child.key === path)) {
            return item
          }
          const found = findTopMenu(item.children, path)
          if (found) return found
        }
      }
      return undefined
    }
    const current = findTopMenu(menus, location.pathname)
    if (current) setTopActiveMenu(current)
  }, [location, menus])

  const findSelectedAndOpenKeys = (items: MenuItem[], currentPath: string) => {
    let selectedKey = ''
    const openKeys: string[] = []

    const findKeys = (items: MenuItem[] = []) => {
      for (const item of items) {
        if (!item) continue
        if ('children' in item && Array.isArray(item.children)) {
          if (item.children.some((child: MenuItem) => child && child.key === currentPath)) {
            selectedKey = currentPath
            if (item.key) openKeys.push(item.key as string)
          }
          findKeys(item.children)
        } else if (item.key === currentPath) {
          selectedKey = currentPath
        }
      }
    }

    findKeys(items)
    return { selectedKey, openKeys }
  }

  const [selectedKey, setSelectedKey] = useState([''])

  useEffect(() => {
    const result = findSelectedAndOpenKeys(menus, location.pathname)
    setSelectedKey([result.selectedKey])
  }, [location, menus])

  function RecursiveMenuItem({
    item,
    selectedKey,
    navigate,
  }: {
    item: MenuItem
    selectedKey: string[]
    navigate: (key: string) => void
  }) {
    const isActive = selectedKey.includes(item.key)
    const hasChildren = Array.isArray(item.children) && item.children.length > 0
    const content = hasChildren ? (
      <SubMenuListInner>
        {item.children.map((child: MenuItem) => (
          <RecursiveMenuItem
            key={child.key}
            item={child}
            selectedKey={selectedKey}
            navigate={navigate}
          />
        ))}
      </SubMenuListInner>
    ) : null

    const MenuItemComponent = isActive ? ActiveMenuItem : MenuItem

    const li = (
      <MenuItemComponent
        key={item.key}
        onClick={e => {
          e.stopPropagation()
          navigate(item.key)
        }}
      >
        {item.icon}
        <span style={{ fontSize: '14px', flex: 1 }}>{item.label}</span>
      </MenuItemComponent>
    )

    return hasChildren ? (
      <Popover placement="rightTop" content={content} trigger="hover">
        {li}
      </Popover>
    ) : (
      li
    )
  }

  useEffect(() => {
    forage.getItem<boolean>(ForageEnums.DRAWER_MENU_VISIBLE).then(v => {
      if (typeof v === 'boolean') setMenuVisible(v)
      if (typeof v === 'string') setMenuVisible(v === 'true')
    })
  }, [])

  useEffect(() => {
    forage.setItem(ForageEnums.DRAWER_MENU_VISIBLE, String(menuVisible))
  }, [menuVisible])

  return (
    <LayoutContainer>
      {menuVisible && (
        <Sidebar>
          <TopLevelMenu>
            {menus.map(item => {
              const isActive = topActiveMenu.key === item.key || selectedKey.includes(item.key)
              const handleClick = () => {
                setTopActiveMenu(item)
                if (item.key) {
                  navigate(item.key)
                }
              }
              return isActive ? (
                <ActiveTopMenu key={item.key} onClick={handleClick} onKeyUp={handleClick}>
                  {item.icon}
                  <TopMenuLabel>{item.label}</TopMenuLabel>
                </ActiveTopMenu>
              ) : (
                <TopLevelMenuItem key={item.key} onClick={handleClick} onKeyUp={handleClick}>
                  {item.icon}
                  <TopMenuLabel>{item.label}</TopMenuLabel>
                </TopLevelMenuItem>
              )
            })}
          </TopLevelMenu>

          {topActiveMenu.children ? (
            <SubMenuList>
              {topActiveMenu.children.map((item: MenuItem) => (
                <RecursiveMenuItem
                  key={item.key}
                  item={item}
                  selectedKey={selectedKey}
                  navigate={navigate}
                />
              ))}
            </SubMenuList>
          ) : null}
        </Sidebar>
      )}

      <MainSection>
        <Header>
          <ToggleButton type="button" onClick={() => setMenuVisible(v => !v)}>
            {menuVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </ToggleButton>
          <HeaderOperate />
        </Header>

        {showNavigationBar && <NavigationBar />}

        <MainContent>
          <Outlet />
        </MainContent>
      </MainSection>
    </LayoutContainer>
  )
}

export default DrawerMenu
