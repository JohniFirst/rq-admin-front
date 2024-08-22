export enum ForageEnums {
  // 应用内的历史记录
  APP_HISTORY = 'APP_HISTORY',
  // 系统信息
  SYSTEM_INFO = 'SYSTEM_INFO',
}

export enum LocalStorageKeys {
  // 布局模式
  LAYOUT_MODE = 'LAYOUT_MODE',
}

export enum IsLogin {
  YES,
  NO,
}

export enum SessionStorageKeys {
  // 语言
  IS_LOGIN,
}

export type ForageKeys = keyof typeof ForageEnums
