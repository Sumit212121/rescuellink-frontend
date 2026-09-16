import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { apiGetSosHistory } from '../../services/api'

function HistoryArchiveIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ShieldCheckIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

export default function SosHistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    const loadHistory = async () => {
      try {
        const data = await apiGetSosHistory()
        if (isMounted) setHistory(data)
      } catch (err) {
        console.warn('Failed to load history:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadHistory()
    return () => { isMounted = false }
  }, [isOpen])

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6"
      style={{ zIndex: 10000, background: 'rgba(11,15,26,0.78)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[85vh]"
        style={{ animation: 'modalSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 to-tactical-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-signal-600/90 text-white flex items-center justify-center shadow-md">
              <HistoryArchiveIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">Citizen SOS Incident History</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                  CAD ARCHIVE
                </span>
              </div>
              <p className="text-xs text-slate-300">Verified record of emergency distress telemetry &amp; resolution audits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* List Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-topo-grid">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs font-semibold">
              Fetching verified distress records from national ledger...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-14 space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-radarEmerald-50 text-radarEmerald-600 border border-radarEmerald-200 flex items-center justify-center mx-auto text-2xl">
                <ShieldCheckIcon className="w-6 h-6 text-radarEmerald-600" />
              </div>
              <p className="text-sm font-black text-slate-800">No Past SOS Incidents Recorded</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Any distress signal transmitted from your device is logged with permanent tamper-evident audit logs and resolution reports.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white hover:border-slate-300 border border-slate-200 rounded-2xl transition space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">#{item.id} — {item.type || 'EMERGENCY RELIEF'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-radarEmerald-100 text-radarEmerald-800 border border-radarEmerald-200">
                    RESOLVED &amp; AUDITED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">TARGET LOCATION</span>
                    <span className="truncate block font-bold text-slate-800">{item.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">EXTRICATED</span>
                    <span className="font-bold text-radarEmerald-700">{item.rescued_people_count || item.people} Civilians</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">SQUAD UNIT</span>
                    <span className="font-bold text-slate-800">{item.matchedNgo?.name || 'Lions Club Relief Unit'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">TIMESTAMP</span>
                    <span className="font-medium text-slate-700">{item.resolved_at ? new Date(item.resolved_at).toLocaleDateString() : 'Today'}</span>
                  </div>
                </div>

                {item.resolution_notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mt-1">
                    <strong className="text-slate-800">Field Report: </strong>"{item.resolution_notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
