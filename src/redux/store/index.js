import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import { authApi } from '@/redux/apis/Auth'
import { baseApi } from '@/redux/apis/Base'
import { encryptedLocalStorage } from '@/helpers/storage'
import authReducer from '@/redux/slices/auth.slice'
import '@/redux/apis/User'
import '@/redux/apis/BusinessCategory'
import '@/redux/apis/Feedback'

const persist_config = {
  key: 'jamatconnect-admin',
  storage: encryptedLocalStorage,
  whitelist: ['auth'],
}

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

export const store = configureStore({
  reducer: persistReducer(persist_config, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(baseApi.middleware),
})

export const persistor = persistStore(store)
