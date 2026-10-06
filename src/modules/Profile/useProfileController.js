import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ROUTES } from '@/helpers/routes'
import { useGetMyProfileQuery } from '@/redux/apis/User'
import { useLogoutMutation, authApi } from '@/redux/apis/Auth'
import { baseApi } from '@/redux/apis/Base'
import { clearCredentials } from '@/redux/slices/auth.slice'

const useProfileController = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, isLoading, isFetching, isError, error, refetch } = useGetMyProfileQuery()
  const [logout, { isLoading: is_logging_out }] = useLogoutMutation()

  const profile = useMemo(() => data?.data ?? null, [data])

  const onEditProfile = () => navigate(ROUTES.EDIT_PROFILE)
  const onChangePassword = () => navigate(ROUTES.CHANGE_PASSWORD)

  const onLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?')
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

  return {
    values: {
      profile,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load profile.',
      is_logging_out,
    },
    functions: {
      onEditProfile,
      onChangePassword,
      onLogout,
      refetch,
    },
  }
}

export default useProfileController
