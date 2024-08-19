import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

const initialState: MenuItem[] = []

export const menuSlice: Slice<MenuItem[]> = createSlice({
  name: 'router',
  initialState,
  reducers: {
    updateMenu(state, action: PayloadAction<MenuItem>) {
      if (!state.length) {
        state.push(...action.payload)
      }
    },
    resetMenu(state) {
      state.splice(0, state.length)
    },
  },
})

export const { updateMenu, resetMenu } = menuSlice.actions

export default menuSlice.reducer
