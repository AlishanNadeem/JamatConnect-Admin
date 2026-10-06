import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import * as Yup from 'yup'
import { ROUTES } from '@/helpers/routes'
import { useChangePasswordMutation } from '@/redux/apis/User'

const change_password_schema = Yup.object().shape({
  old_password: Yup.string().required('Current password is required'),
  new_password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Passwords must match')
    .required('Confirm password is required'),
})

const useChangePasswordController = () => {
  const navigate = useNavigate()
  const [success_message, setSuccessMessage] = useState('')
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(change_password_schema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    setSuccessMessage('')

    try {
      const result = await changePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      }).unwrap()

      setSuccessMessage(result?.message || 'Password changed successfully.')
      reset()

      setTimeout(() => {
        navigate(ROUTES.PROFILE)
      }, 700)
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.data?.errors?.[0] ||
        error?.error ||
        'Unable to change password.'

      setError('root', { type: 'server', message })
    }
  })

  const onCancel = () => navigate(ROUTES.PROFILE)

  return {
    values: {
      register,
      errors,
      isLoading,
      root_error: errors.root?.message,
      root_success: success_message,
    },
    functions: {
      onSubmit,
      onCancel,
      clearRootError: () => {
        clearErrors('root')
        setSuccessMessage('')
      },
    },
  }
}

export default useChangePasswordController
