import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '@/config/env'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth/`,
    prepareHeaders: (headers, { getState }) => {
      headers.set('Accept', 'application/json')
      const token = getState()?.auth?.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: 'forget-password',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation({
      query: (body = {}) => ({
        url: 'logout',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useForgetPasswordMutation,
  useLogoutMutation,
} = authApi
