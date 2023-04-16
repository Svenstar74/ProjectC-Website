import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import dataReducer from './slices/dataSlice';
import graphReducer from './slices/graphSlice';
import toolReducer from './slices/toolSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    graph: graphReducer,
    tool: toolReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
