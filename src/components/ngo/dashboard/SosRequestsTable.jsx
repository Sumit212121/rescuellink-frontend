export default function SosRequestsTable({ sosRequests, handleAcceptSos, handleRejectSos, showToast }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚨</span>
          <h3 className="font-bold text-slate-900 text-base">Urgent SOS Requests</h3>
          <span className="text-xs text-slate-400 font-medium">({sosRequests.length} pending)</span>
        </div>
        <span className="text-xs font-bold text-teal-700">Realtime Feed</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Disaster Type</th>
              <th className="px-6 py-3.5">Location</th>
              <th className="px-6 py-3.5 text-center">People</th>
              <th className="px-6 py-3.5">Distance</th>
              <th className="px-6 py-3.5">Priority</th>
              <th className="px-6 py-3.5">Time</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sosRequests.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                  No pending requests. All urgent SOS have been addressed!
                </td>
              </tr>
            ) : (
              sosRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span>{req.icon || '🚨'}</span>
                      <span className="text-slate-800 font-bold">{req.type || 'Flood'}</span>
                    </div>
                    {String(req.type || '').toLowerCase().includes('flood') && (
                      <span className="inline-block mt-0.5 text-[9px] font-extrabold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                        🌊 Flood Rescue Required
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{req.location}</td>
                  <td className="px-6 py-4 text-center font-extrabold text-slate-900">{req.people}</td>
                  <td className="px-6 py-4 text-teal-700 font-bold">{req.distance || '1.1 km'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        req.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                          : req.priority === 'High'
                          ? 'bg-orange-100 text-orange-700 border-orange-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}
                    >
                      {req.priority || 'High'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{req.time || 'Just now'}</td>
                  <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => showToast(`Displaying coordinate telemetry for #${req.id} at ${req.location}`)}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptSos(req)}
                      style={{ backgroundColor: '#0d9488', color: '#ffffff' }}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-extrabold text-xs shadow-md shadow-teal-900/20 inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>✓</span>
                      <span>Accept Request</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof handleRejectSos === 'function') handleRejectSos(req)
                        else showToast(`Dismissed ${req.id}`)
                      }}
                      className="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition cursor-pointer"
                      title="Dismiss from queue"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
