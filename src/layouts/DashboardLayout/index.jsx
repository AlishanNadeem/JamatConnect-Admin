import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import logo from '@/assets/images/logo.png'
import { useDialog } from '@/components/Dialog/DialogProvider'
import { ROUTES } from '@/helpers/routes'
import { authApi, useLogoutMutation } from '@/redux/apis/Auth'
import { baseApi } from '@/redux/apis/Base'
import { selectUser } from '@/redux/selectors'
import { clearCredentials } from '@/redux/slices/auth.slice'
import './DashboardLayout.scss'

const NAV_ITEMS = [
  {
    to: ROUTES.DASHBOARD,
    label: 'Dashboard',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 4.75h6.5v6.5H4v-6.5Zm9.5 0H20v6.5h-6.5v-6.5ZM4 12.75h6.5V19.25H4v-6.5Zm9.5 0H20v6.5h-6.5v-6.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: ROUTES.USERS,
    label: 'Users',
    end: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M20 20v-1.2a2.8 2.8 0 0 0-2.1-2.7M16.2 5.2a3 3 0 0 1 0 5.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: ROUTES.BUSINESS_CATEGORIES,
    label: 'Business Categories',
    end: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M7 4.5v15M12 4.5v15M17 4.5v15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    ),
  },
  {
    to: ROUTES.FEEDBACKS,
    label: 'Feedbacks',
    end: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4.5 6.5h15v9.5a2 2 0 0 1-2 2h-7.2L6 21.5v-3.5H6.5a2 2 0 0 1-2-2V6.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 10h7M8.5 13.5h5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.PROFILE]: 'My Profile',
  [ROUTES.EDIT_PROFILE]: 'Edit Profile',
  [ROUTES.CHANGE_PASSWORD]: 'Change Password',
  [ROUTES.BUSINESS_CATEGORIES]: 'Business Categories',
  [ROUTES.BUSINESS_CATEGORY_CREATE]: 'Create Category',
  [ROUTES.USERS]: 'Users',
  [ROUTES.USER_CREATE]: 'Create User',
  [ROUTES.FEEDBACKS]: 'Feedbacks',
}

const getPageTitle = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (/^\/business-categories\/[^/]+\/edit$/.test(pathname)) return 'Edit Category'
  if (/^\/users\/(?!create$)[^/]+$/.test(pathname)) return 'User Details'
  if (/^\/feedbacks\/[^/]+$/.test(pathname)) return 'Feedback Details'
  return 'Admin'
}

const DashboardLayout = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { confirm } = useDialog()
  const [logout, { isLoading }] = useLogoutMutation()
  const [menu_open, setMenuOpen] = useState(false)
  const [sidebar_open, setSidebarOpen] = useState(false)
  const menu_ref = useRef(null)

  const page_title = getPageTitle(location.pathname)
  const initials = (user?.name || 'A')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  useEffect(() => {
    setSidebarOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!menu_ref.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const onLogout = async () => {
    setMenuOpen(false)

    const confirmed = await confirm({
      title: 'Log out?',
      description: 'Are you sure you want to log out of your admin account?',
      confirmLabel: 'Log out',
      cancelLabel: 'Stay signed in',
      variant: 'warning',
      confirmVariant: 'danger',
    })
    if (!confirmed) return

    try {
      await logout({}).unwrap()
    } catch {
      // Clear local session even if API logout fails
    } finally {
      dispatch(clearCredentials())
      dispatch(baseApi.util.resetApiState())
      dispatch(authApi.util.resetApiState())
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }

  return (
    <div className={`dashboard-layout ${sidebar_open ? 'is-sidebar-open' : ''}`}>
      <div
        className="dashboard-layout__overlay"
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebar_open}
      />

      <aside className="dashboard-layout__sidebar">
        <button
          type="button"
          className="dashboard-layout__brand"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          aria-label="Jamat Connect Admin"
        >
          <img src={logo} alt="Jamat Connect" className="dashboard-layout__logo" />
        </button>

        <div className="dashboard-layout__nav-section">
          <p className="dashboard-layout__nav-label">Main</p>
          <nav className="dashboard-layout__nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `dashboard-layout__link ${isActive ? 'is-active' : ''}`
                }
              >
                <span className="dashboard-layout__link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <div className="dashboard-layout__content">
        <header className="dashboard-layout__header">
          <div className="dashboard-layout__header-left">
            <button
              type="button"
              className="dashboard-layout__menu-toggle"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
            <div>
              <p className="dashboard-layout__eyebrow">Jamat Connect Admin</p>
              <h1 className="dashboard-layout__page-title">{page_title}</h1>
            </div>
          </div>

          <div className="dashboard-layout__profile" ref={menu_ref}>
            <button
              type="button"
              className="dashboard-layout__avatar-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menu_open}
              aria-haspopup="menu"
            >
              <span className="dashboard-layout__avatar">
                {user?.image_url ? (
                  <img src={user.image_url} alt="" />
                ) : (
                  <span>{initials || 'A'}</span>
                )}
              </span>
              <span className="dashboard-layout__avatar-meta">
                <span className="dashboard-layout__user-name">{user?.name || 'Admin'}</span>
                <span className="dashboard-layout__user-role">Administrator</span>
              </span>
              <svg
                className="dashboard-layout__caret"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menu_open ? (
              <div className="dashboard-layout__menu" role="menu">
                <div className="dashboard-layout__menu-head">
                  <p>{user?.name || 'Admin'}</p>
                  <span>{user?.email}</span>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate(ROUTES.PROFILE)
                  }}
                >
                  My Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate(ROUTES.EDIT_PROFILE)
                  }}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate(ROUTES.CHANGE_PASSWORD)
                  }}
                >
                  Change Password
                </button>
                <div className="dashboard-layout__menu-divider" />
                <button
                  type="button"
                  role="menuitem"
                  className="is-danger"
                  disabled={isLoading}
                  onClick={onLogout}
                >
                  {isLoading ? 'Logging out…' : 'Log Out'}
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="dashboard-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
