export default function AdminMetricsCards({ stats }) {
  const totalRequests = stats?.totalRequests ?? 0
  const totalNgos = stats?.registeredNgos ?? 0
  const activeSos = stats?.activeRescues ?? 0
  const resolvedCount = stats?.resolvedRescues ?? 0
  const peopleHelped = stats?.peopleHelped ?? 0

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Metric 1: Total CAD Distress Incidents */}
      <div className="card-tactile p-5 rounded-3xl flex items-center gap-4 motion-spring">
        <div className="w-13 h-13 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Distress Incidents</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{totalRequests}</span>
            <span className="inline-flex items-center text-[10px] font-bold text-radarEmerald-700 bg-radarEmerald-50 border border-radarEmerald-200 px-2 py-0.5 rounded-full">
              LIVE GRID
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified CAD incidents</p>
        </div>
      </div>

      {/* Metric 2: Registered Accredited NGOs */}
      <div className="card-tactile p-5 rounded-3xl flex items-center gap-4 motion-spring">
        <div className="w-13 h-13 rounded-2xl bg-radarEmerald-50 border border-radarEmerald-200 flex items-center justify-center text-radarEmerald-700 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Accredited Relief NGOs</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{totalNgos}</span>
            <span className="inline-flex items-center text-[10px] font-bold text-radarEmerald-700 bg-radarEmerald-50 border border-radarEmerald-200 px-2 py-0.5 rounded-full">
              VERIFIED
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active field response units</p>
        </div>
      </div>

      {/* Metric 3: Active Operations */}
      <div className="card-tactile p-5 rounded-3xl flex items-center gap-4 motion-spring">
        <div className="w-13 h-13 rounded-2xl bg-signal-50 border border-signal-200 flex items-center justify-center text-signal-600 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active Relief Operations</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{activeSos}</span>
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeSos > 0 ? 'text-signal-700 bg-signal-50 border-signal-200 animate-pulse' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
              {activeSos > 0 ? '● IN PROGRESS' : 'STANDBY'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">En route or extricating</p>
        </div>
      </div>

      {/* Metric 4: Rescues Resolved */}
      <div className="card-tactile p-5 rounded-3xl flex items-center gap-4 motion-spring">
        <div className="w-13 h-13 rounded-2xl bg-opsAmber-50 border border-opsAmber-200 flex items-center justify-center text-opsAmber-700 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Missions Resolved</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{resolvedCount}</span>
            <span className="inline-flex items-center text-[10px] font-bold text-radarEmerald-700 bg-radarEmerald-50 border border-radarEmerald-200 px-2 py-0.5 rounded-full">
              {peopleHelped} SAVED
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Safely evacuated &amp; logged</p>
        </div>
      </div>
    </section>
  )
}
