export default function AdminRecentSosTable({ sosList, showToast, onSelectSos }) {
  return (
    <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent SOS Requests</h2>
        <button
          onClick={() => showToast('Opening comprehensive live dispatch list')}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200/80">
            <tr>
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Disaster</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sosList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <span className="text-xl block mb-1">📡</span>
                  No SOS requests in database yet.<br />Live signals will appear here instantly in real-time.
                </td>
              </tr>
            ) : (
              sosList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/75 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{item.id}</td>
                  <td className="py-2.5 px-3">{item.type}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${item.priorityClass}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectSos ? onSelectSos(item) : showToast(`Monitoring #${item.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold border border-teal-200 text-[10px] transition shadow-2xs"
                    >
                      <span>🛰️</span>
                      <span>Monitor</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
