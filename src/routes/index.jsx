import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import ForgotPassword from '@/modules/Auth/ForgotPassword'
import Login from '@/modules/Auth/Login'
import BusinessCategory from '@/modules/BusinessCategory'
import CreateBusinessCategory from '@/modules/BusinessCategory/Create'
import EditBusinessCategory from '@/modules/BusinessCategory/Edit'
import ChangePassword from '@/modules/ChangePassword'
import Dashboard from '@/modules/Dashboard'
import EditProfile from '@/modules/EditProfile'
import Profile from '@/modules/Profile'
import Feedbacks from '@/modules/Feedbacks'
import FeedbackDetail from '@/modules/Feedbacks/Detail'
import Users from '@/modules/Users'
import CreateUser from '@/modules/Users/Create'
import UserDetail from '@/modules/Users/Detail'
import { ROUTES } from '@/helpers/routes'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
            <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
            <Route path={ROUTES.BUSINESS_CATEGORIES} element={<BusinessCategory />} />
            <Route
              path={ROUTES.BUSINESS_CATEGORY_CREATE}
              element={<CreateBusinessCategory />}
            />
            <Route
              path={ROUTES.BUSINESS_CATEGORY_EDIT}
              element={<EditBusinessCategory />}
            />
            <Route path={ROUTES.USERS} element={<Users />} />
            <Route path={ROUTES.USER_CREATE} element={<CreateUser />} />
            <Route path={ROUTES.USER_DETAIL} element={<UserDetail />} />
            <Route path={ROUTES.FEEDBACKS} element={<Feedbacks />} />
            <Route path={ROUTES.FEEDBACK_DETAIL} element={<FeedbackDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
