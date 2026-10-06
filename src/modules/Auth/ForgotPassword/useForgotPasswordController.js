import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { ROUTES } from '@/helpers/routes'
import { useForgetPasswordMutation } from '@/redux/apis/Auth'

const forgot_schema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
})

const useForgotPasswordController = () => {
  const navigate = useNavigate()
  const [success_message, setSuccessMessage] = useState('')
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgot_schema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    setSuccessMessage('')

    try {
      const result = await forgetPassword({ email: values.email }).unwrap()
      setSuccessMessage(result?.message || 'OTP has been sent to your email.')
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.error ||
        'Unable to send reset instructions.'

      setError('root', { type: 'server', message })
    }
  })

  const onBackToLogin = () => navigate(ROUTES.LOGIN)

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
      onBackToLogin,
      clearRootError: () => {
        clearErrors('root')
        setSuccessMessage('')
      },
    },
  }
}

export default useForgotPasswordController
