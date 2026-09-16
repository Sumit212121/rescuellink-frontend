export default function RecentUsersTable({ usersList, toggleUserStatus }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Users</h2>
        <span className="text-xs text-slate-400">Showing {usersList.length} of 1,250</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200/80">
            <tr>
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3">Phone</th>
              <th className="py-2.5 px-3">Role</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/75 transition">
                <td className="py-2.5 px-3 font-semibold text-slate-800">{u.id}</td>
                <td className="py-2.5 px-3 font-medium text-slate-900">{u.name}</td>
                <td className="py-2.5 px-3 text-slate-500">{u.phone}</td>
                <td className="py-2.5 px-3">{u.role}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      u.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className="px-2 py-1 text-[10px] font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                  >
                    {u.status === 'Active' ? 'Block' : 'Unblock'}
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
