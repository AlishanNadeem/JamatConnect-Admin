import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '@/assets/images/logo.png'
import Button from '@/components/Button'
import { ROUTES } from '@/helpers/routes'
import { useLogoutMutation } from '@/redux/apis/Auth'
import { selectUser } from '@/redux/selectors'
import { clearCredentials } from '@/redux/slices/auth.slice'
import './DashboardLayout.scss'

const DashboardLayout = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout, { isLoading }] = useLogoutMutation()

  const onLogout = async () => {
    try {
      await logout({}).unwrap()
    } catch {
      // Clear local session even if API logout fails
    } finally {
      dispatch(clearCredentials())
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-layout__header">
        <div className="dashboard-layout__brand">
          <img src={logo} alt="" className="dashboard-layout__logo" />
          <div>
            <p className="dashboard-layout__title">Jamat Connect</p>
            <p className="dashboard-layout__subtitle">Admin Panel</p>
          </div>
        </div>

        <div className="dashboard-layout__user">
          <div className="dashboard-layout__user-meta">
            <p className="dashboard-layout__user-name">{user?.name || 'Admin'}</p>
            <p className="dashboard-layout__user-email">{user?.email}</p>
          </div>
          <Button
            fullWidth={false}
            variant="ghost"
            loading={isLoading}
            onClick={onLogout}
            className="dashboard-layout__logout"
          >
            Log Out
          </Button>
        </div>
      </header>

      <motion.main
        className="dashboard-layout__main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

export default DashboardLayout
