import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'
import type { RouteObject } from 'react-router-dom'

const initialState: RouterState = {
  router: []
}

export const routerSlice: Slice<RouterState> = createSlice({
  name: 'router',
  initialState,
  reducers: {
    addRoutes(state, action: PayloadAction<RouteObject>) {
      state.router.splice(-1, 0, action.payload)
    }
  }
})

export const { addRoutes } = routerSlice.actions

export default routerSlice.reducer
