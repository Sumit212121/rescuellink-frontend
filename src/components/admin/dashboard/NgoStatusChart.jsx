export default function NgoStatusChart() {
  return (
    <div className="lg:col-span-3 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
      <h2 className="text-base font-bold text-slate-900 tracking-tight">NGO Verification Status</h2>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
        <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" fill="transparent" r="45" stroke="#f1f5f9" strokeWidth="18" />
            {/* Verified 72/85 */}
            <circle
              cx="60"
              cy="60"
              fill="transparent"
              r="45"
              stroke="#10b981"
              strokeDasharray="239.5 282.7"
              strokeDashoffset="0"
              strokeWidth="18"
            />
            {/* Pending 10/85 */}
            <circle
              cx="60"
              cy="60"
              fill="transparent"
              r="45"
              stroke="#f59e0b"
              strokeDasharray="33.2 282.7"
              strokeDashoffset="-239.5"
              strokeWidth="18"
            />
            {/* Blocked 3/85 */}
            <circle
              cx="60"
              cy="60"
              fill="transparent"
              r="45"
              stroke="#f43f5e"
              strokeDasharray="10.0 282.7"
              strokeDashoffset="-272.7"
              strokeWidth="18"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-slate-800 leading-none">85</span>
            <span className="text-xs text-slate-400 font-medium mt-1">Total</span>
          </div>
        </div>

        <div className="space-y-2.5 w-full sm:w-auto text-xs font-medium">
          <div className="flex items-center justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Verified</span>
            </div>
            <span className="font-bold text-slate-900">72</span>
          </div>
          <div className="flex items-center justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Pending</span>
            </div>
            <span className="font-bold text-slate-900">10</span>
          </div>
          <div className="flex items-center justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Blocked</span>
            </div>
            <span className="font-bold text-slate-900">3</span>
          </div>
        </div>
      </div>
    </div>
  )
}
