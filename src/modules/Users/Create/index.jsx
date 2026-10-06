import Alert from '@/components/Alert'
import Button from '@/components/Button'
import ImageField from '@/components/ImageField'
import Input from '@/components/Input'
import PageHeader from '@/components/PageHeader'
import PhoneInput from '@/components/PhoneInput'
import Toggle from '@/components/Toggle'
import { ROUTES } from '@/helpers/routes'
import useCreateUserController from './useCreateUserController'
import '../UsersForm.scss'

const CreateUser = () => {
  const { values, functions } = useCreateUserController()

  return (
    <div className="users-form-page">
      <PageHeader
        backTo={ROUTES.USERS}
        backLabel="Back to Users"
        title="Create a new user"
        subtitle="Add a user account and optionally send an invite email"
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
          hint="Optional profile photo"
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

          <Input
            label="Password"
            type="password"
            placeholder="Leave empty to auto-generate"
            error={values.errors.password?.message}
            {...values.register('password')}
          />

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
          />

          <Toggle
            label="Send invite email"
            checked={values.send_invite}
            onChange={functions.setSendInvite}
          />
        </div>

        <div className="users-form__actions">
          <Button type="button" variant="ghost" onClick={functions.onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={values.isLoading}>
            Create User
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateUser
