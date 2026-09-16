export default function KpiCards({ sosRequests = [], activeRescues = [], rescueHistory = [] }) {
  const peopleHelped = rescueHistory.reduce(
    (sum, r) => sum + (parseInt(r.rescued_people_count || r.people || 0, 10)),
    0
  )

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Urgent Pending Requests */}
      <div className="card-tactile rounded-2xl p-5 motion-spring">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">Pending Dispatches</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">{sosRequests.length}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                sosRequests.length > 0
                  ? 'text-signal-700 bg-signal-50 border-signal-200 animate-pulse'
                  : 'text-slate-500 bg-slate-50 border-slate-200'
              }`}>
                {sosRequests.length > 0 ? `${sosRequests.length} URGENT` : 'ALL CLEAR'}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-signal-50 border border-signal-200 flex items-center justify-center text-signal-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 2: Active Rescues (En Route) */}
      <div className="card-tactile rounded-2xl p-5 motion-spring">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">Active In-Flight</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">{activeRescues.length}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                activeRescues.length > 0
                  ? 'text-opsAmber-700 bg-opsAmber-50 border-opsAmber-200'
                  : 'text-slate-500 bg-slate-50 border-slate-200'
              }`}>
                {activeRescues.length > 0 ? `${activeRescues.length} ACTIVE SQUADS` : 'STANDBY'}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-opsAmber-50 border border-opsAmber-200 flex items-center justify-center text-opsAmber-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 3: Civilians Rescued */}
      <div className="card-tactile rounded-2xl p-5 motion-spring">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">Civilians Extricated</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">{peopleHelped}</span>
              <span className="text-[10px] font-bold text-radarEmerald-800 bg-radarEmerald-50 px-2 py-0.5 rounded-full border border-radarEmerald-200">
                AUDITED LOGS
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-radarEmerald-50 border border-radarEmerald-200 flex items-center justify-center text-radarEmerald-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 4: Operations Completed */}
      <div className="card-tactile rounded-2xl p-5 motion-spring">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">Missions Resolved</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-900">{rescueHistory.length}</span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                CLOSED
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-base">
            ✓
          </div>
        </div>
      </div>
    </section>
  )
}
