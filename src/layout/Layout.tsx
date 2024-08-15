import { useAppSelector } from '@/store/hooks'
import { MenuModeEnum } from '@/enums/system'
import CommonMenu from './common-menu'
import HeaderMenu from './header-menu'
import DrawerMenu from './drawer-menu'

/**
 * 布局组件
 */
function Layout() {
  const menuMode = useAppSelector((state) => state.systemInfo.menuMode)

  switch (menuMode) {
    case MenuModeEnum.COMMON_MENU:
      return <CommonMenu />

    case MenuModeEnum.HEADER_MENU:
      return <HeaderMenu />

    default:
      return <DrawerMenu />
  }
}

export default Layout
