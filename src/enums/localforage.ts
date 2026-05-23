export enum ForageEnums {
  // 应用内的历史记录
  APP_HISTORY = 'APP_HISTORY',
  // 系统信息
  SYSTEM_INFO = 'SYSTEM_INFO',
  // 抽屉菜单显示隐藏
  DRAWER_MENU_VISIBLE = 'DRAWER_MENU_VISIBLE',
  // 表单数据
  SETP1_FORM_DATA = 'SETP1_FORM_DATA',
  // token
  TOKEN = 'TOKEN',
}

export enum LocalStorageKeys {
  // 布局模式
  LAYOUT_MODE = 'rq-admin-layout-mode',
  // 主题模式
  THEME_MODE = 'rq-admin-theme-mode',
  // 自动主题配置
  AUTO_THEME_CONFIG = 'rq-admin-auto-theme-config',
}

export enum IsLogin {
  YES = 0,
  NO = 1,
}

export enum SessionStorageKeys {
  // 语言
  IS_LOGIN = 0,
}

export type ForageKeys = keyof typeof ForageEnums
