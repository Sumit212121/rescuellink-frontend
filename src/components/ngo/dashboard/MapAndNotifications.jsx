import LiveRescueMap from '../../common/LiveRescueMap'

export default function MapAndNotifications({ showToast, handleAcceptSos, sosRequests = [], activeRescues = [] }) {
  const primaryEmergency = sosRequests[0] || activeRescues[0]

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Live Emergency Map (8 Cols) */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${primaryEmergency ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></div>
            <h3 className="font-bold text-slate-900 text-base">Live Emergency Map</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {activeRescues.length + sosRequests.length} active
            </span>
          </div>
          <button
            onClick={() => showToast('Full-screen GPS GIS overlay active')}
            className="text-xs font-bold text-nordic-600 hover:text-nordic-700 flex items-center gap-1 group"
          >
            View Full Map <span className="group-hover:translate-x-0.5 transition">→</span>
          </button>
        </div>

        {/* Map Visual Canvas */}
        <div className="relative w-full h-[360px] rounded-xl overflow-hidden mt-4 border border-slate-200/80">
          <LiveRescueMap
            victimCoords={primaryEmergency ? {
              lat: primaryEmergency.coords?.lat || primaryEmergency.latitude || 25.6022,
              lng: primaryEmergency.coords?.lng || primaryEmergency.longitude || 85.1376,
              name: primaryEmergency.name || primaryEmergency.id,
              address: primaryEmergency.address || primaryEmergency.location,
              people: primaryEmergency.people,
            } : null}
            vehicleCoords={activeRescues[0] ? {
              lat: activeRescues[0].vehicle_lat || activeRescues[0].telemetry?.vehicle_location?.lat || (25.6022 + 0.005),
              lng: activeRescues[0].vehicle_lng || activeRescues[0].telemetry?.vehicle_location?.lng || (85.1376 + 0.01),
              label: activeRescues[0].vehicle || 'Ambulance AM-01',
            } : null}
            ngoCoords={{
              lat: 25.6022 + 0.0098,
              lng: 85.1376 + 0.0204,
              name: 'Operations Command Base',
            }}
            distanceKm={primaryEmergency?.distance_km || primaryEmergency?.distance}
            etaMins={primaryEmergency?.eta_mins || 15}
            height="360px"
            showLegend={true}
          />

          {/* Dynamic Incident Marker Floating Card if pending SOS */}
          {primaryEmergency && sosRequests.some(s => s.id === primaryEmergency.id) && (
            <div className="absolute top-4 right-4 z-[500] flex flex-col items-end animate-fade-in pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-rose-200 p-3 w-56">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-nordic-700">{primaryEmergency.id}</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                    {primaryEmergency.urgency || primaryEmergency.priority || 'Urgent'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {primaryEmergency.type || primaryEmergency.disaster} • {primaryEmergency.people} person(s)
                </p>
                <p className="text-[10px] text-slate-500 truncate">{primaryEmergency.address || primaryEmergency.location || 'Patna Sector'}</p>
                <button
                  onClick={() => handleAcceptSos(primaryEmergency)}
                  className="w-full mt-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition"
                >
                  Deploy Team Alpha
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Map Footer status */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Active Grid Sector: Patna Metropolitan (0-10 km Radius)</span>
          <span className="font-mono text-[11px] text-emerald-600 font-semibold">● Live Telemetry Synced</span>
        </div>
      </div>

      {/* Right: Live Activity Feed (4 Cols) */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base">🔔</span>
              <h3 className="font-bold text-slate-900 text-base">Real-time Feed</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {sosRequests.length === 0 && activeRescues.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <span className="text-2xl block mb-2">📡</span>
                No active signals right now.<br />New SOS distress calls will appear here immediately in real-time.
              </div>
            ) : (
              <>
                {sosRequests.map((req) => (
                  <div key={req.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      🚨
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">New Distress Alert: {req.id}</p>
                      <p className="text-[11px] text-slate-600 truncate">{req.name || 'Citizen'} ({req.people} people) • {req.type}</p>
                      <span className="text-[10px] text-rose-600 font-semibold">Awaiting Deployment</span>
                    </div>
                  </div>
                ))}
                {activeRescues.map((res) => (
                  <div key={res.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      🚤
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Operation Active: {res.id}</p>
                      <p className="text-[11px] text-slate-600 truncate">{res.volunteer || 'Team Alpha'} • {res.vehicle}</p>
                      <span className="text-[10px] text-blue-600 font-semibold">{res.status || 'Enroute'} (ETA: {res.eta})</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Real-time WebSocket/Polling Grid</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
    </section>
  )
}
