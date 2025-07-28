import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import slices
import authReducer from './slices/authSlice';
import dataSourcesReducer from './slices/dataSourcesSlice';
import uiReducer from './slices/uiSlice';
import realtimeReducer from './slices/realtimeSlice';

// Import middleware
import { apiMiddleware } from './middleware/apiMiddleware';
import { websocketMiddleware } from './middleware/websocketMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  dataSources: dataSourcesReducer,
  ui: uiReducer,
  realtime: realtimeReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
  blacklist: ['realtime', 'dataSources'], // Don't persist real-time data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      apiMiddleware,
      websocketMiddleware,
      process.env.NODE_ENV === 'development' ? loggerMiddleware : []
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;