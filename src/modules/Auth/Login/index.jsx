import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Checkbox from '@/components/Checkbox'
import Input from '@/components/Input'
import AuthLayout from '@/layouts/AuthLayout'
import { ROUTES } from '@/helpers/routes'
import useLoginController from './useLoginController'
import './Login.scss'

const field_variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * index, duration: 0.35 },
  }),
}

const Login = () => {
  const { values, functions } = useLoginController()

  return (
    <AuthLayout title="Log In" subtitle="Please log in to your admin account">
      <form className="login-form" onSubmit={functions.onSubmit} noValidate>
        <Alert
          type="error"
          message={values.root_error}
          onClose={functions.clearRootError}
        />

        <motion.div
          className="login-form__fields"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={field_variants} custom={1}>
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

          <motion.div variants={field_variants} custom={2}>
            <Input
              label="Password"
              required
              type="password"
              icon="lock"
              placeholder="Enter password"
              autoComplete="current-password"
              error={values.errors.password?.message}
              {...values.register('password')}
            />
          </motion.div>

          <motion.div className="login-form__row" variants={field_variants} custom={3}>
            <Checkbox
              label="Remember me"
              checked={values.remember_me}
              onChange={functions.toggleRememberMe}
            />
            <Link to={ROUTES.FORGOT_PASSWORD} className="login-form__forgot">
              Forgot Password?
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="login-form__actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
        >
          <Button type="submit" loading={values.isLoading}>
            Log In
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  )
}

export default Login
