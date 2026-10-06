import Alert from '@/components/Alert'
import Button from '@/components/Button'
import ImageField from '@/components/ImageField'
import Input from '@/components/Input'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import PhoneInput from '@/components/PhoneInput'
import Select from '@/components/Select'
import Toggle from '@/components/Toggle'
import { ROLES } from '@/config/env'
import { ROUTES } from '@/helpers/routes'
import useEditUserController from './useEditUserController'
import '../UsersForm.scss'

const ROLE_OPTIONS = [
  { value: ROLES.USER, label: 'User' },
]

const EditUser = () => {
  const { values, functions } = useEditUserController()

  if (values.is_loading_user) {
    return <Loader label="Loading user…" compact />
  }

  if (values.isError) {
    return (
      <div className="users-form-page">
        <PageHeader
          backTo={ROUTES.USERS}
          backLabel="Back to Users"
          title="Edit user"
        />
        <Alert type="error" message={values.error_message} />
      </div>
    )
  }

  return (
    <div className="users-form-page">
      <PageHeader
        backTo={ROUTES.USERS}
        backLabel="Back to Users"
        title="Edit user"
        subtitle="Update account details, role, and status"
      />

      <form className="users-form" onSubmit={functions.onSubmit} noValidate>
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
          label="Profile Image"
          preview={values.preview_url}
          onChange={functions.onImageChange}
          error={values.image_error}
          hint="Leave unchanged to keep the current photo"
        />

        <div className="users-form__fields">
          <Input
            label="Name"
            required
            placeholder="Enter full name"
            error={values.errors.name?.message}
            {...values.register('name')}
          />

          <Input
            label="Email Address"
            required
            type="email"
            placeholder="Enter email address"
            error={values.errors.email?.message}
            {...values.register('email')}
          />

          <div className="users-form__select">
            <label>Role</label>
            {values.is_admin_user ? (
              <>
                <div className="users-form__role-locked">Admin</div>
                <p className="users-form__hint">Admin role cannot be changed here.</p>
              </>
            ) : (
              <Select
                value={values.role}
                onChange={functions.setRole}
                options={ROLE_OPTIONS}
                disabled={values.is_self}
              />
            )}
            {values.is_self && !values.is_admin_user ? (
              <p className="users-form__hint">You cannot change your own role.</p>
            ) : null}
            {values.errors.role?.message ? (
              <p className="users-form__error">{values.errors.role.message}</p>
            ) : null}
          </div>

          <PhoneInput
            label="Phone Number"
            countryCode={values.country_code}
            dialingCode={values.dialing_code}
            onCountryChange={functions.onCountryChange}
            error={values.errors.phone?.message}
            {...values.register('phone')}
          />

          <Toggle
            label="Active"
            checked={values.active}
            onChange={functions.setActive}
            id="edit-user-active"
            disabled={values.is_self}
          />
          {values.is_self ? (
            <p className="users-form__hint">
              You cannot deactivate your own account.
            </p>
          ) : null}
        </div>

        <div className="users-form__actions">
          <Button type="button" variant="ghost" onClick={functions.onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={values.isLoading}>
            Update User
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditUser
