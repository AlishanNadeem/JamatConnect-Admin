import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Input from '@/components/Input'
import AuthLayout from '@/layouts/AuthLayout'
import useForgotPasswordController from './useForgotPasswordController'
import './ForgotPassword.scss'

const ForgotPassword = () => {
  const { values, functions } = useForgotPasswordController()

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your admin email to receive a reset code"
    >
      <form className="forgot-form" onSubmit={functions.onSubmit} noValidate>
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Input
            label="Email Address"
            required
            type="email"
            icon="mail"
            placeholder="Enter email address"
            autoComplete="email"
            error={values.errors.email?.message}
            {...values.register('email')}
          />
        </motion.div>

        <div className="forgot-form__actions">
          <Button type="submit" loading={values.isLoading}>
            Send Reset Code
          </Button>
          <Button type="button" variant="ghost" onClick={functions.onBackToLogin}>
            Back to Log In
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
