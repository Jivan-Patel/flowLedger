import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await signup(name, email, password)
    if (res.success) {
      navigate('/')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg">
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

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-container text-on-primary-container rounded-lg py-2 font-medium hover:bg-primary-container/90 transition-colors"
          >
            Sign Up
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
