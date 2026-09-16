export default function ActiveRescuesTable({
  activeRescues,
  activeRescueId,
  setActiveRescueId,
  showToast,
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
          <h3 className="font-bold text-slate-900 text-base">Active Rescues & Mission Dispatch</h3>
        </div>
        <span className="text-xs font-bold text-teal-700">{activeRescues.length} Units Active</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Type</th>
              <th className="px-6 py-3.5">Location</th>
              <th className="px-6 py-3.5 text-center">People</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">ETA</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {activeRescues.map((rescue) => (
              <tr
                key={rescue.id}
                onClick={() => setActiveRescueId(rescue.id)}
                className={`cursor-pointer transition ${
                  activeRescueId === rescue.id ? 'bg-teal-50/60' : 'hover:bg-slate-50/60'
                }`}
              >
                <td className="px-6 py-4 font-bold text-teal-800">{rescue.id}</td>
                <td className="px-6 py-4 text-slate-700">{rescue.type}</td>
                <td className="px-6 py-4 text-slate-600">{rescue.location}</td>
                <td className="px-6 py-4 text-center font-bold text-slate-800">{rescue.people}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${rescue.statusClass}`}>
                    {rescue.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-semibold">{rescue.eta}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveRescueId(rescue.id)
                      showToast(`Focused live tracking for #${rescue.id}`)
                    }}
                    className="px-3.5 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer shadow-xs"
                  >
                    <span>🎯</span> Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
