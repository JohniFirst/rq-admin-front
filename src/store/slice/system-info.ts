import { presetThemes } from '@/config/preset-themes'
import { ForageEnums, LocalStorageKeys } from '@/enums/localforage.ts'
import { LayoutModeEnum } from '@/enums/system'
import { forage } from '@/utils/localforage.ts'
import { type PayloadAction, type Slice, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store.ts'

type LocalSystemInfo = {
	theme?: string
}

type SystemInfoState = {
	layoutMode: LayoutModeEnum
	theme: string
	customThemes: ThemeConfig[]
	navItem: NavItem[]
}

// 定义一个异步函数来获取初始数据
export const fetchInitialData = async () => {
	const res = await forage.getItem<string>(ForageEnums.APP_HISTORY)
	const navItem = (JSON.parse(res || '[]') as NavItem[]) || []

	const SYSTEM_INFO = await forage.getItem<string>(ForageEnums.SYSTEM_INFO)
	const localSystemInfo = JSON.parse(SYSTEM_INFO || '{}') as LocalSystemInfo
	// 更新html的类来改变主题
	const theme = localSystemInfo?.theme || 'default-light'
	document.documentElement.className = theme
	const layoutMode = localStorage.getItem(
		LocalStorageKeys.LAYOUT_MODE,
	) as LayoutModeEnum

	return {
		layoutMode: layoutMode ?? LayoutModeEnum.COMMON_MENU,
		theme,
		customThemes: [],
		navItem,
	} satisfies SystemInfoState
}

const initialState: SystemInfoState = {
	layoutMode: LayoutModeEnum.COMMON_MENU,
	theme: 'default-light',
	customThemes: [],
	navItem: [],
}

export const systemInfoSlice = createSlice({
	name: 'systemInfo',
	initialState,
	reducers: {
		initSystemInfoState: (_state, action: PayloadAction<SystemInfoState>) => {
			return { ...action.payload }
		},
		/**
		 * Sets the current navigation items in the system.
		 *
		 * @param {SystemInfoState} state - The current state of the system.
		 * @param {PayloadAction<NavItem[]>} action - The action containing the new navigation items.
		 */
		setNavItemAction: (state, action: PayloadAction<NavItem[]>) => {
			state.navItem = action.payload
			forage.setItem(ForageEnums.APP_HISTORY, JSON.stringify(state.navItem))
		},
		/**
		 * Adds a new navigation item to the system's navigation bar if it does not already exist.
		 *
		 * @param {SystemInfoState} state - The current state of the system.
		 * @param {PayloadAction<NavItem>} action - The action containing the new navigation item.
		 */
		pushNavItemAction: (state, action: PayloadAction<NavItem>) => {
			if (!state.navItem.some((item) => item.key === action.payload.key)) {
				state.navItem.push(action.payload)
				forage.setItem(ForageEnums.APP_HISTORY, JSON.stringify(state.navItem))
			}
		},
		/**
		 * Sets the current theme of the system.
		 *
		 * @param {SystemInfoState} state - The current state of the system.
		 * @param {PayloadAction<string>} action - The action containing the new theme.
		 */
		setTheme: (state, action: PayloadAction<string>) => {
			state.theme = action.payload
			document.documentElement.className = state.theme
			const copyState = JSON.parse(
				JSON.stringify(state),
			) as Partial<SystemInfoState>
			delete copyState.navItem
			forage.setItem(ForageEnums.SYSTEM_INFO, JSON.stringify(copyState))
		},
		/**
		 * Sets the current menu mode of the system.
		 *
		 * @param {SystemInfoState} state - The current state of the system.
		 * @param {PayloadAction<LayoutModeEnum>} action - The action containing the new menu mode.
		 */
		setlayoutMode: (state, action: PayloadAction<LayoutModeEnum>) => {
			state.layoutMode = action.payload
		},
		addCustomTheme: (state, action: PayloadAction<ThemeConfig>) => {
			state.customThemes.push(action.payload)
		},
		updateCustomTheme: (state, action: PayloadAction<ThemeConfig>) => {
			const index = state.customThemes.findIndex(
				(theme) => theme.id === action.payload.id,
			)
			if (index !== -1) {
				state.customThemes[index] = action.payload
			}
		},
		deleteCustomTheme: (state, action: PayloadAction<string>) => {
			state.customThemes = state.customThemes.filter(
				(theme) => theme.id !== action.payload,
			)
			if (state.theme === action.payload) {
				state.theme = 'default-light'
			}
		},
		importCustomThemes: (state, action: PayloadAction<ThemeConfig[]>) => {
			state.customThemes = [...state.customThemes, ...action.payload]
		},
	},
}) as Slice<SystemInfoState>

export const {
	setNavItemAction,
	pushNavItemAction,
	setTheme,
	setlayoutMode,
	initSystemInfoState,
	addCustomTheme,
	updateCustomTheme,
	deleteCustomTheme,
	importCustomThemes,
} = systemInfoSlice.actions

// selectors 等其他代码可以使用导入的 `RootState` 类型
export const navItem = (state: RootState) => state.systemInfo.navItem

export const selectCurrentTheme = (state: RootState): ThemeConfig => {
	const { theme, customThemes } = state.systemInfo
	return (
		customThemes.find((t) => t.id === theme) ||
		presetThemes.find((t) => t.id === theme) ||
		presetThemes.find((t) => t.id === 'default-light')!
	)
}

export default systemInfoSlice.reducer
