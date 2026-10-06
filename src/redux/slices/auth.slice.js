import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '@/redux/apis/Auth'

const initialState = {
  user: null,
  token: null,
  is_authenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.is_authenticated = true
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.is_authenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.is_authenticated = true
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null
        state.token = null
        state.is_authenticated = false
      })
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
