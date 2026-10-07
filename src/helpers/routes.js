export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  CHANGE_PASSWORD: '/profile/change-password',
  BUSINESS_CATEGORIES: '/business-categories',
  BUSINESS_CATEGORY_CREATE: '/business-categories/create',
  BUSINESS_CATEGORY_EDIT: '/business-categories/:id/edit',
  USERS: '/users',
  USER_CREATE: '/users/create',
  USER_DETAIL: '/users/:id',
}

export const businessCategoryEditRoute = (id) => `/business-categories/${id}/edit`
export const userDetailRoute = (id) => `/users/${id}`
