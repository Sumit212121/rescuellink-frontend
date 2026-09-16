import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { apiGetSosTracking, getRescueWebSocketUrl } from '../../services/api'
import LiveRescueMap from '../common/LiveRescueMap'

/* ─── Vector Lifecycle Icons ────────────────────────────────── */
function RadarPulseIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

function SquadAssignedIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function InTransitIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function OnSitePinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function VerifiedShieldIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

const LIFECYCLE_STEPS = [
  { key: 'pending', label: 'Transmitted', icon: RadarPulseIcon },
  { key: 'accepted', label: 'Squad Matched', icon: SquadAssignedIcon },
  { key: 'dispatched', label: 'En Route', icon: InTransitIcon },
  { key: 'arrived', label: 'On Scene', icon: OnSitePinIcon },
  { key: 'resolved', label: 'Extricated', icon: VerifiedShieldIcon },
]

export default function RescueTrackingModal({ isOpen, onClose, sosId, initialEmergency = null }) {
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState('live')
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const timer = setInterval(() => {
      setSecondsAgo(Math.max(0, Math.floor((new Date() - lastUpdated) / 1000)))
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen, lastUpdated])

  useEffect(() => {
    if (!isOpen || !sosId) return
    let isMounted = true

    const fetchInitialData = async () => {
      try {
        const data = await apiGetSosTracking(sosId)
        if (data && isMounted) {
          setTrackingData(data)
          setLastUpdated(new Date())
        }
      } catch (err) {
        console.warn('Initial tracking fetch notice:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchInitialData()

    const connectWebSocket = () => {
      if (!isMounted) return

      try {
        const wsUrl = getRescueWebSocketUrl(sosId)
        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
          if (!isMounted) return
          setConnectionStatus('live')
        }

        ws.onmessage = (event) => {
          if (!isMounted) return
          try {
            const data = JSON.parse(event.data)

            if (data.type === 'tracking_init') {
              setTrackingData(prev => ({
                ...prev,
                ...data,
                telemetry: data.telemetry || prev?.telemetry,
                emergency: data.emergency || prev?.emergency
              }))
              setLastUpdated(new Date())
            } else if (data.type === 'vehicle_location') {
              setTrackingData(prev => {
                const updatedTelemetry = {
                  ...(prev?.telemetry || {}),
                  vehicle_location: {
                    lat: data.latitude,
                    lng: data.longitude,
                    accuracy: data.accuracy,
                    label: data.vehicle_id || prev?.telemetry?.vehicle_location?.label || 'Rescue Boat RB-04'
                  },
                  distance: data.distance_km ? `${data.distance_km}` : prev?.telemetry?.distance,
                  distance_km: data.distance_km || prev?.telemetry?.distance_km,
                  eta: data.eta !== undefined ? data.eta : prev?.telemetry?.eta,
                  status: data.status || prev?.status,
                  vehicle_accuracy: data.accuracy,
                  vehicle_updated_at: data.timestamp
                }
                return {
                  ...(prev || {}),
                  status: data.status || prev?.status,
                  telemetry: updatedTelemetry,
                  emergency: {
                    ...(prev?.emergency || {}),
                    status: data.status || prev?.emergency?.status,
                    vehicle_lat: data.latitude,
                    vehicle_lng: data.longitude,
                    vehicle_accuracy: data.accuracy,
                    vehicle_updated_at: data.timestamp,
                    distance: `${data.distance_km} km`,
                    distance_km: data.distance_km,
                    eta_mins: data.eta,
                    eta: `${data.eta} mins`
                  }
                }
              })
              setLastUpdated(new Date())
            } else if (data.type === 'rescue_status') {
              setTrackingData(prev => ({
                ...(prev || {}),
                status: data.status,
                emergency: data.emergency || { ...(prev?.emergency || {}), status: data.status }
              }))
              setLastUpdated(new Date())
            }
          } catch (e) {
            console.warn('WebSocket message parse error:', e)
          }
        }

        ws.onerror = () => {
          if (!isMounted) return
          setConnectionStatus('reconnecting')
        }

        ws.onclose = () => {
          if (!isMounted) return
          setConnectionStatus('reconnecting')
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) connectWebSocket()
          }, 3000)
        }
      } catch (err) {
        console.warn('WebSocket init exception:', err)
        setConnectionStatus('reconnecting')
      }
    }

    connectWebSocket()

    const backupInterval = setInterval(async () => {
      if (!isMounted) return
      try {
        const data = await apiGetSosTracking(sosId)
        if (data && isMounted) {
          setTrackingData(prev => ({
            ...prev,
            ...data,
            telemetry: data.telemetry || prev?.telemetry,
            emergency: data.emergency || prev?.emergency
          }))
        }
      } catch (e) {}
    }, 4000)

    return () => {
      isMounted = false
      clearInterval(backupInterval)
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [isOpen, sosId])

  if (!isOpen) return null

  const em = trackingData?.emergency || initialEmergency || {}
  const telemetry = trackingData?.telemetry || em.telemetry || {}
  const status = (trackingData?.status || em.status || 'pending').toLowerCase()

  const stepIndex =
    status === 'resolved' ? 4 :
    status === 'arrived' || status === 'rescue_in_progress' ? 3 :
    status === 'dispatched' || status === 'on_the_way' ? 2 :
    status === 'accepted' || status === 'assigned' ? 1 : 0

  const ngoName = em.matchedNgo?.name || em.rescue_ngo || 'National Disaster Relief Unit'
  const ngoPhone = em.matchedNgo?.phone || '+91 98765 00000'
  const rawVehicle = em.vehicle || em.rescue_vehicle || 'Ambulance AM-01'
  const isBoat = rawVehicle.toLowerCase().includes('boat') || rawVehicle.toLowerCase().includes('rb')
  const vehicle = !isBoat && !rawVehicle.toLowerCase().includes('ambulance') ? `Ambulance (${rawVehicle})` : rawVehicle
  const rescueTeam = em.rescue_team || 'Emergency Medical Squad'
  const distanceKm = telemetry.distance || em.distance || '3.5'
  const etaMins = telemetry.eta !== undefined ? telemetry.eta : (em.eta_mins !== undefined ? em.eta_mins : 15)

  const victimCoords = {
    lat: em.coords?.lat || em.latitude || 25.6022,
    lng: em.coords?.lng || em.longitude || 85.1376,
    name: em.name || 'Citizen Reporter',
    address: em.address || 'Patna Riverside, Bihar',
    people: em.people || 3,
    accuracy: em.location_accuracy || 10,
  }

  const vehicleCoords = {
    lat: telemetry.vehicle_location?.lat || em.vehicle_lat || (victimCoords.lat + 0.0098),
    lng: telemetry.vehicle_location?.lng || em.vehicle_lng || (victimCoords.lng + 0.0204),
    label: vehicle,
    accuracy: telemetry.vehicle_accuracy || em.vehicle_accuracy || 5,
  }

  const ngoCoords = {
    lat: telemetry.ngo_location?.lat || (victimCoords.lat + 0.0098),
    lng: telemetry.ngo_location?.lng || (victimCoords.lng + 0.0204),
    name: ngoName,
    address: em.matchedNgo?.address || 'Relief Command Station',
    phone: ngoPhone,
  }

  const isLocationStale = secondsAgo >= 30 && status !== 'resolved'

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6"
      style={{ zIndex: 10000, background: 'rgba(11, 15, 25, 0.78)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[92vh]"
        style={{ animation: 'modalSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-tactical-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-signal-600 text-white flex items-center justify-center shadow-md shadow-signal-600/30">
              <RadarPulseIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight text-white">
                  Tactical CAD Emergency Radar
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-signal-500/20 text-signal-300 border border-signal-500/30">
                  #{sosId}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {connectionStatus === 'live' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-radarEmerald-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-radarEmerald-400 animate-pulse" />
                    Continuous Telemetry Stream
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-opsAmber-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-opsAmber-400 animate-ping" />
                    Reconnecting telemetry...
                  </span>
                )}
                <span className="text-[11px] text-slate-400">
                  • Sync {secondsAgo === 0 ? 'instant' : `${secondsAgo}s ago`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-topo-grid flex-1">
          {/* Status Stepper */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0 rounded-full" />
              <div
                className="absolute top-4 left-6 h-1 bg-gradient-to-r from-signal-500 to-radarEmerald-500 -z-0 transition-all duration-500 rounded-full"
                style={{ width: `${(stepIndex / 4) * 85}%` }}
              />
              {LIFECYCLE_STEPS.map((s, idx) => {
                const IconComp = s.icon
                const isPassed = stepIndex > idx
                const isCurrent = stepIndex === idx
                return (
                  <div key={s.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black transition-all shadow-sm ${
                        isPassed
                          ? 'bg-radarEmerald-600 text-white'
                          : isCurrent
                          ? 'bg-signal-600 text-white ring-4 ring-signal-200 animate-pulse'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] sm:text-[11px] mt-1.5 font-black uppercase tracking-wider ${
                      isCurrent ? 'text-signal-700' : isPassed ? 'text-radarEmerald-800' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rescue Notification Box */}
          <div className="bg-white border-l-4 border-l-signal-600 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-signal-50 text-signal-600 flex items-center justify-center font-black text-sm shrink-0">
              🚨
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-signal-800 bg-signal-100 px-2 py-0.5 rounded">
                  CAD Transponder Broadcast
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  ETA: {etaMins} mins ({distanceKm} km)
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed">
                {status === 'resolved'
                  ? `"${ngoName} successfully concluded extrication. ${em.rescued_people_count || 3} civilians safely transported to emergency camp."`
                  : status === 'arrived'
                  ? `"Rescue crew (${rescueTeam}) has arrived at target coordinates. Follow on-site instructions."`
                  : `"${ngoName} mobilized rescue craft ${vehicle}. Estimated arrival time: ${etaMins} minutes."`}
              </p>
            </div>
          </div>

          {/* Stale Location Warning */}
          {isLocationStale && (
            <div className="bg-opsAmber-50 border border-opsAmber-300 rounded-2xl p-3.5 flex items-center gap-3 text-opsAmber-900 shadow-xs">
              <span className="text-lg">⚠️</span>
              <div className="text-xs font-semibold">
                <span className="font-black">Vehicle GPS transponder paused for {secondsAgo} seconds.</span>
                <span className="ml-1">Displaying last verified coordinate fix. Re-acquiring telemetry link.</span>
              </div>
            </div>
          )}

          {/* Real-time Map View */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Live GIS Satellite Telemetry
                </span>
                <span className="text-[10px] font-bold text-radarEmerald-700 bg-radarEmerald-50 px-2 py-0.5 rounded-full border border-radarEmerald-200">
                  Transponder Active
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500">
                Vehicle: {vehicle}
              </span>
            </div>

            <LiveRescueMap
              victimCoords={victimCoords}
              vehicleCoords={vehicleCoords}
              ngoCoords={ngoCoords}
              distanceKm={distanceKm}
              etaMins={etaMins}
              status={status}
              height="280px"
            />
          </div>

          {/* Tactical Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <p className="text-[10px] uppercase font-black text-slate-400">ASSIGNED SQUAD</p>
              <p className="text-xs font-black text-slate-900 mt-0.5">{ngoName}</p>
              <a href={`tel:${ngoPhone}`} className="text-[11px] text-signal-600 font-bold hover:underline block mt-1">
                📞 Call Squad: {ngoPhone}
              </a>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <p className="text-[10px] uppercase font-black text-slate-400">CREW &amp; VEHICLE</p>
              <p className="text-xs font-black text-slate-900 mt-0.5">{rescueTeam}</p>
              <p className="text-[11px] text-marineBlue-700 font-bold mt-1">{isBoat ? '🚤' : '🚑'} {vehicle}</p>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <p className="text-[10px] uppercase font-black text-slate-400">REMAINING DISTANCE</p>
              <p className="text-xs font-black text-slate-900 mt-0.5">{distanceKm} km</p>
              <p className="text-[11px] text-radarEmerald-700 font-bold mt-1">ETA ~ {etaMins} mins</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <a
            href="tel:112"
            className="text-signal-600 font-black hover:underline flex items-center gap-1"
          >
            <span>📞 Immediate Crisis? Call National 112</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 font-black rounded-xl text-white transition motion-press shadow-sm"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
