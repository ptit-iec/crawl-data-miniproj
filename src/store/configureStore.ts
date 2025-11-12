import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

// Configure Redux store
export const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;