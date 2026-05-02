import { createContext, useContext, useEffect, useState, useMemo } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'flowledger_theme'

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		// Check localStorage first
		const saved = localStorage.getItem(THEME_KEY)
		if (saved) {
			return saved
		}
		// Fall back to system preference
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		return prefersDark ? 'dark' : 'light'
	})

	// Apply theme to document
	useEffect(() => {
		const html = document.documentElement
		if (theme === 'light') {
			html.setAttribute('data-theme', 'light')
		} else {
			html.removeAttribute('data-theme')
		}
		localStorage.setItem(THEME_KEY, theme)
	}, [theme])

	const toggleTheme = () => {
		setTheme(prev => prev === 'light' ? 'dark' : 'light')
	}

	const value = useMemo(() => ({ theme, toggleTheme }), [theme])

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}
