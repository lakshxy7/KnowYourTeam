import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Slices
import directoryReducer from './slices/directorySlice';
import teamReducer from './slices/teamSlice';
import projectsReducer from './slices/projectSlice'; 

// 1. Combine Reducers FIRST
const rootReducer = combineReducers({
  directory: directoryReducer,
  team: teamReducer,
  projects: projectsReducer, 
});

// 2. Configure Persistence
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['directory', 'team', 'projects'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// 🔴 FIX: Infer RootState from rootReducer, NOT store.getState
export type RootState = ReturnType<typeof rootReducer>; 
export type AppDispatch = typeof store.dispatch;