import Alert from '@/components/Alert'
import Button from '@/components/Button'
import ImageField from '@/components/ImageField'
import Input from '@/components/Input'
import PageHeader from '@/components/PageHeader'
import Toggle from '@/components/Toggle'
import { ROUTES } from '@/helpers/routes'
import useCreateBusinessCategoryController from './useCreateBusinessCategoryController'
import '../BusinessCategoryForm.scss'

const CreateBusinessCategory = () => {
  const { values, functions } = useCreateBusinessCategoryController()

  return (
    <div className="business-category-form-page">
      <PageHeader
        backTo={ROUTES.BUSINESS_CATEGORIES}
        backLabel="Back to Categories"
        title="Create a new business category"
        subtitle="Add a name, description, and image for this category"
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
          required
          preview={values.preview_url}
          onChange={functions.onImageChange}
          error={values.image_error}
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
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
            Create Category
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateBusinessCategory
