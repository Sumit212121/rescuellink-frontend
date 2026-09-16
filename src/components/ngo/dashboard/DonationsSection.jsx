export default function DonationsSection({ showToast }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Donations Overview (7 Cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base">🪙</span>
              <h3 className="font-bold text-slate-900 text-base">Donations Overview</h3>
            </div>
            <button
              onClick={() => showToast('Downloading complete donation receipts ledger...')}
              className="text-xs font-bold text-nordic-600 hover:text-nordic-700 flex items-center gap-1 group"
            >
              View All <span className="group-hover:translate-x-0.5 transition">→</span>
            </button>
          </div>

          {/* 4 Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/70">
              <span className="text-[10px] font-bold text-emerald-700 block">● Received</span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">₹2,45,000</span>
              <span className="text-[9px] text-slate-400">Total Received</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100/70">
              <span className="text-[10px] font-bold text-blue-700 block">● Donors</span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">326</span>
              <span className="text-[9px] text-slate-400">Total Donors</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100/70">
              <span className="text-[10px] font-bold text-purple-700 block">● Monthly</span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">₹1,20,000</span>
              <span className="text-[9px] text-slate-400">This Month</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100/70">
              <span className="text-[10px] font-bold text-rose-700 block">● Used</span>
              <span className="text-base font-extrabold text-slate-900 block mt-0.5">₹1,80,000</span>
              <span className="text-[9px] text-slate-400">Funds Used</span>
            </div>
          </div>

          {/* Recent Donations Sub-Table */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Donations</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 font-semibold border-b border-slate-100 text-[10px] uppercase">
                  <tr>
                    <th className="py-2">Donor</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Method</th>
                    <th className="py-2">Date</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {[
                    { donor: 'Ravi Kumar',  amount: '₹5,000',  method: 'UPI',         date: '2 hours ago' },
                    { donor: 'Priya Sharma', amount: '₹2,000', method: 'Razorpay',    date: '5 hours ago' },
                    { donor: 'Anil Kumar',  amount: '₹10,000', method: 'Net Banking', date: '1 day ago' },
                    { donor: 'Sneha Patel', amount: '₹1,500',  method: 'Paytm',       date: '1 day ago' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-bold text-slate-800">{row.donor}</td>
                      <td className="py-2.5 font-bold text-slate-900">{row.amount}</td>
                      <td className="py-2.5 text-slate-500">{row.method}</td>
                      <td className="py-2.5 text-slate-400">{row.date}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
                          Success
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Fund Usage Summary Donut (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-nordic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <h3 className="font-bold text-slate-900 text-base">Fund Usage Summary</h3>
            </div>
            <span className="text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg">
              This Month ▾
            </span>
          </div>

          {/* Donut Chart & Legend Visual */}
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeDasharray="28, 100" strokeWidth="4.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0d9488" strokeDasharray="22, 100" strokeDashoffset="-28" strokeWidth="4.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeDasharray="17, 100" strokeDashoffset="-50" strokeWidth="4.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f43f5e" strokeDasharray="14, 100" strokeDashoffset="-67" strokeWidth="4.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeDasharray="11, 100" strokeDashoffset="-81" strokeWidth="4.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#94a3b8" strokeDasharray="8, 100" strokeDashoffset="-92" strokeWidth="4.5" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs font-black text-slate-900 leading-none">₹1,80,000</span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Total Spent</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="flex-1 w-full space-y-1.5 text-xs">
              {[
                { color: 'bg-blue-600',   label: 'Food Kits',    amount: '₹50,000', pct: '28%' },
                { color: 'bg-teal-600',   label: 'Medicine',     amount: '₹40,000', pct: '22%' },
                { color: 'bg-amber-500',  label: 'Transport',    amount: '₹30,000', pct: '17%' },
                { color: 'bg-rose-500',   label: 'Shelter',      amount: '₹25,000', pct: '14%' },
                { color: 'bg-purple-500', label: 'Rescue Equip', amount: '₹20,000', pct: '11%' },
                { color: 'bg-slate-400',  label: 'Others',       amount: '₹15,000', pct: '8%'  },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`}></span>
                    <span className="text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {item.amount} <span className="text-slate-400 font-normal text-[11px]">({item.pct})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Detailed Report Button */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={() => showToast('Full financial audit exported to PDF report')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 transition"
          >
            View Detailed Report
          </button>
        </div>
      </div>
    </section>
  )
}
