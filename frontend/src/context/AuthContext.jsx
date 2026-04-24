import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest } from '../services/authService'

const AuthContext = createContext(null)
const SESSION_KEY = 'flowledger_session'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const session = localStorage.getItem(SESSION_KEY)
		if (session) {
			try {
				setUser(JSON.parse(session))
			} catch {
				localStorage.removeItem(SESSION_KEY)
			}
		}
		setLoading(false)
	}, [])

	const login = async (email, password) => {
		try {
			const response = await loginRequest(email, password)
			if (response.success && response.user) {
				setUser(response.user)
				localStorage.setItem(SESSION_KEY, JSON.stringify(response.user))
				return { success: true }
			}

			return { success: false, message: response.message || 'Login failed' }
		} catch (error) {
			return { success: false, message: error.message || 'Unable to login. Please try again.' }
		}
	}

	const logout = () => {
		setUser(null)
		localStorage.removeItem(SESSION_KEY)
	}

	const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
