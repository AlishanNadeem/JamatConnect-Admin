import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDialog } from '@/components/Dialog/DialogProvider'
import { useGetUserByIdQuery, useToggleUserActiveMutation } from '@/redux/apis/User'
import { selectUser } from '@/redux/selectors'

const useUserDetailController = () => {
  const { id } = useParams()
  const { confirm, acknowledge } = useDialog()
  const current_user = useSelector(selectUser)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetUserByIdQuery(id, { skip: !id })

  const [toggleUserActive, { isLoading: is_toggling }] = useToggleUserActiveMutation()

  const user = data?.data || null
  const is_self = String(id) === String(current_user?._id)

  const onToggleActive = async () => {
    if (!user) return

    if (is_self) {
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

    try {
      await toggleUserActive(user._id).unwrap()

      await acknowledge({
        title: next_active ? 'User activated' : 'User deactivated',
        description: `"${user.name}" has been ${next_active ? 'activated' : 'deactivated'} successfully.`,
        confirmLabel: 'Done',
        variant: 'success',
      })
    } catch (err) {
      await acknowledge({
        title: 'Unable to update status',
        description:
          err?.data?.message || err?.error || `Unable to ${action_label} user.`,
        confirmLabel: 'Got it',
        variant: 'danger',
      })
    }
  }

  return {
    values: {
      user,
      is_self,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load user details.',
      is_toggling,
    },
    functions: {
      onToggleActive,
      refetch,
    },
  }
}

export default useUserDetailController
