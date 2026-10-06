import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDialog } from '@/components/Dialog/DialogProvider'
import { convertToFormData } from '@/helpers/general'
import { ROUTES, userEditRoute } from '@/helpers/routes'
import { useGetUsersQuery, useUpdateUserMutation } from '@/redux/apis/User'
import { selectUser } from '@/redux/selectors'

const PAGE_SIZE = 10

const useUsersController = () => {
  const navigate = useNavigate()
  const { confirm, acknowledge } = useDialog()
  const current_user = useSelector(selectUser)
  const [search_input, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)
  const [action_error, setActionError] = useState('')
  const [toggling_user_id, setTogglingUserId] = useState(null)

  const query_params = useMemo(() => {
    const params = {
      page,
      page_size: PAGE_SIZE,
    }

    if (search.trim()) params.search = search.trim()
    if (status === 'active') params.active = true
    if (status === 'inactive') params.active = false
    if (role !== 'all') params.role = role

    return params
  }, [page, search, status, role])

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetUsersQuery(query_params)

  const [updateUser, { isLoading: is_updating }] = useUpdateUserMutation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(search_input)
      setPage(1)
    }, 350)

    return () => clearTimeout(timer)
  }, [search_input])

  const users = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    total_pages: 1,
    total: 0,
    page_size: PAGE_SIZE,
  }

  const onCreate = () => navigate(ROUTES.USER_CREATE)
  const onEdit = (id) => navigate(userEditRoute(id))

  const onStatusChange = (value) => {
    setStatus(value)
    setPage(1)
  }

  const onRoleChange = (value) => {
    setRole(value)
    setPage(1)
  }

  const onToggleActive = async (user) => {
    if (String(user._id) === String(current_user?._id)) {
      await acknowledge({
        title: 'Action not allowed',
        description: 'You cannot change your own account status.',
        variant: 'warning',
      })
      return
    }

    const next_active = !user.active
    const action_label = next_active ? 'activate' : 'deactivate'
    const confirmed = await confirm({
      title: next_active ? 'Activate user?' : 'Deactivate user?',
      description: `Are you sure you want to ${action_label} "${user.name}"?`,
      confirmLabel: next_active ? 'Activate' : 'Deactivate',
      cancelLabel: 'Cancel',
      variant: next_active ? 'info' : 'danger',
      confirmVariant: next_active ? 'primary' : 'danger',
    })
    if (!confirmed) return

    setActionError('')
    setTogglingUserId(user._id)

    try {
      await updateUser({
        id: user._id,
        body: convertToFormData({ active: next_active }),
      }).unwrap()

      await acknowledge({
        title: next_active ? 'User activated' : 'User deactivated',
        description: `"${user.name}" has been ${next_active ? 'activated' : 'deactivated'} successfully.`,
        confirmLabel: 'Done',
        variant: 'success',
      })
    } catch (err) {
      setActionError(
        err?.data?.message || err?.error || `Unable to ${action_label} user.`
      )
    } finally {
      setTogglingUserId(null)
    }
  }

  return {
    values: {
      users,
      pagination,
      search_input,
      status,
      role,
      current_user_id: current_user?._id,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load users.',
      is_updating,
      toggling_user_id,
      action_error,
    },
    functions: {
      setSearchInput,
      onStatusChange,
      onRoleChange,
      setPage,
      onCreate,
      onEdit,
      onToggleActive,
      refetch,
      clearActionError: () => setActionError(''),
    },
  }
}

export default useUsersController
