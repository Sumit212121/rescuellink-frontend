export default function AdminTopBar({
  setMobileMenuOpen,
  showToast,
  showProfileMenu,
  setShowProfileMenu,
  onLogout,
}) {
  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome, Admin</h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor and manage the disaster relief platform
          </p>
        </div>
      </div>

      {/* Header Actions: Notification & Profile */}
      <div className="flex items-center gap-4 self-end sm:self-auto relative">
        <button
          onClick={() => showToast('3 urgent platform notifications pending')}
          aria-label="Notifications"
          className="relative p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/70 rounded-full transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span className="absolute top-1 right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
            3
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-teal-500/20">
              A
            </div>
            <div className="hidden sm:flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-teal-700 transition">
              <span>Admin</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Administrator</p>
                <p className="text-[11px] text-slate-400">Level 4 Clearance</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
