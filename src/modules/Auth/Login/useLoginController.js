import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { ROLES } from '@/config/env'
import { ROUTES } from '@/helpers/routes'
import {
  clearRememberedCredentials,
  getRememberedCredentials,
  saveRememberedCredentials,
} from '@/helpers/storage'
import { useLoginMutation } from '@/redux/apis/Auth'

const login_schema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  remember_me: Yup.boolean(),
})

const useLoginController = () => {
  const navigate = useNavigate()
  const remembered = getRememberedCredentials()
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(login_schema),
    defaultValues: {
      email: remembered?.email ?? '',
      password: remembered?.password ?? '',
      remember_me: Boolean(remembered?.email),
    },
  })

  const remember_me = watch('remember_me')

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')

    try {
      if (values.remember_me) {
        saveRememberedCredentials(values.email, values.password)
      } else {
        clearRememberedCredentials()
      }

      await login({
        email: values.email,
        password: values.password,
        source: ROLES.ADMIN,
      }).unwrap()

      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.error ||
        'Unable to sign in. Please check your credentials.'

      setError('root', { type: 'server', message })
    }
  })

  const onForgotPassword = () => navigate(ROUTES.FORGOT_PASSWORD)

  const toggleRememberMe = () => {
    setValue('remember_me', !remember_me, { shouldDirty: true })
  }

  return {
    values: {
      register,
      errors,
      isLoading,
      remember_me,
      root_error: errors.root?.message,
    },
    functions: {
      onSubmit,
      onForgotPassword,
      toggleRememberMe,
      clearRootError: () => clearErrors('root'),
    },
  }
}

export default useLoginController
