type LoginFormValues = {
  username: string
  password: string
}

type RegisterFormValues = LoginFormValues & {
  // email: string
}

type DefaultPagination<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
}

type UserListRes = {
  id: number
  isEnabled: 0 | 1
}

type SelectOptions = {
  label: string
  value: string | number
}

type RoleListRes = {
  id: number
  roleName: string
}

type MenuApiWithoutRoleResponse = {
  id: number
  menuOrder: number
  title: string
  url: string
  icon: string
  parent?: number
  children?: MenuApiResponse[]
}

type MenuApiResponse = MenuApiWithoutRoleResponse & {
  roles: RoleListRes[]
}

type Theme = 'light' | 'dark'

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
