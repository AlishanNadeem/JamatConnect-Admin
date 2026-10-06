import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { convertToFormData } from '@/helpers/general'
import { ROUTES } from '@/helpers/routes'
import { useCreateBusinessCategoryMutation } from '@/redux/apis/BusinessCategory'

const create_schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  description: Yup.string().max(500, 'Description cannot exceed 500 characters'),
  active: Yup.boolean(),
})

const useCreateBusinessCategoryController = () => {
  const navigate = useNavigate()
  const [image_file, setImageFile] = useState(null)
  const [preview_url, setPreviewUrl] = useState('')
  const [success_message, setSuccessMessage] = useState('')
  const [createCategory, { isLoading }] = useCreateBusinessCategoryMutation()

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
      description: '',
      active: true,
    },
  })

  const active = watch('active')

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

    if (!image_file) {
      setError('image', { type: 'manual', message: 'Category image is required.' })
      return
    }

    try {
      const result = await createCategory(
        convertToFormData({
          name: values.name,
          description: values.description,
          active: values.active,
          image: image_file,
        })
      ).unwrap()

      setSuccessMessage(result?.message || 'Business category created successfully.')
      setTimeout(() => navigate(ROUTES.BUSINESS_CATEGORIES), 700)
    } catch (error) {
      setError('root', {
        type: 'server',
        message:
          error?.data?.message ||
          error?.data?.errors?.[0] ||
          error?.error ||
          'Unable to create business category.',
      })
    }
  })

  const onCancel = () => navigate(ROUTES.BUSINESS_CATEGORIES)

  return {
    values: {
      register,
      errors,
      isLoading,
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

export default useCreateBusinessCategoryController
