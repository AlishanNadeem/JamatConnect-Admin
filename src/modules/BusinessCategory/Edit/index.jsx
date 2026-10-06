import Alert from '@/components/Alert'
import Button from '@/components/Button'
import ImageField from '@/components/ImageField'
import Input from '@/components/Input'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import Toggle from '@/components/Toggle'
import { ROUTES } from '@/helpers/routes'
import useEditBusinessCategoryController from './useEditBusinessCategoryController'
import '../BusinessCategoryForm.scss'

const EditBusinessCategory = () => {
  const { values, functions } = useEditBusinessCategoryController()

  if (values.is_loading_category) {
    return <Loader label="Loading category…" compact />
  }

  if (values.isError) {
    return (
      <div className="business-category-form-page">
        <PageHeader
          backTo={ROUTES.BUSINESS_CATEGORIES}
          backLabel="Back to Categories"
          title="Edit business category"
        />
        <Alert type="error" message={values.error_message} />
      </div>
    )
  }

  return (
    <div className="business-category-form-page">
      <PageHeader
        backTo={ROUTES.BUSINESS_CATEGORIES}
        backLabel="Back to Categories"
        title="Edit business category"
        subtitle="Update category details and visibility"
      />

      <form className="business-category-form" onSubmit={functions.onSubmit} noValidate>
        <Alert
          type="error"
          message={values.root_error}
          onClose={functions.clearRootError}
        />
        <Alert
          type="success"
          message={values.root_success}
          onClose={functions.clearRootError}
        />

        <ImageField
          label="Category Image"
          preview={values.preview_url}
          onChange={functions.onImageChange}
          error={values.image_error}
          hint="Leave unchanged to keep the current image"
        />

        <div className="business-category-form__fields">
          <Input
            label="Name"
            required
            placeholder="Enter category name"
            error={values.errors.name?.message}
            {...values.register('name')}
          />

          <div className="business-category-form__textarea">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              rows={4}
              placeholder="Enter category description"
              {...values.register('description')}
            />
            {values.errors.description?.message ? (
              <p className="business-category-form__error">
                {values.errors.description.message}
              </p>
            ) : null}
          </div>

          <Toggle
            label="Active"
            checked={values.active}
            onChange={functions.setActive}
          />
        </div>

        <div className="business-category-form__actions">
          <Button type="button" variant="ghost" onClick={functions.onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={values.isLoading}>
            Update Category
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditBusinessCategory
