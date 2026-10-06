import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { DEFAULT_COUNTRY } from '@/helpers/data'
import { convertToFormData } from '@/helpers/general'
import { ROUTES } from '@/helpers/routes'
import { useEditProfileMutation, useGetMyProfileQuery } from '@/redux/apis/User'

const edit_profile_schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  country_code: Yup.string().required('Country code is required'),
  dialing_code: Yup.string().required('Dialing code is required'),
  phone: Yup.string()
    .transform((value) => value?.trim() || '')
    .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
    .test('phone-length', 'Phone number must be at least 10 digits', (value) => {
      if (!value) return true
      const digits = value.replace(/\D/g, '')
      return digits.length >= 10
    }),
})

const useEditProfileController = () => {
  const navigate = useNavigate()
  const { data, isLoading: is_profile_loading } = useGetMyProfileQuery()
  const [editProfile, { isLoading }] = useEditProfileMutation()
  const [image_file, setImageFile] = useState(null)
  const [preview_url, setPreviewUrl] = useState('')
  const [success_message, setSuccessMessage] = useState('')

  const profile = data?.data

  const default_values = useMemo(
    () => ({
      name: profile?.name || '',
      email: profile?.email || '',
      dialing_code: profile?.dialing_code || DEFAULT_COUNTRY.calling_code,
      country_code: profile?.country_code || DEFAULT_COUNTRY.code,
      phone: profile?.phone || '',
    }),
    [profile]
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(edit_profile_schema),
    defaultValues: default_values,
  })

  useEffect(() => {
    reset(default_values)
    setPreviewUrl(profile?.image_url || '')
    setImageFile(null)
  }, [default_values, profile?.image_url, reset])

  useEffect(() => {
    if (!image_file) return undefined
    const object_url = URL.createObjectURL(image_file)
    setPreviewUrl(object_url)
    return () => URL.revokeObjectURL(object_url)
  }, [image_file])

  const country_code = watch('country_code')
  const dialing_code = watch('dialing_code')
  const name = watch('name')

  const onCountryChange = ({ code, calling_code }) => {
    setValue('country_code', code, { shouldValidate: true, shouldDirty: true })
    setValue('dialing_code', calling_code, { shouldValidate: true, shouldDirty: true })
  }

  const onImageChange = (file) => {
    if (!file?.type?.startsWith('image/')) {
      setError('image', { type: 'manual', message: 'Please select a valid image file.' })
      return
    }
    clearErrors('image')
    setImageFile(file)
  }

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    setSuccessMessage('')

    try {
      const payload = {
        name: values.name,
        country_code: values.country_code,
        dialing_code: values.dialing_code,
        phone: values.phone,
      }

      if (image_file) {
        payload.image = image_file
      }

      const result = await editProfile(convertToFormData(payload)).unwrap()
      setSuccessMessage(result?.message || 'Profile updated successfully.')
      setImageFile(null)

      setTimeout(() => {
        navigate(ROUTES.PROFILE)
      }, 700)
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.data?.errors?.[0] ||
        error?.error ||
        'Unable to update profile.'

      setError('root', { type: 'server', message })
    }
  })

  const onCancel = () => navigate(ROUTES.PROFILE)

  return {
    values: {
      register,
      errors,
      isLoading,
      is_profile_loading,
      preview_url,
      country_code,
      dialing_code,
      name,
      root_error: errors.root?.message,
      root_success: success_message,
      image_error: errors.image?.message,
    },
    functions: {
      onSubmit,
      onCancel,
      onCountryChange,
      onImageChange,
      clearRootError: () => {
        clearErrors('root')
        setSuccessMessage('')
      },
    },
  }
}

export default useEditProfileController
