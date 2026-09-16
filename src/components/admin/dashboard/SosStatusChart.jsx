export default function SosStatusChart() {
  return (
    <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
      <h2 className="text-base font-bold text-slate-900 tracking-tight">SOS Requests Status</h2>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
        <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" fill="transparent" r="45" stroke="#f1f5f9" strokeWidth="18" />
            {/* Resolved (124/146) */}
            <circle
              cx="60"
              cy="60"
              fill="transparent"
              r="45"
              stroke="#0d9488"
              strokeDasharray="240.2 282.7"
              strokeDashoffset="0"
              strokeWidth="18"
            />
            {/* Pending (12/146) */}
            <circle
              cx="60"
              cy="60"
              fill="transparent"
              r="45"
              stroke="#f59e0b"
              strokeDasharray="23.2 282.7"
              strokeDashoffset="-240.2"
              strokeWidth="18"
            />
            {/* Accepted (6/146) */}
            <circle
              cx="60"
              cy="60"
              fill="transparent"
              r="45"
              stroke="#3b82f6"
              strokeDasharray="11.6 282.7"
              strokeDashoffset="-263.4"
              strokeWidth="18"
            />
            {/* Enroute (4/146) */}
            <circle
              cx="60"
              cy="60"
              fill="transparent"
              r="45"
              stroke="#6366f1"
              strokeDasharray="7.7 282.7"
              strokeDashoffset="-275.0"
              strokeWidth="18"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-slate-800 leading-none">146</span>
            <span className="text-xs text-slate-400 font-medium mt-1">Total</span>
          </div>
        </div>

        <div className="space-y-2.5 w-full sm:w-auto text-xs font-medium">
          <div className="flex items-center justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Pending</span>
            </div>
            <span className="font-bold text-slate-900">12</span>
          </div>
          <div className="flex items-center justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-slate-600">Accepted</span>
            </div>
            <span className="font-bold text-slate-900">6</span>
          </div>
          <div className="flex items-center justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-slate-600">Enroute</span>
            </div>
            <span className="font-bold text-slate-900">4</span>
          </div>
          <div className="flex items-center justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600"></span>
              <span className="text-slate-600">Resolved</span>
            </div>
            <span className="font-bold text-slate-900">124</span>
          </div>
        </div>
      </div>
    </div>
  )
}
