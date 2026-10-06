import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import AvatarUpload from '@/components/AvatarUpload'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import PhoneInput from '@/components/PhoneInput'
import { ROUTES } from '@/helpers/routes'
import useEditProfileController from './useEditProfileController'
import './EditProfile.scss'

const EditProfile = () => {
  const { values, functions } = useEditProfileController()

  if (values.is_profile_loading) {
    return <Loader label="Loading profile…" compact />
  }

  return (
    <div className="edit-profile-page">
      <PageHeader
        backTo={ROUTES.PROFILE}
        backLabel="Back to Profile"
        eyebrow="Account"
        title="Edit Profile"
        subtitle="Update your admin profile details"
      />

      <motion.form
        className="edit-profile-form"
        onSubmit={functions.onSubmit}
        noValidate
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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

        <AvatarUpload
          preview={values.preview_url}
          name={values.name}
          onChange={functions.onImageChange}
          error={values.image_error}
        />

        <div className="edit-profile-form__fields">
          <Input
            label="Name"
            required
            placeholder="Enter name"
            autoComplete="name"
            error={values.errors.name?.message}
            {...values.register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            disabled
            readOnly
            {...values.register('email')}
          />

          <PhoneInput
            label="Phone Number"
            countryCode={values.country_code}
            dialingCode={values.dialing_code}
            onCountryChange={functions.onCountryChange}
            error={values.errors.phone?.message}
            {...values.register('phone')}
          />
        </div>

        <div className="edit-profile-form__actions">
          <Button type="button" variant="ghost" onClick={functions.onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={values.isLoading}>
            Update
          </Button>
        </div>
      </motion.form>
    </div>
  )
}

export default EditProfile
