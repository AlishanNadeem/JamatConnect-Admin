import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { convertToFormData } from '@/helpers/general'
import { ROUTES } from '@/helpers/routes'
import {
  useGetBusinessCategoryByIdQuery,
  useUpdateBusinessCategoryMutation,
} from '@/redux/apis/BusinessCategory'

const edit_schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  description: Yup.string().max(500, 'Description cannot exceed 500 characters'),
  active: Yup.boolean(),
})

const useEditBusinessCategoryController = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [image_file, setImageFile] = useState(null)
  const [preview_url, setPreviewUrl] = useState('')
  const [success_message, setSuccessMessage] = useState('')

  const {
    data,
    isLoading: is_loading_category,
    isError,
    error,
  } = useGetBusinessCategoryByIdQuery(id, { skip: !id })

  const [updateCategory, { isLoading }] = useUpdateBusinessCategoryMutation()
  const category = data?.data

  const default_values = useMemo(
    () => ({
      name: category?.name || '',
      description: category?.description || '',
      active: category?.active ?? true,
    }),
    [category]
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

  useEffect(() => {
    reset(default_values)
    setPreviewUrl(category?.image_url || '')
    setImageFile(null)
  }, [default_values, category?.image_url, reset])

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

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    setSuccessMessage('')

    try {
      const payload = {
        name: values.name,
        description: values.description,
        active: values.active,
      }

      if (image_file) payload.image = image_file

      const result = await updateCategory({
        id,
        body: convertToFormData(payload),
      }).unwrap()

      setSuccessMessage(result?.message || 'Business category updated successfully.')
      setTimeout(() => navigate(ROUTES.BUSINESS_CATEGORIES), 700)
    } catch (err) {
      setError('root', {
        type: 'server',
        message:
          err?.data?.message ||
          err?.data?.errors?.[0] ||
          err?.error ||
          'Unable to update business category.',
      })
    }
  })

  const onCancel = () => navigate(ROUTES.BUSINESS_CATEGORIES)

  return {
    values: {
      register,
      errors,
      isLoading,
      is_loading_category,
      isError,
      error_message: error?.data?.message || 'Unable to load category.',
      preview_url,
      active,
      root_error: errors.root?.message,
      root_success: success_message,
      image_error: errors.image?.message,
    },
    functions: {
      onSubmit,
      onCancel,
      onImageChange,
      setActive: (checked) => setValue('active', checked, { shouldDirty: true }),
      clearRootError: () => {
        clearErrors('root')
        setSuccessMessage('')
      },
    },
  }
}

export default useEditBusinessCategoryController
