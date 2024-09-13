type Theme = 'light' | 'dark'

type NavItem = {
	key: string
	label: string
	fixed: boolean
	active: boolean
}

type LayoutMode = 'common-menu' | 'drawer-menu' | 'header-menu'

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
