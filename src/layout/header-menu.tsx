import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { pushNavItemAction } from '@/store/slice/system-info.ts'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'

const LayoutContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  box-sizing: border-box;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  gap: 1rem;
  flex-wrap: nowrap;
  min-height: 64px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: 56px;
    flex-wrap: wrap;
  }
`

const MenuWrapper = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 2px;
  }
`

const MainContent = styled.main`
  background: var(--color-surface);
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`

/**
 * 顶部导航菜单
 */
function HeaderMenu() {
  const navigate = useCustomNavigate()
  const dispatch = useAppDispatch()
  const menusRaw = useAppSelector(state => state.menu)
  const menus: MenuItem[] = Array.isArray(menusRaw) ? menusRaw : []
  const showNavigationBar = useAppSelector(state => state.systemInfo.showNavigationBar)

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

  const location = useLocation()

  // 找到当前选中项和需要展开的项
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

  const [selectedKey, setSelectedKey] = useState<string[]>([])

  useEffect(() => {
    const result = findSelectedAndOpenKeys(menus, location.pathname)
    if (result.selectedKey) {
      setSelectedKey([result.selectedKey])
    } else {
      setSelectedKey([])
    }
  }, [location.pathname, menus])

  return (
    <LayoutContainer>
      <Header>
        <MenuWrapper>
          <Menu mode="horizontal" onClick={onClick} selectedKeys={selectedKey} items={menus} />
        </MenuWrapper>

        <HeaderOperate />
      </Header>

      {showNavigationBar && <NavigationBar />}

      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  )
}

export default HeaderMenu
