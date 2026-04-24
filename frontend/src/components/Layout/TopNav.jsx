import { useAuth } from '../../context/AuthContext'

export default function TopNav() {
  const { user } = useAuth()
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-[#0b1326]/80 backdrop-blur-xl flex items-center justify-between px-8">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="w-full bg-surface-high/50 border-none rounded-lg pl-10 text-sm focus:ring-1 focus:ring-[#2563eb]/40 placeholder:text-on-surface-variant/50 py-2 pr-4"
            placeholder="Search ledger entries..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-px bg-white/10"></div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface">{user?.name || 'User'}</p>
            <p className="text-[10px] text-on-surface-variant">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full ring-2 ring-primary-container/30 bg-primary-container flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
