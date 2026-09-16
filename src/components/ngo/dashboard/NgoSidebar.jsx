export default function NgoSidebar({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  sosRequests = [],
  activeRescues = [],
  onLogout,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'sos',
      label: 'SOS Requests',
      badge: sosRequests.length,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: (
        <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'rescues',
      label: 'Active Rescues',
      badge: activeRescues.length,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      icon: (
        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'map',
      label: 'Live Map',
      icon: (
        <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'volunteers',
      label: 'Volunteers',
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'donations',
      label: 'Donations',
      icon: (
        <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      badge: 5,
      badgeColor: 'bg-rose-500 text-white',
      icon: (
        <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'NGO Profile',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
  ]

  return (
    <aside
      style={{ backgroundColor: '#0b1120', color: '#cbd5e1' }}
      className={`w-64 bg-[#0b1120] text-slate-200 flex flex-col justify-between shrink-0 border-r border-slate-800 shadow-2xl fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:static lg:translate-x-0 h-full overflow-y-auto ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25 text-white font-bold text-lg">
              🚑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Rescue<span className="text-teal-400">Link</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">
                Together for a Safer Tomorrow
              </p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-lg shadow-teal-950/60 ring-1 ring-white/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Card: Mission Status & Logout */}
      <div className="p-3 m-3 space-y-2">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-nordic-500/20 text-nordic-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Disaster Relief</h4>
              <p className="text-[10px] text-slate-400">Nordic Relief Hub</p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3 bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 text-slate-400 rounded-xl text-xs font-semibold border border-slate-700/50 flex items-center justify-center gap-2 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            />
          </svg>
          <span>Exit to Landing Page</span>
        </button>
      </div>
    </aside>
  )
}
