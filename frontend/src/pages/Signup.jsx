import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import SEO from '../components/SEO'

const signupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      const res = await signup(values.name, values.email, values.password)
      if (res.success) {
        toast.success('Account created successfully!')
        navigate('/')
      } else {
        toast.error(res.message)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg">
      <SEO
        title="Sign Up"
        description="Create a FlowLedger account to start managing invoices, tracking payments, and monitoring your business cash flow."
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glass-panel p-8 rounded-xl w-full max-w-md relative z-10 border border-outline-variant animate-fade-in glow-effect">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-on-surface mb-2 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">account_balance_wallet</span>
            FlowLedger
          </h1>
          <p className="text-on-surface-variant">Create your account</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Full Name</label>
            <input
              type="text"
              {...formik.getFieldProps('name')}
              className={`w-full bg-surface-container border rounded-lg px-4 py-2 text-on-surface focus:border-primary transition-colors ${
                formik.touched.name && formik.errors.name ? 'border-error' : 'border-outline-variant'
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-error text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

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

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Confirm Password</label>
            <input
              type="password"
              {...formik.getFieldProps('confirmPassword')}
              className={`w-full bg-surface-container border rounded-lg px-4 py-2 text-on-surface focus:border-primary transition-colors ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-error' : 'border-outline-variant'
              }`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-error text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-primary-container text-on-primary-container rounded-lg py-2 font-medium hover:bg-primary-container/90 transition-colors disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
