import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { ROLES } from '@/config/env'
import { DEFAULT_COUNTRY } from '@/helpers/data'
import { convertToFormData } from '@/helpers/general'
import { ROUTES } from '@/helpers/routes'
import { useCreateUserMutation } from '@/redux/apis/User'

const create_schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
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
  send_invite: Yup.boolean(),
})

const useCreateUserController = () => {
  const navigate = useNavigate()
  const [image_file, setImageFile] = useState(null)
  const [preview_url, setPreviewUrl] = useState('')
  const [success_message, setSuccessMessage] = useState('')
  const [createUser, { isLoading }] = useCreateUserMutation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(create_schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country_code: DEFAULT_COUNTRY.code,
      dialing_code: DEFAULT_COUNTRY.calling_code,
      phone: '',
      active: true,
      send_invite: true,
    },
  })

  const active = watch('active')
  const send_invite = watch('send_invite')
  const country_code = watch('country_code')
  const dialing_code = watch('dialing_code')

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
        role: ROLES.USER,
        active: values.active,
        send_invite: values.send_invite,
        country_code: values.country_code,
        dialing_code: values.dialing_code,
        phone: values.phone,
      }

      if (values.password) payload.password = values.password
      if (image_file) payload.image = image_file

      const result = await createUser(convertToFormData(payload)).unwrap()
      setSuccessMessage(result?.message || 'User created successfully.')
      setTimeout(() => navigate(ROUTES.USERS), 700)
    } catch (error) {
      setError('root', {
        type: 'server',
        message:
          error?.data?.message ||
          error?.data?.errors?.[0] ||
          error?.error ||
          'Unable to create user.',
      })
    }
  })

  const onCancel = () => navigate(ROUTES.USERS)

  return {
    values: {
      register,
      errors,
      isLoading,
      preview_url,
      active,
      send_invite,
      country_code,
      dialing_code,
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
      setSendInvite: (checked) => setValue('send_invite', checked, { shouldDirty: true }),
      clearRootError: () => {
        clearErrors('root')
        setSuccessMessage('')
      },
    },
  }
}

export default useCreateUserController
