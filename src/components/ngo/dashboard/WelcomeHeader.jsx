export default function WelcomeHeader({
  ngoDisplayName,
  status,
  setStatus,
  showStatusMenu,
  setShowStatusMenu,
  showToast,
}) {
  return (
    <section
      className="text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border"
      style={{
        backgroundColor: '#080d1a',
        backgroundImage: 'linear-gradient(to right, #080d1a, #0f172a, #1e293b)',
        borderColor: '#1e293b',
        color: '#ffffff'
      }}
    >
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none"></div>
      <div className="relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2.5 border"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)', color: '#fda4af' }}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span>CAD FIELD RESPONSE CONSOLE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
          Welcome, {ngoDisplayName}
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#cbd5e1' }}>
          Automated disaster telemetry connected • Standby fleet ready
        </p>
      </div>

      {/* Status toggle badge and button */}
      <div className="relative z-10 flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold"
          style={{
            backgroundColor: status === 'Available' ? '#022c22' : status === 'Engaged' ? '#78350f' : '#1e293b',
            borderColor: status === 'Available' ? '#059669' : status === 'Engaged' ? '#d97706' : '#475569',
            color: status === 'Available' ? '#6ee7b7' : status === 'Engaged' ? '#fde68a' : '#cbd5e1'
          }}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'Available'
                ? 'bg-emerald-400 animate-pulse'
                : status === 'Engaged'
                ? 'bg-amber-400'
                : 'bg-slate-400'
            }`}
          ></span>
          {status}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition backdrop-blur-sm flex items-center gap-1.5 motion-press cursor-pointer"
          >
            <span>Change Status</span>
            <span className="text-[10px]">▾</span>
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs font-semibold">
              <button
                onClick={() => { setStatus('Available'); setShowStatusMenu(false); showToast('Status set to Available') }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
              </button>
              <button
                onClick={() => { setStatus('Engaged'); setShowStatusMenu(false); showToast('Status set to Engaged') }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Engaged (On Mission)
              </button>
              <button
                onClick={() => { setStatus('Offline'); setShowStatusMenu(false); showToast('Status set to Offline') }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-500 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Offline
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
