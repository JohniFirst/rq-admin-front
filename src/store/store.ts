import { configureStore } from "@reduxjs/toolkit";
import systemInfoSlice from "./slice/system-info.ts";
import routerSlice from "./slice/router-slice.ts";

const store = configureStore({
  reducer: {
    systemInfo: systemInfoSlice,
    router: routerSlice,
  },
});

// 从 store 本身推断 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
