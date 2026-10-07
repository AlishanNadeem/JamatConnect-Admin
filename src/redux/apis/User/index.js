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
    getUsers: builder.query({
      query: (params = {}) => ({
        url: '/user/get',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Users', id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUserById: builder.query({
      query: (id) => `/user/get/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: '/user/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    toggleUserActive: builder.mutation({
      query: (id) => ({
        url: `/user/toggle-active/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        'Profile',
      ],
    }),
  }),
})

export const {
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useEditProfileMutation,
  useChangePasswordMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useToggleUserActiveMutation,
} = userApi
