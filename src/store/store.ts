import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './counterSlice';
import systemInfoSlice from './systemInfo';

const store = configureStore({
  reducer: {
    counter: counterSlice,
    systemInfo: systemInfoSlice
  },
});

// 从 store 本身推断 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store
