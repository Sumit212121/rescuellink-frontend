export default function RecentNgosTable({ ngosList, toggleNgoStatus }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent NGOs</h2>
        <span className="text-xs text-slate-400">Showing {ngosList.length} of 85</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200/80">
            <tr>
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">NGO Name</th>
              <th className="py-2.5 px-3">Specialization</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {ngosList.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50/75 transition">
                <td className="py-2.5 px-3 font-semibold text-slate-800">{n.id}</td>
                <td className="py-2.5 px-3 font-medium text-slate-900">{n.name}</td>
                <td className="py-2.5 px-3">{n.specialization}</td>
                <td className="py-2.5 px-3 text-slate-500">{n.location}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      n.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {n.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => toggleNgoStatus(n.id)}
                    className={`px-2 py-1 text-[10px] font-semibold rounded-md border transition ${
                      n.status === 'Verified'
                        ? 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100'
                        : 'border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {n.status === 'Verified' ? 'Revoke' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
