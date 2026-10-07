import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDialog } from '@/components/Dialog/DialogProvider'
import { convertToFormData } from '@/helpers/general'
import { ROUTES, businessCategoryEditRoute } from '@/helpers/routes'
import {
  useDeleteBusinessCategoryMutation,
  useGetBusinessCategoriesQuery,
  useUpdateBusinessCategoryMutation,
} from '@/redux/apis/BusinessCategory'

const PAGE_SIZE = 10

const useBusinessCategoryController = () => {
  const navigate = useNavigate()
  const { confirm, acknowledge } = useDialog()
  const [search_input, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [action_error, setActionError] = useState('')
  const [toggling_category_id, setTogglingCategoryId] = useState(null)
  const [deleting_category_id, setDeletingCategoryId] = useState(null)

  const query_params = useMemo(() => {
    const params = {
      page,
      page_size: PAGE_SIZE,
    }

    if (search.trim()) params.search = search.trim()
    if (status === 'active') params.active = true
    if (status === 'inactive') params.active = false

    return params
  }, [page, search, status])

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetBusinessCategoriesQuery(query_params)

  const [updateCategory, { isLoading: is_updating }] = useUpdateBusinessCategoryMutation()
  const [deleteCategory, { isLoading: is_deleting }] = useDeleteBusinessCategoryMutation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(search_input)
      setPage(1)
    }, 350)

    return () => clearTimeout(timer)
  }, [search_input])

  const categories = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    total_pages: 1,
    total: 0,
    page_size: PAGE_SIZE,
  }

  const onCreate = () => navigate(ROUTES.BUSINESS_CATEGORY_CREATE)
  const onEdit = (id) => navigate(businessCategoryEditRoute(id))

  const onStatusChange = (value) => {
    setStatus(value)
    setPage(1)
  }

  const onToggleActive = async (category) => {
    const next_active = !category.active
    const action_label = next_active ? 'activate' : 'deactivate'
    const confirmed = await confirm({
      title: next_active ? 'Activate category?' : 'Deactivate category?',
      description: `Are you sure you want to ${action_label} "${category.name}"?`,
      confirmLabel: next_active ? 'Activate' : 'Deactivate',
      cancelLabel: 'Cancel',
      variant: next_active ? 'info' : 'danger',
      confirmVariant: next_active ? 'primary' : 'danger',
    })
    if (!confirmed) return

    setActionError('')
    setTogglingCategoryId(category._id)

    try {
      await updateCategory({
        id: category._id,
        body: convertToFormData({ active: next_active }),
      }).unwrap()

      await acknowledge({
        title: next_active ? 'Category activated' : 'Category deactivated',
        description: `"${category.name}" has been ${next_active ? 'activated' : 'deactivated'} successfully.`,
        confirmLabel: 'Done',
        variant: 'success',
      })
    } catch (err) {
      setActionError(
        err?.data?.message || err?.error || `Unable to ${action_label} category.`
      )
    } finally {
      setTogglingCategoryId(null)
    }
  }

  const onDelete = async (category) => {
    const business_count = category.business_count || 0

    if (business_count > 0) {
      await acknowledge({
        title: 'Cannot delete category',
        description: `"${category.name}" has ${business_count} registered business${business_count === 1 ? '' : 'es'} and cannot be deleted.`,
        confirmLabel: 'Got it',
        variant: 'warning',
      })
      return
    }

    const confirmed = await confirm({
      title: 'Delete category?',
      description: `Delete "${category.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
      confirmVariant: 'danger',
    })
    if (!confirmed) return

    setActionError('')
    setDeletingCategoryId(category._id)

    try {
      await deleteCategory(category._id).unwrap()

      await acknowledge({
        title: 'Category deleted',
        description: `"${category.name}" has been deleted successfully.`,
        confirmLabel: 'Done',
        variant: 'success',
      })
    } catch (err) {
      await acknowledge({
        title: 'Unable to delete',
        description:
          err?.data?.message ||
          err?.error ||
          'Unable to delete business category.',
        confirmLabel: 'Got it',
        variant: 'danger',
      })
    } finally {
      setDeletingCategoryId(null)
    }
  }

  return {
    values: {
      categories,
      pagination,
      search_input,
      status,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load business categories.',
      is_updating,
      is_deleting,
      toggling_category_id,
      deleting_category_id,
      action_error,
    },
    functions: {
      setSearchInput,
      onStatusChange,
      setPage,
      onCreate,
      onEdit,
      onToggleActive,
      onDelete,
      refetch,
      clearActionError: () => setActionError(''),
    },
  }
}

export default useBusinessCategoryController
