export enum ForageEnums {
  // 应用内的历史记录
  APP_HISTORY = "APP_HISTORY",
  // 系统信息
  SYSTEM_INFO = "SYSTEM_INFO",
}

export type ForageKeys = keyof typeof ForageEnums;
