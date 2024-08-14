type Theme = "light" | "dark";

type NavItem = {
  key: string;
  label: string;
  fixed: boolean;
  active: boolean;
};

type MenuMode = "common-menu" | "drawer-menu" | "header-menu";

type LocalSystemInfo = {
  // 系统主题 浅色/深色
  theme: Theme;
  // 导航菜单模式
  menuMode: MenuMode;
};

type SystemInfo = LocalSystemInfo & {
  // 系统导航栏
  navItem: NavItem[];
};

type RouterState = {
  router: RouteObject[];
};

type MenuItem = Required<MenuProps>["items"][number];

type MenuSlice = {
  menu: MenuItem[];
};
