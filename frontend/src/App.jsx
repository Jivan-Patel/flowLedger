import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'

function ProtectedRoute({ children }) {
	const { user, loading } = useAuth()
	if (loading) return null
	if (!user) return <Navigate to="/login" replace />
	return children
}

function PublicRoute({ children }) {
	const { user, loading } = useAuth()
	if (loading) return null
	if (user) return <Navigate to="/" replace />
	return children
}

function HomePage() {
	const { user, logout } = useAuth()

	return (
		<div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
			<div style={{ maxWidth: 780, margin: '0 auto', background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
				<h2 style={{ marginTop: 0 }}>Welcome, {user?.name || user?.email}</h2>
				<p style={{ color: '#4b5563' }}>
					Login is active in FlowLedger. Protected app pages can now be gated behind this session.
				</p>
				<button
					type="button"
					onClick={logout}
					style={{ border: 0, borderRadius: 8, padding: '10px 12px', background: '#111827', color: '#fff', cursor: 'pointer' }}
				>
					Logout
				</button>
			</div>
		</div>
	)
}

export default function App() {
	return (
		<Routes>
			<Route
				path="/login"
				element={(
					<PublicRoute>
						<Login />
					</PublicRoute>
				)}
			/>
			<Route
				path="/signup"
				element={(
					<PublicRoute>
						<Signup />
					</PublicRoute>
				)}
			/>
			<Route
				path="/"
				element={(
					<ProtectedRoute>
						<HomePage />
					</ProtectedRoute>
				)}
			/>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

