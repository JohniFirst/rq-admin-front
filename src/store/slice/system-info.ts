import { createSlice, Slice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store.ts'
import { forage } from '@/utils/localforage.ts'
import { ForageEnums, LocalStorageKeys } from '@/enums/localforage.ts'
import { LayoutModeEnum } from '@/enums/system.ts'

// 定义一个异步函数来获取初始数据
export const fetchInitialData = async () => {
  const res = await forage.getItem<string>(ForageEnums.APP_HISTORY)
  const navItem = (JSON.parse(res) as NavItem[]) || []

  const SYSTEM_INFO = await forage.getItem<string>(ForageEnums.SYSTEM_INFO)
  const localSystemInfo = JSON.parse(SYSTEM_INFO) as LocalSystemInfo
  // 更新html的类来改变主题
  document.documentElement.className = localSystemInfo?.theme
  const layoutMode = localStorage.getItem(LocalStorageKeys.LAYOUT_MODE)

  return {
    navItem,
    theme: localSystemInfo?.theme || 'light',
    layoutMode: layoutMode ?? LayoutModeEnum.COMMON_MENU,
  }
}

// 妥协解决方案
const initialState: SystemInfo = {
  theme: 'light',
  navItem: [],
  layoutMode: LayoutModeEnum.COMMON_MENU,
}

export const systemInfoSlice: Slice<SystemInfo> = createSlice({
  name: 'systemInfo',
  initialState,
  reducers: {
    initSystemInfoState: (state, action: PayloadAction<SystemInfo>) => {
      Object.keys(action.payload).forEach((key) => {
        // @ts-ignore
        state[key] = action.payload[key]
      })
    },
    /**
     * Sets the current navigation items in the system.
     *
     * @param {SystemInfo} state - The current state of the system.
     * @param {PayloadAction<NavItem[]>} action - The action containing the new navigation items.
     */
    setNavItemAction: (state, action: PayloadAction<NavItem[]>) => {
      state.navItem = action.payload
      forage.setItem(ForageEnums.APP_HISTORY, state.navItem)
    },
    /**
     * Adds a new navigation item to the system's navigation bar if it does not already exist.
     *
     * @param {SystemInfo} state - The current state of the system.
     * @param {PayloadAction<NavItem>} action - The action containing the new navigation item.
     */
    pushNavItemAction: (state, action: PayloadAction<NavItem>) => {
      if (!state.navItem.some((item) => item.key === action.payload.key)) {
        state.navItem.push(action.payload)
        forage.setItem(ForageEnums.APP_HISTORY, state.navItem)
      }
    },
    /**
     * Sets the current theme of the system.
     *
     * @param {SystemInfo} state - The current state of the system.
     * @param {PayloadAction<Theme>} action - The action containing the new theme.
     */
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      document.documentElement.className = state.theme
      const copyState = JSON.parse(JSON.stringify(state))
      delete copyState.navItem
      forage.setItem(ForageEnums.SYSTEM_INFO, copyState)
    },
    /**
     * Sets the current menu mode of the system.
     *
     * @param {SystemInfo} state - The current state of the system.
     * @param {PayloadAction<LayoutMode>} action - The action containing the new menu mode.
     */
    setlayoutMode: (state, action: PayloadAction<LayoutMode>) => {
      // 设置的菜单模式和当前的菜单模式相同则不更新
      if (state.layoutMode === action.payload) {
        return
      }

      state.layoutMode = action.payload
      const copyState = JSON.parse(JSON.stringify(state))
      delete copyState.navItem
      forage.setItem(ForageEnums.SYSTEM_INFO, copyState)
    },
  },
})

export const {
  setNavItemAction,
  pushNavItemAction,
  setTheme,
  setlayoutMode,
  initSystemInfoState,
} = systemInfoSlice.actions

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const navItem = (state: RootState) => state.systemInfo.navItem

export default systemInfoSlice.reducer
