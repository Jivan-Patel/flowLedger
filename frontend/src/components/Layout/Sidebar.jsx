import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/invoices', icon: 'receipt_long', label: 'Invoices' },
  { to: '/payments', icon: 'payments', label: 'Payments' },
  { to: '/cash-flow', icon: 'trending_up', label: 'Cash Flow' },
  { to: '/recurring', icon: 'history_toggle_off', label: 'Recurring' },
  { to: '/clients', icon: 'groups', label: 'Clients' },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 sidebar-link ${
      isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
    }`

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#060e20] shadow-[1px_0_0_0_rgba(255,255,255,0.05)] flex flex-col py-8 px-4 z-50 transition-colors duration-300">
      {/* Branding */}
      <div className="mb-10 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center transition-colors duration-300">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-primary transition-colors duration-300 sidebar-logo">FlowLedger</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 transition-colors duration-300">Financial Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-medium text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-8 border-t border-white/5 space-y-1 transition-colors duration-300">
        <NavLink to="/settings" className={linkClass}>
          <span className="material-symbols-outlined">settings</span>
          <span className="font-medium text-sm tracking-wide">Settings</span>
        </NavLink>
        <button onClick={logout} className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-error hover:bg-error/10 transition-all duration-300 sidebar-logout">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium text-sm tracking-wide">Sign out</span>
        </button>
      </div>
    </aside>
  )
}
