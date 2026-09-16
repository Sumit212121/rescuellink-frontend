export default function AdminSidebar({
  activeNav,
  setActiveNav,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
}) {
  return (
    <aside
      className={`w-full lg:w-64 bg-[#0d1527] text-slate-300 flex-shrink-0 flex flex-col justify-between p-4 h-full overflow-y-auto border-r border-slate-800 fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        {/* Platform Branding & Logo */}
        <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-900/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                Disaster Relief
              </h1>
              <span className="text-xs text-teal-400 font-medium tracking-wide">
                Admin Panel
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" className="space-y-1.5">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActiveNav('dashboard')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold transition-all duration-150 text-left ${
              activeNav === 'dashboard'
                ? 'bg-[#0d9488] text-white shadow-md shadow-teal-950/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm">Dashboard</span>
          </button>

          {/* Users */}
          <button
            onClick={() => {
              setActiveNav('users')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-left ${
              activeNav === 'users'
                ? 'bg-[#0d9488] text-white shadow-md shadow-teal-950/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm">Users</span>
          </button>

          {/* NGOs */}
          <button
            onClick={() => {
              setActiveNav('ngos')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-left ${
              activeNav === 'ngos'
                ? 'bg-[#0d9488] text-white shadow-md shadow-teal-950/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm">NGOs</span>
          </button>

          {/* SOS Requests */}
          <button
            onClick={() => {
              setActiveNav('sos')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-left ${
              activeNav === 'sos'
                ? 'bg-[#0d9488] text-white shadow-md shadow-teal-950/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm">SOS Requests</span>
          </button>

          {/* Donations */}
          <button
            onClick={() => {
              setActiveNav('donations')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-left ${
              activeNav === 'donations'
                ? 'bg-[#0d9488] text-white shadow-md shadow-teal-950/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm">Donations</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              setActiveNav('settings')
              setMobileMenuOpen(false)
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 text-left ${
              activeNav === 'settings'
                ? 'bg-[#0d9488] text-white shadow-md shadow-teal-950/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="text-sm">Settings</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Bottom Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 text-sm font-medium transition duration-150"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
