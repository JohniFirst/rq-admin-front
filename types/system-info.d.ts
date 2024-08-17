type Theme = 'light' | 'dark'

enum ContextMenuKey {
  CLOSE_LEFT = 'close-left',
  CLOSE_RIGHT = 'close-right',
  CLOSE_OTHERS = 'close-others',
  FIXED = 'fixed',
  OPEN_NEW = 'open-new',
}

enum LayoutModeEnum {
  COMMON_MENU = 'common-menu',
  DRAWER_MENU = 'drawer-menu',
  HEADER_MENU = 'header-menu',
}

type NavItem = {
  key: string
  label: string
  fixed: boolean
  active: boolean
}

type LayoutMode = (typeof LayoutModeEnum)[keyof typeof LayoutModeEnum]

type LocalSystemInfo = {
  // 系统主题 浅色/深色
  theme: Theme
  // 导航菜单模式
  layoutMode: LayoutMode
}

type SystemInfo = LocalSystemInfo & {
  // 系统导航栏
  navItem: NavItem[]
}

type RouterState = {
  router: RouteObject[]
}

type MenuItem = Required<MenuProps>['items'][number]
