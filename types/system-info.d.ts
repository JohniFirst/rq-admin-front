type Theme = "light" | "dark";

type NavItem = {
  key: string;
  label: string;
  fixed: boolean;
  active: boolean;
};

type SystemInfo = {
  // 系统导航栏
  navItem: NavItem[];
  // 系统主题 浅色/深色
  theme: Theme;
};

type RouterState = {
  router: RouteObject[];
};
