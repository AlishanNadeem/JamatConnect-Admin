import { baseApi } from '@/redux/apis/Base'

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedbacks: builder.query({
      query: (params = {}) => ({
        url: '/feedback/get',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Feedbacks', id: _id })),
              { type: 'Feedbacks', id: 'LIST' },
            ]
          : [{ type: 'Feedbacks', id: 'LIST' }],
    }),
    getFeedbackById: builder.query({
      query: (id) => `/feedback/get/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Feedbacks', id }],
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            baseApi.util.invalidateTags([{ type: 'Feedbacks', id: 'LIST' }])
          )
        } catch {
          // leave list cache as-is on error
        }
      },
    }),
    toggleFeedbackRead: builder.mutation({
      query: (id) => ({
        url: `/feedback/toggle-read/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Feedbacks', id },
        { type: 'Feedbacks', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetFeedbacksQuery,
  useGetFeedbackByIdQuery,
  useToggleFeedbackReadMutation,
} = feedbackApi
