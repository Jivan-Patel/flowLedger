import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import SEO from '../components/SEO'
import api from '../services/api'

export default function Settings() {
	const { user, logout } = useAuth()
	const { theme, toggleTheme } = useTheme()
	const [activeTab, setActiveTab] = useState('profile')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState({ type: '', text: '' })
	
	// Profile form state
	const [profileForm, setProfileForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
	})

	// Password form state
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})

	// Balance threshold state
	const [balanceThreshold, setBalanceThreshold] = useState(user?.settings?.balanceThreshold || 10000)

	const handleProfileChange = (e) => {
		const { name, value } = e.target
		setProfileForm(prev => ({ ...prev, [name]: value }))
	}

	const handlePasswordChange = (e) => {
		const { name, value } = e.target
		setPasswordForm(prev => ({ ...prev, [name]: value }))
	}

	const handleBalanceThresholdChange = async (e) => {
		const newThreshold = parseFloat(e.target.value) || 0
		setBalanceThreshold(newThreshold)
		setLoading(true)
		setMessage({ type: '', text: '' })

		try {
			// TODO: Implement backend endpoint: PUT /api/auth/settings
			setMessage({ type: 'info', text: 'Settings saved locally - backend synchronization coming soon' })
		} catch (error) {
			setMessage({ type: 'error', text: 'Failed to update settings' })
		} finally {
			setLoading(false)
		}
	}

	const handleProfileSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setMessage({ type: '', text: '' })

		try {
			// TODO: Implement backend endpoint: PUT /api/auth/profile
			setMessage({ type: 'info', text: 'Profile update feature coming soon - backend endpoint not yet implemented' })
		} catch (error) {
			setMessage({ type: 'error', text: 'Failed to update profile' })
		} finally {
			setLoading(false)
		}
	}
		} catch (error) {
			setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' })
		} finally {
			setLoading(false)
		}
	}

	const handlePasswordSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setMessage({ type: '', text: '' })

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setMessage({ type: 'error', text: 'New passwords do not match' })
			setLoading(false)
			return
		}

		if (passwordForm.newPassword.length < 6) {
			setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
			setLoading(false)
			return
		}

		try {
			// TODO: Implement backend endpoint: PUT /api/auth/password
			setMessage({ type: 'info', text: 'Password change feature coming soon - backend endpoint not yet implemented' })
			setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
		} catch (error) {
			setMessage({ type: 'error', text: 'Failed to change password' })
		} finally {
			setLoading(false)
		}
	}

	const handleLogoutAll = async () => {
		if (confirm('Are you sure? You will be logged out from all devices.')) {
			logout()
		}
	}

	return (
		<div className="space-y-8 animate-fade-in pb-12">
			<SEO
				title="Settings"
				description="Manage your account settings, profile information, and security preferences."
			/>

			{/* Header */}
			<div>
				<p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1">Account</p>
				<h2 className="text-3xl font-bold tracking-tight">Settings</h2>
			</div>

			{/* Message Alert */}
			{message.text && (
				<div className={`p-4 rounded-lg text-sm font-medium ${
					message.type === 'success' 
						? 'bg-green-500/10 text-green-400 border border-green-500/20' 
						: 'bg-error-container/20 text-error border border-error/20'
				}`}>
					{message.text}
				</div>
			)}

			{/* Tabs */}
			<div className="flex gap-2 border-b border-outline-variant/20">
				<button
					onClick={() => setActiveTab('profile')}
					className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
						activeTab === 'profile'
							? 'border-primary text-primary'
							: 'border-transparent text-on-surface-variant hover:text-on-surface'
					}`}
				>
					Profile
				</button>
				<button
					onClick={() => setActiveTab('security')}
					className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
						activeTab === 'security'
							? 'border-primary text-primary'
							: 'border-transparent text-on-surface-variant hover:text-on-surface'
					}`}
				>
					Security
				</button>
				<button
					onClick={() => setActiveTab('preferences')}
					className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
						activeTab === 'preferences'
							? 'border-primary text-primary'
							: 'border-transparent text-on-surface-variant hover:text-on-surface'
					}`}
				>
					Preferences
				</button>
			</div>

			{/* Profile Tab */}
			{activeTab === 'profile' && (
				<div className="max-w-2xl">
					<div className="bg-surface-low rounded-xl border border-outline-variant/10 p-6 space-y-6">
						<div>
							<h3 className="text-lg font-bold text-on-surface mb-4">Profile Information</h3>
							<form onSubmit={handleProfileSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-on-surface-variant mb-2">
										Full Name
									</label>
									<input
										type="text"
										name="name"
										value={profileForm.name}
										onChange={handleProfileChange}
										className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/40 transition-colors"
										placeholder="Enter your full name"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-on-surface-variant mb-2">
										Email Address
									</label>
									<input
										type="email"
										name="email"
										value={profileForm.email}
										onChange={handleProfileChange}
										className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/40 transition-colors"
										placeholder="Enter your email"
									/>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full bg-primary-container text-on-primary-container font-bold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? 'Saving...' : 'Save Changes'}
								</button>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Security Tab */}
			{activeTab === 'security' && (
				<div className="max-w-2xl space-y-6">
					{/* Change Password */}
					<div className="bg-surface-low rounded-xl border border-outline-variant/10 p-6 space-y-6">
						<div>
							<h3 className="text-lg font-bold text-on-surface mb-4">Change Password</h3>
							<form onSubmit={handlePasswordSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-on-surface-variant mb-2">
										Current Password
									</label>
									<input
										type="password"
										name="currentPassword"
										value={passwordForm.currentPassword}
										onChange={handlePasswordChange}
										className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/40 transition-colors"
										placeholder="Enter current password"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-on-surface-variant mb-2">
										New Password
									</label>
									<input
										type="password"
										name="newPassword"
										value={passwordForm.newPassword}
										onChange={handlePasswordChange}
										className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/40 transition-colors"
										placeholder="Enter new password"
										required
									/>
									<p className="text-xs text-on-surface-variant/60 mt-1">
										Must be at least 6 characters long
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-on-surface-variant mb-2">
										Confirm New Password
									</label>
									<input
										type="password"
										name="confirmPassword"
										value={passwordForm.confirmPassword}
										onChange={handlePasswordChange}
										className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/40 transition-colors"
										placeholder="Confirm new password"
										required
									/>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full bg-primary-container text-on-primary-container font-bold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? 'Updating...' : 'Update Password'}
								</button>
							</form>
						</div>
					</div>

					{/* Session Management */}
					<div className="bg-surface-low rounded-xl border border-outline-variant/10 p-6">
						<h3 className="text-lg font-bold text-on-surface mb-4">Session Management</h3>
						<p className="text-sm text-on-surface-variant mb-4">
							Log out from all devices and terminate all active sessions.
						</p>
						<button
							onClick={handleLogoutAll}
							className="w-full bg-error/10 text-error font-bold py-2.5 rounded-lg hover:bg-error/20 active:scale-[0.98] transition-all border border-error/20"
						>
							Log Out from All Devices
						</button>
					</div>
				</div>
			)}

			{/* Preferences Tab */}
			{activeTab === 'preferences' && (
				<div className="max-w-2xl">
					<div className="bg-surface-low rounded-xl border border-outline-variant/10 p-6 space-y-6">
						<div>
							<h3 className="text-lg font-bold text-on-surface mb-4">Display Preferences</h3>

							{/* Theme Toggle */}
							<div className="flex items-center justify-between p-4 rounded-lg bg-surface-high/50 border border-outline-variant/10">
								<div>
									<p className="text-sm font-medium text-on-surface">Theme</p>
									<p className="text-xs text-on-surface-variant">
										Current: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
									</p>
								</div>
								<button
									onClick={toggleTheme}
									className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
								>
									{theme === 'light' ? (
										<>
											<span className="material-symbols-outlined text-lg">dark_mode</span>
											Switch to Dark
										</>
									) : (
										<>
											<span className="material-symbols-outlined text-lg">light_mode</span>
											Switch to Light
										</>
									)}
								</button>
							</div>
						</div>

						{/* Balance Settings */}
						<div>
							<h3 className="text-lg font-bold text-on-surface mb-4">Alert Settings</h3>
							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-on-surface-variant mb-2">
										Minimum Balance Threshold
									</label>
									<input
										type="number"
										value={balanceThreshold}
										onChange={handleBalanceThresholdChange}
										className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:ring-1 focus:ring-primary/40 transition-colors"
										placeholder="Enter threshold amount"
										min="0"
										step="1000"
										disabled={loading}
									/>
									<p className="text-xs text-on-surface-variant/60 mt-1">
										You'll receive an alert when your balance falls below this amount
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Account Info Card */}
			<div className="max-w-2xl bg-surface-low rounded-xl border border-outline-variant/10 p-6">
				<h3 className="text-lg font-bold text-on-surface mb-4">Account Information</h3>
				<div className="space-y-3 text-sm">
					<div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
						<span className="text-on-surface-variant">Email</span>
						<span className="text-on-surface font-medium">{user?.email}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
						<span className="text-on-surface-variant">Account Status</span>
						<span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold">
							Active
						</span>
					</div>
					<div className="flex justify-between items-center py-2">
						<span className="text-on-surface-variant">Member Since</span>
						<span className="text-on-surface font-medium">
							{new Date().toLocaleDateString('en-IN')}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
