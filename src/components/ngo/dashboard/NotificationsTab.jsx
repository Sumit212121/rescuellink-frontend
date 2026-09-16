import { useState } from 'react'

const INITIAL_NOTIFICATIONS = [
  { id: 'NOTIF-01', type: 'urgent', title: 'New Critical SOS Request Dispatched', desc: 'Emergency broadcast received from Patna Riverside (3 individuals trapped).', time: 'Just now', icon: '🚨' },
  { id: 'NOTIF-02', type: 'info', title: 'Ambulance AM-01 Road Navigation Engaged', desc: 'OSRM street navigation waypoint routing loaded. ETA 7 mins.', time: '4 mins ago', icon: '🚑' },
  { id: 'NOTIF-03', type: 'success', title: 'Mission #SOS-442656 Extrication Completed', desc: 'Rescue Boat RB-04 successfully delivered 3 rescued citizens to relief camp.', time: '18 mins ago', icon: '✅' },
  { id: 'NOTIF-04', type: 'alert', title: 'High Water Level Warning: Ganga Sector 2', desc: 'Central Water Commission raised warning alert to Orange Level (+1.4m rise).', time: '42 mins ago', icon: '🌊' },
  { id: 'NOTIF-05', type: 'info', title: 'Squad Shift Handoff: Team Alpha Active', desc: '6 Certified rescue divers and 2 paramedics signed onto active CAD dispatch.', time: '1 hour ago', icon: '👥' },
  { id: 'NOTIF-06', type: 'success', title: 'New Relief Contribution Received', desc: '₹10,000 received for flood relief provisions & life jacket replenishment.', time: '2 hours ago', icon: '💰' },
]

export default function NotificationsTab({ showToast }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const clearAll = () => {
    setNotifications([])
    showToast('All notifications marked as read.')
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔔</span>
            <h2 className="text-xl font-black text-slate-900">Emergency Broadcast &amp; Telemetry Feed</h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {notifications.length} Unread Alerts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time CAD alerts, transponder telemetry alarms, volunteer check-ins and citizen SOS logs.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No unread notifications. All telemetry signals and alerts are clear.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
                  {n.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 block">⏱️ {n.time}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setNotifications(prev => prev.filter(x => x.id !== n.id))
                  showToast('Notification dismissed.')
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
