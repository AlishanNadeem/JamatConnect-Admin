import { baseApi } from '@/redux/apis/Base'

export const businessCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessCategories: builder.query({
      query: (params = {}) => ({
        url: '/business-category/get',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'BusinessCategories', id: _id })),
              { type: 'BusinessCategories', id: 'LIST' },
            ]
          : [{ type: 'BusinessCategories', id: 'LIST' }],
    }),
    getBusinessCategoryById: builder.query({
      query: (id) => `/business-category/get/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'BusinessCategories', id }],
    }),
    createBusinessCategory: builder.mutation({
      query: (body) => ({
        url: '/business-category/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'BusinessCategories', id: 'LIST' }],
    }),
    updateBusinessCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/business-category/update/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'BusinessCategories', id },
        { type: 'BusinessCategories', id: 'LIST' },
      ],
    }),
    deleteBusinessCategory: builder.mutation({
      query: (id) => ({
        url: `/business-category/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'BusinessCategories', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetBusinessCategoriesQuery,
  useGetBusinessCategoryByIdQuery,
  useCreateBusinessCategoryMutation,
  useUpdateBusinessCategoryMutation,
  useDeleteBusinessCategoryMutation,
} = businessCategoryApi
