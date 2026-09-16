import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import LiveRescueMap from '../../common/LiveRescueMap'
import { apiGetSosTracking, getRescueWebSocketUrl } from '../../../services/api'

export default function AdminRescueMonitorModal({ isOpen, onClose, sosId, initialRecord = null }) {
  const [trackingData, setTrackingData] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('live')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    if (!isOpen || !sosId) return

    let isMounted = true

    // Fetch telemetry data
    const fetchTelemetry = async () => {
      try {
        const data = await apiGetSosTracking(sosId)
        if (data && isMounted) {
          setTrackingData(data)
          setLastUpdated(new Date())
        }
      } catch (e) {
        console.warn('Admin monitor fetch error:', e)
      }
    }
    fetchTelemetry()

    // WebSocket stream for live monitor
    let ws = null
    try {
      const wsUrl = getRescueWebSocketUrl(sosId)
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        if (isMounted) setConnectionStatus('live')
      }

      ws.onmessage = (event) => {
        if (!isMounted) return
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'tracking_init') {
            setTrackingData(prev => ({ ...prev, ...data }))
            setLastUpdated(new Date())
          } else if (data.type === 'vehicle_location') {
            setTrackingData(prev => ({
              ...prev,
              status: data.status || prev?.status,
              telemetry: {
                ...(prev?.telemetry || {}),
                vehicle_location: {
                  lat: data.latitude,
                  lng: data.longitude,
                  accuracy: data.accuracy,
                  label: data.vehicle_id || 'Ambulance AM-01'
                },
                distance: `${data.distance_km}`,
                distance_km: data.distance_km,
                eta: data.eta,
                status: data.status
              },
              emergency: {
                ...(prev?.emergency || {}),
                vehicle_lat: data.latitude,
                vehicle_lng: data.longitude,
                vehicle_accuracy: data.accuracy,
                distance: `${data.distance_km} km`,
                distance_km: data.distance_km,
                eta: `${data.eta} mins`,
                eta_mins: data.eta,
                status: data.status
              }
            }))
            setLastUpdated(new Date())
          } else if (data.type === 'rescue_status') {
            setTrackingData(prev => ({
              ...prev,
              status: data.status,
              emergency: data.emergency || { ...(prev?.emergency || {}), status: data.status }
            }))
            setLastUpdated(new Date())
          }
        } catch (e) {}
      }

      ws.onerror = () => {
        if (isMounted) setConnectionStatus('reconnecting')
      }
    } catch (e) {
      setConnectionStatus('unavailable')
    }

    const interval = setInterval(fetchTelemetry, 3000)

    return () => {
      isMounted = false
      clearInterval(interval)
      if (ws) ws.close()
    }
  }, [isOpen, sosId])

  if (!isOpen) return null

  const em = trackingData?.emergency || initialRecord?.raw || {}
  const telemetry = trackingData?.telemetry || em.telemetry || {}
  const status = (trackingData?.status || em.status || 'pending').toLowerCase()

  const victimCoords = {
    lat: em.coords?.lat || em.latitude || 25.6022,
    lng: em.coords?.lng || em.longitude || 85.1376,
    name: em.name || 'Victim',
    address: em.address || 'Patna Sector',
    people: em.people,
  }

  const vehicleCoords = {
    lat: telemetry.vehicle_location?.lat || em.vehicle_lat || (victimCoords.lat + 0.0098),
    lng: telemetry.vehicle_location?.lng || em.vehicle_lng || (victimCoords.lng + 0.0204),
    label: em.vehicle || em.rescue_vehicle || 'Ambulance AM-01',
    accuracy: telemetry.vehicle_accuracy || 5,
  }

  const ngoCoords = {
    lat: telemetry.ngo_location?.lat || (victimCoords.lat + 0.0098),
    lng: telemetry.ngo_location?.lng || (victimCoords.lng + 0.0204),
    name: em.matchedNgo?.name || 'Assigned Relief NGO',
  }

  const distanceKm = telemetry.distance || em.distance || '2.4'
  const etaMins = telemetry.eta !== undefined ? telemetry.eta : (em.eta_mins || 8)

  const content = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[99999]"
      style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg border border-teal-500/30">
              🛰️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">Admin Rescue Telemetry Monitor</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  #{sosId}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Read-Only Monitoring Mode
                </span>
                <span>• Last synced {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Disaster Type</span>
              <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{em.type || em.disaster || 'Flood'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned NGO</span>
              <span className="font-extrabold text-slate-800 text-xs mt-0.5 block truncate">{em.matchedNgo?.name || 'Assigned Relief Unit'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Rescue Craft</span>
              <span className="font-extrabold text-emerald-700 text-xs mt-0.5 block truncate">{vehicleCoords.label}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Status</span>
              <span className="font-extrabold text-blue-700 text-xs mt-0.5 block uppercase">{status.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Real-Time Live Map */}
          <div>
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

          {/* Coordinates Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Vehicle Coordinates:</span>
              <span className="font-mono text-slate-800 font-bold">{vehicleCoords.lat}, {vehicleCoords.lng}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Remaining Distance:</span>
              <span className="font-bold text-emerald-700">{distanceKm} km (ETA: {etaMins} min)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Admin oversight view: Real-time satellite &amp; vehicle transponder tracking.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
