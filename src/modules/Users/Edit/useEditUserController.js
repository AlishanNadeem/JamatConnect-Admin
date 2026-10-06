import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import { ROLES } from '@/config/env'
import { DEFAULT_COUNTRY } from '@/helpers/data'
import { convertToFormData } from '@/helpers/general'
import { ROUTES } from '@/helpers/routes'
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/redux/apis/User'
import { selectUser } from '@/redux/selectors'

const edit_schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  role: Yup.string().oneOf([ROLES.USER, ROLES.ADMIN]).required('Role is required'),
  country_code: Yup.string(),
  dialing_code: Yup.string(),
  phone: Yup.string()
    .transform((value) => value?.trim() || '')
    .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
    .test('phone-length', 'Phone number must be at least 10 digits', (value) => {
      if (!value) return true
      return value.replace(/\D/g, '').length >= 10
    }),
  active: Yup.boolean(),
})

const useEditUserController = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const current_user = useSelector(selectUser)
  const [image_file, setImageFile] = useState(null)
  const [preview_url, setPreviewUrl] = useState('')
  const [success_message, setSuccessMessage] = useState('')

  const {
    data,
    isLoading: is_loading_user,
    isError,
    error,
  } = useGetUserByIdQuery(id, { skip: !id })

  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const user = data?.data
  const is_self = String(id) === String(current_user?._id)
  const is_admin_user = user?.role === ROLES.ADMIN

  const default_values = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || ROLES.USER,
      country_code: user?.country_code || DEFAULT_COUNTRY.code,
      dialing_code: user?.dialing_code || DEFAULT_COUNTRY.calling_code,
      phone: user?.phone || '',
      active: user?.active ?? true,
    }),
    [user]
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(edit_schema),
    defaultValues: default_values,
  })

  const active = watch('active')
  const role = watch('role')
  const country_code = watch('country_code')
  const dialing_code = watch('dialing_code')

  useEffect(() => {
    reset(default_values)
    setPreviewUrl(user?.image_url || '')
    setImageFile(null)
  }, [default_values, user?.image_url, reset])

  useEffect(() => {
    if (!image_file) return undefined
    const object_url = URL.createObjectURL(image_file)
    setPreviewUrl(object_url)
    return () => URL.revokeObjectURL(object_url)
  }, [image_file])

  const onImageChange = (file) => {
    if (!file?.type?.startsWith('image/')) {
      setError('image', { type: 'manual', message: 'Please select a valid image file.' })
      return
    }
    clearErrors('image')
    setImageFile(file)
  }

  const onCountryChange = ({ code, calling_code }) => {
    setValue('country_code', code, { shouldDirty: true })
    setValue('dialing_code', calling_code, { shouldDirty: true })
  }

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    setSuccessMessage('')

    try {
      const payload = {
        name: values.name,
        email: values.email,
        active: values.active,
        country_code: values.country_code,
        dialing_code: values.dialing_code,
        phone: values.phone,
      }

      if (!is_admin_user) {
        payload.role = ROLES.USER
      }

      if (image_file) payload.image = image_file

      const result = await updateUser({
        id,
        body: convertToFormData(payload),
      }).unwrap()

      setSuccessMessage(result?.message || 'User updated successfully.')
      setTimeout(() => navigate(ROUTES.USERS), 700)
    } catch (err) {
      setError('root', {
        type: 'server',
        message:
          err?.data?.message ||
          err?.data?.errors?.[0] ||
          err?.error ||
          'Unable to update user.',
      })
    }
  })

  const onCancel = () => navigate(ROUTES.USERS)

  return {
    values: {
      register,
      errors,
      isLoading,
      is_loading_user,
      isError,
      error_message: error?.data?.message || 'Unable to load user.',
      preview_url,
      active,
      role,
      country_code,
      dialing_code,
      is_self,
      is_admin_user,
      root_error: errors.root?.message,
      root_success: success_message,
      image_error: errors.image?.message,
    },
    functions: {
      onSubmit,
      onCancel,
      onImageChange,
      onCountryChange,
      setActive: (checked) => setValue('active', checked, { shouldDirty: true }),
      setRole: (value) => setValue('role', value, { shouldDirty: true, shouldValidate: true }),
      clearRootError: () => {
        clearErrors('root')
        setSuccessMessage('')
      },
    },
  }
}

export default useEditUserController
