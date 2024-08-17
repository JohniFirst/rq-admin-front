import { useAppSelector } from '@/store/hooks'
import CommonMenu from './common-menu'
import HeaderMenu from './header-menu'
import DrawerMenu from './drawer-menu'

/**
 * 布局组件
 */
function Layout() {
  const layoutMode = useAppSelector((state) => state.systemInfo.layoutMode)

  switch (layoutMode) {
    case LayoutModeEnum.COMMON_MENU:
      return <CommonMenu />

    case LayoutModeEnum.HEADER_MENU:
      return <HeaderMenu />

    default:
      return <DrawerMenu />
  }
}

export default Layout
