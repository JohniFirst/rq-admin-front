import { createSlice, type PayloadAction, type Slice } from '@reduxjs/toolkit'

const initialState: MenuItem[] = []

/** 对菜单进行排序 */
export function sortMenu(menuList: MenuApiResponse[]) {
	menuList.sort((a, b) => {
		if (a.children) {
			return sortMenu(a.children) as unknown as number
		}

		return a.menuOrder - b.menuOrder
	})
}

// 递归将 title 转 label
function convertMenuTitleToLabel(menuList: any[]): any[] {
	return menuList.map((item: any) => {
		const { menuOrder, ...rest } = item
		const newItem: any = { ...rest, label: item.title, key: item.url }
		// 如果 icon 不是合法 React 元素，则去掉 icon 字段
		if (typeof newItem.icon === 'string') {
			delete newItem.icon
		}
		if (item.children && Array.isArray(item.children)) {
			newItem.children = convertMenuTitleToLabel(item.children)
		}
		return newItem
	})
}

export const menuSlice: Slice<MenuItem[]> = createSlice({
	name: 'router',
	initialState,
	reducers: {
		updateMenu(state, action: PayloadAction<MenuItem[]>) {
			if (!state.length) {
				sortMenu(action.payload)
				const converted = convertMenuTitleToLabel(action.payload)
				state.push(...converted)
			}
		},
		resetMenu(state) {
			state.splice(0, state.length)
		},
	},
})

export const { updateMenu, resetMenu } = menuSlice.actions
