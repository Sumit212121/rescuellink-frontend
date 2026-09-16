export default function NgoTopBar({
  searchQuery,
  setSearchQuery,
  showProfileMenu,
  setShowProfileMenu,
  ngoDisplayName,
  ngoEmail,
  setMobileMenuOpen,
  onLogout,
  setActiveTab,
  showToast,
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Mobile menu toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        <div className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-nordic-500 focus:ring-2 focus:ring-nordic-500/20 text-slate-800 placeholder-slate-400 transition"
            placeholder="Search requests, locations, volunteers..."
            type="text"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-medium bg-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded border border-slate-300/80">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Top Right Actions & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Notification Bell */}
        <button
          onClick={() => {
            setActiveTab('notifications')
            showToast('Viewing Emergency Broadcast & Telemetry Alerts')
          }}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 cursor-pointer group p-1 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-teal-500/30">
              {ngoDisplayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition">
                  {ngoDisplayName}
                </span>
                <svg className="w-3.5 h-3.5 text-emerald-500 fill-current" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block">Verified NGO</span>
            </div>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{ngoDisplayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{ngoEmail}</p>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); setActiveTab('profile') }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
              >
                <span>🏢</span> NGO Profile &amp; Documents
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); setActiveTab('settings') }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
              >
                <span>⚙️</span> Command Center Settings
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); onLogout() }}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold border-t border-slate-100 mt-1"
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
