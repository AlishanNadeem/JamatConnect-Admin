import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/helpers/routes'
import { selectIsAuthenticated } from '@/redux/selectors'

const PublicRoute = () => {
  const is_authenticated = useSelector(selectIsAuthenticated)

  if (is_authenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}

export default PublicRoute
