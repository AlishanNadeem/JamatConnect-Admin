import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/helpers/routes'
import { selectIsAuthenticated } from '@/redux/selectors'

const ProtectedRoute = () => {
  const is_authenticated = useSelector(selectIsAuthenticated)

  if (!is_authenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
