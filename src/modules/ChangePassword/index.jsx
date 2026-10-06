import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Input from '@/components/Input'
import PageHeader from '@/components/PageHeader'
import { ROUTES } from '@/helpers/routes'
import useChangePasswordController from './useChangePasswordController'
import './ChangePassword.scss'

const ChangePassword = () => {
  const { values, functions } = useChangePasswordController()

  return (
    <div className="change-password-page">
      <PageHeader
        backTo={ROUTES.PROFILE}
        backLabel="Back to Profile"
        eyebrow="Security"
        title="Change Password"
        subtitle="Update your admin account password"
      />

      <motion.form
        className="change-password-form"
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

        <div className="change-password-form__fields">
          <Input
            label="Current Password"
            required
            type="password"
            placeholder="Enter current password"
            autoComplete="current-password"
            error={values.errors.old_password?.message}
            {...values.register('old_password')}
          />

          <Input
            label="New Password"
            required
            type="password"
            placeholder="Enter new password"
            autoComplete="new-password"
            error={values.errors.new_password?.message}
            {...values.register('new_password')}
          />

          <Input
            label="Confirm Password"
            required
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            error={values.errors.confirm_password?.message}
            {...values.register('confirm_password')}
          />
        </div>

        <div className="change-password-form__actions">
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

export default ChangePassword
