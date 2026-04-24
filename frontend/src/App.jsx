import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Invoices from './pages/Invoices'
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
						<Layout />
					</ProtectedRoute>
				)}
			>
				<Route index element={<Dashboard />} />
				<Route path="invoices" element={<Invoices />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

