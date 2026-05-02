import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'
import SEO from '../components/SEO'

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const res = await login(values.email, values.password)
      if (res.success) {
        navigate('/')
      } else {
        formik.setFieldError('submit', res.message)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg">
      <SEO
        title="Login"
        description="Sign in to your FlowLedger account to manage invoices, track payments, and monitor cash flow."
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glass-panel p-8 rounded-xl w-full max-w-md relative z-10 border border-outline-variant animate-fade-in glow-effect">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-on-surface mb-2 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">account_balance_wallet</span>
            FlowLedger
          </h1>
          <p className="text-on-surface-variant">Sign in to your account</p>
        </div>

        {formik.errors.submit && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
            {formik.errors.submit}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
            <input
              type="email"
              {...formik.getFieldProps('email')}
              className={`w-full bg-surface-container border rounded-lg px-4 py-2 text-on-surface focus:border-primary transition-colors ${
                formik.touched.email && formik.errors.email ? 'border-error' : 'border-outline-variant'
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-error text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Password</label>
            <input
              type="password"
              {...formik.getFieldProps('password')}
              className={`w-full bg-surface-container border rounded-lg px-4 py-2 text-on-surface focus:border-primary transition-colors ${
                formik.touched.password && formik.errors.password ? 'border-error' : 'border-outline-variant'
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-error text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-primary-container text-on-primary-container rounded-lg py-2 font-medium hover:bg-primary-container/90 transition-colors disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
