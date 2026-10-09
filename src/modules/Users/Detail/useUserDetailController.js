import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useDialog } from '@/components/Dialog/DialogProvider'
import {
  useGetUserByIdQuery,
  useRegenerateUserReferralMutation,
  useToggleUserActiveMutation,
  useToggleUserReferralMutation,
} from '@/redux/apis/User'
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
  const [toggleUserReferral, { isLoading: is_toggling_referral }] =
    useToggleUserReferralMutation()
  const [regenerateUserReferral, { isLoading: is_regenerating_referral }] =
    useRegenerateUserReferralMutation()
  const [link_copied, setLinkCopied] = useState(false)

  const user = data?.data || null
  const is_self = String(id) === String(current_user?._id)
  const has_referral = Boolean(user?.referral?.code)
  const can_manage_referral = user?.role === 'user'

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

  const onToggleReferral = async () => {
    if (!user?.referral?.code) return

    const next_active = !user.referral.active
    const action_label = next_active ? 'activate' : 'deactivate'
    const confirmed = await confirm({
      title: next_active ? 'Activate referral code?' : 'Deactivate referral code?',
      description: next_active
        ? `Allow new members to join using ${user.name}'s referral code "${user.referral.code}"?`
        : `New members will no longer be able to join using "${user.referral.code}".`,
      confirmLabel: next_active ? 'Activate' : 'Deactivate',
      cancelLabel: 'Cancel',
      variant: next_active ? 'info' : 'danger',
      confirmVariant: next_active ? 'primary' : 'danger',
    })
    if (!confirmed) return

    try {
      await toggleUserReferral(user._id).unwrap()

      await acknowledge({
        title: next_active ? 'Referral code activated' : 'Referral code deactivated',
        description: `"${user.referral.code}" has been ${next_active ? 'activated' : 'deactivated'} successfully.`,
        confirmLabel: 'Done',
        variant: 'success',
      })
    } catch (err) {
      await acknowledge({
        title: 'Unable to update referral code',
        description:
          err?.data?.message ||
          err?.error ||
          `Unable to ${action_label} referral code.`,
        confirmLabel: 'Got it',
        variant: 'danger',
      })
    }
  }

  const onRegenerateReferral = async () => {
    if (!user || !can_manage_referral) return

    const confirmed = await confirm({
      title: 'Regenerate referral code?',
      description: user.referral?.code
        ? `A new code will replace "${user.referral.code}". The old code will stop working for new signups.`
        : `Generate a new referral code for "${user.name}"?`,
      confirmLabel: 'Regenerate',
      cancelLabel: 'Cancel',
      variant: 'warning',
      confirmVariant: 'primary',
    })
    if (!confirmed) return

    try {
      const result = await regenerateUserReferral(user._id).unwrap()
      const new_code = result?.data?.referral?.code

      await acknowledge({
        title: 'Referral code regenerated',
        description: new_code
          ? `New referral code is "${new_code}".`
          : 'Referral code regenerated successfully.',
        confirmLabel: 'Done',
        variant: 'success',
      })
    } catch (err) {
      await acknowledge({
        title: 'Unable to regenerate code',
        description:
          err?.data?.message ||
          err?.error ||
          'Unable to regenerate referral code.',
        confirmLabel: 'Got it',
        variant: 'danger',
      })
    }
  }

  const onCopyReferralLink = async () => {
    if (!user?.referral_link) return

    try {
      await navigator.clipboard.writeText(user.referral_link)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 1800)
    } catch {
      await acknowledge({
        title: 'Unable to copy',
        description: 'Could not copy the referral link. Please copy it manually.',
        confirmLabel: 'Got it',
        variant: 'warning',
      })
    }
  }

  return {
    values: {
      user,
      is_self,
      has_referral,
      can_manage_referral,
      link_copied,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load user details.',
      is_toggling,
      is_toggling_referral,
      is_regenerating_referral,
    },
    functions: {
      onToggleActive,
      onToggleReferral,
      onRegenerateReferral,
      onCopyReferralLink,
      refetch,
    },
  }
}

export default useUserDetailController
