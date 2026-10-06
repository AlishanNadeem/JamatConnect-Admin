import { baseApi } from '@/redux/apis/Base'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => '/user/my-profile',
      providesTags: ['Profile'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.data) {
            dispatch({ type: 'auth/setUser', payload: data.data })
          }
        } catch {
          // Keep existing auth user if refresh fails
        }
      },
    }),
    editProfile: builder.mutation({
      query: (body) => ({
        url: '/user/update',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.data?.user) {
            dispatch({ type: 'auth/setUser', payload: data.data.user })
          }
        } catch {
          // Ignore sync failure; form handles error UI
        }
      },
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/user/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useEditProfileMutation,
  useChangePasswordMutation,
} = userApi
