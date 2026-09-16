import { useState, useEffect, useRef } from 'react'
import LiveRescueMap from '../../common/LiveRescueMap'
import { apiUpdateVehicleLocation } from '../../../services/api'
import { fetchRoadRoute, resampleRoadPath } from '../../../services/roadRouting'

const PROGRESS_STEPS = [
  { step: 1, label: 'Accepted', time: '10:15 AM' },
  { step: 2, label: 'Assigned',  time: '10:20 AM' },
  { step: 3, label: 'Enroute',   time: '10:22 AM' },
  { step: 4, label: 'Arrived',   time: '--:--' },
  { step: 5, label: 'Rescued',   time: '--:--' },
  { step: 6, label: 'Completed', time: '--:--' },
]

export default function TrackingAndDetails({
  selectedRescue,
  handleUpdateRescueStatus,
  onDispatch,
  onMarkArrived,
  onOpenResolveModal,
  showToast,
}) {
  const [isBroadcastingGps, setIsBroadcastingGps] = useState(false)
  const [isSimulatingRoute, setIsSimulatingRoute] = useState(false)
  const [lastBroadcastCoords, setLastBroadcastCoords] = useState(null)
  const [broadcastError, setBroadcastError] = useState(null)
  const watchIdRef = useRef(null)
  const simIntervalRef = useRef(null)

  // Clean up watchers and intervals on unmount or when rescue changes
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current)
        simIntervalRef.current = null
      }
    }
  }, [selectedRescue?.id])

  if (!selectedRescue) {
    return (
      <section className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center text-slate-400 text-xs">
        No active rescue selected.
      </section>
    )
  }

  const statusLower = (selectedRescue.status || '').toLowerCase()
  const isArrived = statusLower === 'arrived' || statusLower === 'on site'
  const isEnroute = statusLower === 'enroute' || statusLower === 'dispatched' || statusLower === 'on_the_way'
  const isAccepted = statusLower === 'accepted' || statusLower === 'assigned'
  const isResolved = statusLower === 'resolved' || statusLower === 'completed'

  // Coordinates extraction
  const victimLat = selectedRescue.coords?.lat || selectedRescue.latitude || 25.6022
  const victimLng = selectedRescue.coords?.lng || selectedRescue.longitude || 85.1376
  const ngoLat = selectedRescue.telemetry?.ngo_location?.lat || 25.6022 + 0.0098
  const ngoLng = selectedRescue.telemetry?.ngo_location?.lng || 85.1376 + 0.0204

  const currentVehicleLat = lastBroadcastCoords?.lat || selectedRescue.vehicle_lat || selectedRescue.telemetry?.vehicle_location?.lat || ngoLat
  const currentVehicleLng = lastBroadcastCoords?.lng || selectedRescue.vehicle_lng || selectedRescue.telemetry?.vehicle_location?.lng || ngoLng

  const victimCoords = {
    lat: victimLat,
    lng: victimLng,
    name: selectedRescue.name || 'Victim',
    address: selectedRescue.location || selectedRescue.address,
    people: selectedRescue.people,
    accuracy: selectedRescue.location_accuracy || 10,
  }

  const vehicleLabel = selectedRescue.vehicle || selectedRescue.rescue_vehicle || 'Ambulance AM-01'

  const vehicleCoords = {
    lat: currentVehicleLat,
    lng: currentVehicleLng,
    label: vehicleLabel,
    accuracy: lastBroadcastCoords?.accuracy || selectedRescue.vehicle_accuracy || 5,
  }

  const ngoCoords = {
    lat: ngoLat,
    lng: ngoLng,
    name: 'NGO Operations Base',
    address: 'Patna Central Relief Hub',
  }

  const distanceKm = selectedRescue.distance_km || selectedRescue.telemetry?.distance || selectedRescue.distance || '2.8'
  const etaMins = selectedRescue.eta_mins !== undefined ? selectedRescue.eta_mins : (parseInt(selectedRescue.eta) || 12)

  // 1. Live Device GPS Broadcast Handler
  const toggleDeviceGpsBroadcast = () => {
    if (isBroadcastingGps) {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      setIsBroadcastingGps(false)
      showToast('Live device GPS broadcast stopped.')
      return
    }

    if (!navigator.geolocation) {
      setBroadcastError('Browser does not support Geolocation API')
      showToast('Geolocation not supported by device.')
      return
    }

    setBroadcastError(null)
    setIsBroadcastingGps(true)
    showToast('Connecting ambulance GPS transponder stream...')

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000
        const lng = Math.round(pos.coords.longitude * 10000) / 10000
        const accuracy = Math.round(pos.coords.accuracy || 5)

        setLastBroadcastCoords({ lat, lng, accuracy })

        try {
          await apiUpdateVehicleLocation(selectedRescue.id, {
            latitude: lat,
            longitude: lng,
            accuracy: accuracy,
          })
          showToast(`Ambulance GPS: ${lat}, ${lng} (±${accuracy}m)`)
        } catch (e) {
          console.warn('GPS broadcast error:', e)
        }
      },
      (err) => {
        console.warn('Geolocation watch error:', err)
        setBroadcastError(err.message || 'GPS location acquisition failed')
        setIsBroadcastingGps(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    )
  }

  // 2. Realistic Road-Following Ambulance Navigation Simulation
  const toggleSimulateRouteMovement = async () => {
    if (isSimulatingRoute) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current)
        simIntervalRef.current = null
      }
      setIsSimulatingRoute(false)
      showToast('Ambulance road simulation paused.')
      return
    }

    setIsSimulatingRoute(true)
    showToast('Calculating street navigation route for ambulance...')

    const startPoint = { lat: currentVehicleLat || ngoLat, lng: currentVehicleLng || ngoLng }
    const endPoint = { lat: victimLat, lng: victimLng }

    try {
      const routeData = await fetchRoadRoute(startPoint, endPoint)
      const roadWaypoints = resampleRoadPath(routeData?.coordinates || [], 20)

      if (!roadWaypoints || roadWaypoints.length === 0) {
        showToast('Unable to acquire road navigation path.')
        setIsSimulatingRoute(false)
        return
      }

      showToast(`🚑 Ambulance navigating via ${routeData?.summary || 'Road Network'} (${roadWaypoints.length} road waypoints)...`)

      let currentIdx = 0

      simIntervalRef.current = setInterval(async () => {
        if (currentIdx >= roadWaypoints.length) {
          clearInterval(simIntervalRef.current)
          simIntervalRef.current = null
          setIsSimulatingRoute(false)
          showToast('🚑 Ambulance arrived at victim location! Click "Mark as Arrived".')
          return
        }

        const [nextLat, nextLng] = roadWaypoints[currentIdx]
        setLastBroadcastCoords({ lat: nextLat, lng: nextLng, accuracy: 3 })

        try {
          await apiUpdateVehicleLocation(selectedRescue.id, {
            latitude: nextLat,
            longitude: nextLng,
            accuracy: 3,
          })
        } catch (e) {
          console.warn('Road waypoint broadcast notice:', e)
        }

        currentIdx++
      }, 1600)
    } catch (err) {
      console.warn('Error starting road simulation:', err)
      setIsSimulatingRoute(false)
      showToast('Failed to calculate road route.')
    }
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Rescue Tracking Progress & Live Map (7 Cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-nordic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                />
              </svg>
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                Rescue Tracking – #{selectedRescue.id}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ● Telemetry Stream Active
              </span>
            </div>
          </div>

          {/* Vehicle GPS Broadcast Controls */}
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isBroadcastingGps || isSimulatingRoute ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                Rescue Vehicle GPS Transponder
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Vehicle: {vehicleLabel}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleDeviceGpsBroadcast}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isBroadcastingGps
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
              >
                <span>{isBroadcastingGps ? '⏹ Stop GPS Broadcast' : '🛰️ Broadcast Device GPS'}</span>
              </button>

              <button
                type="button"
                onClick={toggleSimulateRouteMovement}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isSimulatingRoute
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                <span>{isSimulatingRoute ? '⏸ Pause Road Navigation' : '🚑 Test Road Navigation (Live Drive)'}</span>
              </button>
            </div>

            {broadcastError && (
              <p className="text-[11px] text-rose-600 font-medium">⚠️ {broadcastError}</p>
            )}

            {lastBroadcastCoords && (
              <p className="text-[11px] text-emerald-800 font-mono">
                Latest GPS: {lastBroadcastCoords.lat}, {lastBroadcastCoords.lng} (Accuracy: ±{lastBroadcastCoords.accuracy}m)
              </p>
            )}
          </div>

          {/* Real-time Interactive OpenStreetMap Leaflet Map */}
          <div className="mt-4">
            <LiveRescueMap
              victimCoords={victimCoords}
              vehicleCoords={vehicleCoords}
              ngoCoords={ngoCoords}
              distanceKm={distanceKm}
              etaMins={etaMins}
              status={statusLower}
              height="240px"
            />
          </div>
        </div>

        {/* Horizontal Step Progress Tracker */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-6 relative">
            <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 -z-0"></div>
            <div
              className="absolute top-3 left-6 h-0.5 bg-nordic-500 -z-0 transition-all duration-300"
              style={{ width: `${Math.max(0, (((selectedRescue.progressStep || 3) - 1) / 5) * 85)}%` }}
            ></div>

            {PROGRESS_STEPS.map((s) => {
              const currentStep = selectedRescue.progressStep || (isResolved ? 6 : isArrived ? 4 : isEnroute ? 3 : 2)
              const isDone = currentStep > s.step
              const isCurrent = currentStep === s.step
              return (
                <div key={s.step} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white shadow-sm ${
                      isDone
                        ? 'bg-nordic-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : isCurrent ? '●' : s.step}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 ${
                      isCurrent ? 'font-bold text-blue-600' : isDone ? 'font-bold text-slate-800' : 'font-medium text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: Rescue Details Panel (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <h3 className="font-bold text-slate-900 text-base">Mission Details</h3>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${selectedRescue.statusClass || 'bg-blue-100 text-blue-700 border-blue-200'}`}>
              {(selectedRescue.status || 'Active').toUpperCase()}
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Request ID</span>
              <span className="font-bold text-slate-800">#{selectedRescue.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Disaster Type</span>
              <span className="font-bold text-slate-800">{selectedRescue.type || 'Flood'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Location</span>
              <span className="font-semibold text-slate-700 truncate max-w-[200px]">{selectedRescue.location}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400 font-medium">People Affected</span>
              <span className="font-extrabold text-slate-900">{selectedRescue.people}</span>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Description</span>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 italic text-[11px] leading-relaxed">
                "{selectedRescue.desc || selectedRescue.description || 'Trapped in rising flood waters.'}"
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                Assigned Resources
              </span>
              <div className="p-3 bg-nordic-50/50 rounded-xl border border-nordic-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-[11px]">Assigned Team</span>
                  <span className="font-bold text-slate-800 text-[11px]">
                    {selectedRescue.rescue_team || selectedRescue.volunteer || 'Team Alpha'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-[11px]">Vehicle / Unit</span>
                  <span className="font-bold text-slate-800 text-[11px]">{vehicleLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-[11px]">Remaining Distance</span>
                  <span className="font-bold text-emerald-700 text-[11px]">{distanceKm} km (ETA: {etaMins}m)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Milestone Action Buttons */}
        <div className="mt-4 pt-3 space-y-2">
          {isAccepted && (
            <button
              onClick={() => onDispatch ? onDispatch(selectedRescue) : handleUpdateRescueStatus()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition"
            >
              <span>🚤</span>
              <span>Dispatch Team (Mark On The Way)</span>
            </button>
          )}

          {isEnroute && (
            <button
              onClick={() => onMarkArrived ? onMarkArrived(selectedRescue) : handleUpdateRescueStatus()}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition"
            >
              <span>📍</span>
              <span>Mark as Arrived (Team On Scene)</span>
            </button>
          )}

          {isArrived && (
            <button
              onClick={() => onOpenResolveModal ? onOpenResolveModal(selectedRescue) : handleUpdateRescueStatus()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition"
            >
              <span>✅</span>
              <span>Mark as Resolved (Enter Rescued People)</span>
            </button>
          )}

          {isResolved && (
            <div className="w-full py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold text-center">
              ✓ Mission Completed &amp; Closed
            </div>
          )}

          {!isResolved && (
            <button
              onClick={handleUpdateRescueStatus}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition"
            >
              <span>Next Milestone</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
