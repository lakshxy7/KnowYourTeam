import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';


import directoryReducer from './slices/directorySlice';
import teamReducer from './slices/teamSlice'; 

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['directory', 'team'], 
};

const rootReducer = combineReducers({
  directory: directoryReducer,
  team: teamReducer, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;