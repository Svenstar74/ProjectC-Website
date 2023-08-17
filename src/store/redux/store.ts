import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import graphReducer from './slices/graphSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    graph: graphReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
