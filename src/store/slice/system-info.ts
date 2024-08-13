import { createSlice, Slice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store.ts";
import { forage } from "@/utils/localforage.ts";
import { ForageEnums } from "@/enums/localforage.ts";

// 定义一个异步函数来获取初始数据
const fetchInitialData = async () => {
  const res = await forage.getItem<string>(ForageEnums.NAVIGATION);
  const navItem = JSON.parse(res) as NavItem[];

  const theme = await forage.getItem<Theme>(ForageEnums.THEME);
  // 更新html的类来改变主题
  document.documentElement.className = theme;

  return {
    navItem,
    theme: theme || "light",
  };
};

// 使用该异步函数获取初始 state
const initialState = await fetchInitialData();

export const systemInfoSlice: Slice<SystemInfo> = createSlice({
  name: "systemInfo",
  initialState,
  reducers: {
    /**
     * Sets the current navigation items in the system.
     *
     * @param {SystemInfo} state - The current state of the system.
     * @param {PayloadAction<NavItem[]>} action - The action containing the new navigation items.
     */
    setNavItemAction: (state, action: PayloadAction<NavItem[]>) => {
      state.navItem = action.payload;
      forage.setItem(ForageEnums.NAVIGATION, state.navItem);
    },
    /**
     * Adds a new navigation item to the system's navigation bar if it does not already exist.
     *
     * @param {SystemInfo} state - The current state of the system.
     * @param {PayloadAction<NavItem>} action - The action containing the new navigation item.
     */
    pushNavItemAction: (state, action: PayloadAction<NavItem>) => {
      if (!state.navItem.some((item) => item.key === action.payload.key)) {
        state.navItem.push(action.payload);
        forage.setItem(ForageEnums.NAVIGATION, state.navItem);
      }
    },
    /**
     * Sets the current theme of the system.
     *
     * @param {SystemInfo} state - The current state of the system.
     * @param {PayloadAction<Theme>} action - The action containing the new theme.
     */
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      document.documentElement.className = state.theme;
      forage.setItem(ForageEnums.THEME, state.theme);
    },
  },
});

export const { setNavItemAction, pushNavItemAction, setTheme } =
  systemInfoSlice.actions;

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const navItem = (state: RootState) => state.systemInfo.navItem;

export default systemInfoSlice.reducer;
