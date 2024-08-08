import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type NavItem = {
  key: string;
  label: string;
  fixed: boolean;
  active: boolean;
};

type SystemInfo = {
  navItem: NavItem[];
  // menu: MenuItem[];
};

// 使用该类型定义初始 state
const initialState: SystemInfo = {
  navItem: [],
};

export const systemInfoSlice = createSlice({
  name: "systemInfo",
  initialState,
  reducers: {
    /** 更改当前的导航菜单 */
    setNavItemAction: (state, action: PayloadAction<NavItem[]>) => {
      state.navItem = action.payload;
    },
    pushNavItemAction: (state, action: PayloadAction<NavItem>) => {
      // console.log(state.navItem, 'redux')
      if (!state.navItem.some((item) => item.key === action.payload.key)) {
        state.navItem.push(action.payload);
      }
    },
  },
});

export const { setNavItemAction, pushNavItemAction } = systemInfoSlice.actions;

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const navItem = (state: RootState) => state.systemInfo.navItem;

export default systemInfoSlice.reducer;
