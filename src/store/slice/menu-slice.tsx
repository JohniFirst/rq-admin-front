import { type PayloadAction, type Slice, createSlice } from '@reduxjs/toolkit'

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

export const menuSlice: Slice<MenuItem[]> = createSlice({
	name: 'router',
	initialState,
	reducers: {
		updateMenu(state, action: PayloadAction<MenuItem>) {
			if (!state.length) {
				sortMenu(action.payload)
				state.push(...action.payload)
			}
		},
		resetMenu(state) {
			state.splice(0, state.length)
		},
	},
})

export const { updateMenu, resetMenu } = menuSlice.actions
