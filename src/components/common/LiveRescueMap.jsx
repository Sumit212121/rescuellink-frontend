import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchRoadRoute } from '../../services/roadRouting'

export default function LiveRescueMap({
  victimCoords = null,
  vehicleCoords = null,
  ngoCoords = null,
  distanceKm = null,
  etaMins = null,
  status = 'on_the_way',
  height = '320px',
  className = '',
  showLegend = true,
  interactive = true,
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const victimMarkerRef = useRef(null)
  const vehicleMarkerRef = useRef(null)
  const ngoMarkerRef = useRef(null)
  const routeCasingRef = useRef(null)
  const routePolylineRef = useRef(null)
  const [roadDetails, setRoadDetails] = useState(null)

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapInstanceRef.current) return

    // Prevent "Map container is already initialized" error during rapid re-mounts
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id
    }

    // Default center: victim coordinates or vehicle coordinates or Patna coordinates
    const defaultLat = victimCoords?.lat || vehicleCoords?.lat || 25.6022
    const defaultLng = victimCoords?.lng || vehicleCoords?.lng || 85.1376

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 14,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      attributionControl: false,
    })

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map)

    mapInstanceRef.current = map

    // Fix possible tile clipping issues on modal reveal
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }, 200)

    return () => {
      clearTimeout(resizeTimer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      victimMarkerRef.current = null
      vehicleMarkerRef.current = null
      ngoMarkerRef.current = null
      routeCasingRef.current = null
      routePolylineRef.current = null
      if (mapContainerRef.current) {
        delete mapContainerRef.current._leaflet_id
      }
    }
  }, [])

  // Update Markers & Road Navigation Polyline when coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const bounds = []

    // 1. 🔴 Victim Marker
    if (victimCoords?.lat && victimCoords?.lng) {
      const vLat = parseFloat(victimCoords.lat)
      const vLng = parseFloat(victimCoords.lng)
      const vPos = [vLat, vLng]
      bounds.push(vPos)

      const victimIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute -inset-2 bg-rose-500/30 rounded-full animate-ping"></div>
            <div class="w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              🔴
            </div>
            <div class="absolute top-9 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-slate-700 pointer-events-none">
              ${victimCoords.name || 'Victim (SOS)'}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      if (!victimMarkerRef.current) {
        victimMarkerRef.current = L.marker(vPos, { icon: victimIcon }).addTo(map)
      } else {
        victimMarkerRef.current.setLatLng(vPos)
        victimMarkerRef.current.setIcon(victimIcon)
      }

      victimMarkerRef.current.bindPopup(`
        <div style="font-family: sans-serif; min-width: 160px;">
          <div style="font-size: 11px; font-weight: 800; color: #e11d48; text-transform: uppercase;">Victim Location</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${victimCoords.name || 'Citizen Reporter'}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${victimCoords.address || 'Distress Zone'}</div>
          ${victimCoords.people ? `<div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-top: 4px;">👥 ${victimCoords.people} Person(s) trapped</div>` : ''}
          ${victimCoords.accuracy ? `<div style="font-size: 10px; color: #10b981; font-weight: 600; margin-top: 2px;">📍 Accuracy: ±${Math.round(victimCoords.accuracy)}m</div>` : ''}
        </div>
      `)
    }

    // 2. 🏢 NGO Command Base Marker
    if (ngoCoords?.lat && ngoCoords?.lng) {
      const nLat = parseFloat(ngoCoords.lat)
      const nLng = parseFloat(ngoCoords.lng)
      const nPos = [nLat, nLng]
      bounds.push(nPos)

      const ngoIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-xl bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">
              🏢
            </div>
            <div class="absolute top-9 whitespace-nowrap bg-sky-950/90 text-sky-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-sky-800 pointer-events-none">
              ${(ngoCoords.name || 'NGO Base').split(' ')[0]} Base
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      if (!ngoMarkerRef.current) {
        ngoMarkerRef.current = L.marker(nPos, { icon: ngoIcon }).addTo(map)
      } else {
        ngoMarkerRef.current.setLatLng(nPos)
        ngoMarkerRef.current.setIcon(ngoIcon)
      }

      ngoMarkerRef.current.bindPopup(`
        <div style="font-family: sans-serif; min-width: 150px;">
          <div style="font-size: 11px; font-weight: 800; color: #0284c7; text-transform: uppercase;">Relief NGO Base</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${ngoCoords.name || 'Relief Station'}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${ngoCoords.address || 'Operational Command'}</div>
          ${ngoCoords.phone ? `<div style="font-size: 10px; color: #0f172a; margin-top: 3px;">📞 ${ngoCoords.phone}</div>` : ''}
        </div>
      `)
    }

    // 3. 🚑 Ambulance / Rescue Craft Marker with Real-time Navigation Siren
    if (vehicleCoords?.lat && vehicleCoords?.lng) {
      const vehLat = parseFloat(vehicleCoords.lat)
      const vehLng = parseFloat(vehicleCoords.lng)
      const vehPos = [vehLat, vehLng]
      bounds.push(vehPos)

      const rawLabel = vehicleCoords.label || vehicleCoords.vehicle_id || 'Ambulance AM-01'
      const isBoat = rawLabel.toLowerCase().includes('boat') || rawLabel.toLowerCase().includes('rb')
      const isAmbulance = !isBoat || rawLabel.toLowerCase().includes('ambulance') || rawLabel.toLowerCase().includes('am-')
      const craftEmoji = isBoat ? '🚤' : '🚑'
      const vehicleLabel = isAmbulance && !rawLabel.toLowerCase().includes('ambulance') ? `Ambulance (${rawLabel})` : rawLabel

      const vehicleIcon = L.divIcon({
        className: 'custom-leaflet-marker vehicle-marker-animated',
        html: `
          <div class="relative flex items-center justify-center">
            <!-- Dual Emergency Siren Flares (Red & Blue flashing beacons) -->
            <div class="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-red-500/70 animate-ping"></div>
            <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500/70 animate-ping" style="animation-delay: 200ms;"></div>
            <div class="absolute -inset-2 bg-red-500/20 rounded-full animate-pulse"></div>

            <!-- Vehicle Icon Button -->
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr ${isBoat ? 'from-teal-600 to-emerald-500' : 'from-rose-600 via-red-500 to-amber-500'} border-2 border-white shadow-2xl flex items-center justify-center text-white text-base">
              ${craftEmoji}
            </div>

            <!-- Live Navigation Badge -->
            <div class="absolute top-11 whitespace-nowrap bg-slate-950/95 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-red-500/60 flex items-center gap-1 pointer-events-none">
              <span class="w-1.5 h-1.5 rounded-full ${isBoat ? 'bg-emerald-400' : 'bg-red-400'} animate-ping"></span>
              <span>${vehicleLabel}</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      if (!vehicleMarkerRef.current) {
        vehicleMarkerRef.current = L.marker(vehPos, { icon: vehicleIcon }).addTo(map)
      } else {
        vehicleMarkerRef.current.setLatLng(vehPos)
        vehicleMarkerRef.current.setIcon(vehicleIcon)
      }

      vehicleMarkerRef.current.bindPopup(`
        <div style="font-family: sans-serif; min-width: 170px;">
          <div style="font-size: 11px; font-weight: 800; color: #dc2626; text-transform: uppercase;">🚑 Live Road Navigation</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${vehicleLabel}</div>
          <div style="font-size: 11px; color: #0284c7; font-weight: 600; margin-top: 3px;">Status: ${(status || 'Dispatched').toUpperCase()}</div>
          ${distanceKm ? `<div style="font-size: 11px; color: #0f172a; font-weight: 700; margin-top: 2px;">📍 Road Distance: ${distanceKm} km</div>` : ''}
          ${etaMins !== null && etaMins !== undefined ? `<div style="font-size: 11px; color: #16a34a; font-weight: 700;">⏱️ Navigation ETA: ${etaMins} mins</div>` : ''}
          ${roadDetails?.summary ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">🛣️ Route: ${roadDetails.summary}</div>` : ''}
          ${vehicleCoords.accuracy ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">GPS Accuracy: ±${Math.round(vehicleCoords.accuracy)}m</div>` : ''}
        </div>
      `)
    }

    // 4. 🛣️ Road-Following Navigation Route (Polyline following actual streets)
    const routeStart = (vehicleCoords?.lat && vehicleCoords?.lng)
      ? { lat: parseFloat(vehicleCoords.lat), lng: parseFloat(vehicleCoords.lng) }
      : (ngoCoords?.lat && ngoCoords?.lng)
      ? { lat: parseFloat(ngoCoords.lat), lng: parseFloat(ngoCoords.lng) }
      : null

    const routeEnd = (victimCoords?.lat && victimCoords?.lng)
      ? { lat: parseFloat(victimCoords.lat), lng: parseFloat(victimCoords.lng) }
      : null

    if (routeStart && routeEnd) {
      let isCancelled = false

      fetchRoadRoute(routeStart, routeEnd).then((routeData) => {
        if (isCancelled || !mapInstanceRef.current) return

        if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
          setRoadDetails(routeData)

          // Layer 1: Road route casing / shadow (Google Maps style)
          if (!routeCasingRef.current) {
            routeCasingRef.current = L.polyline(routeData.coordinates, {
              color: '#0f172a',
              weight: 7,
              opacity: 0.35,
              lineCap: 'round',
              lineJoin: 'round',
            }).addTo(map)
          } else {
            routeCasingRef.current.setLatLngs(routeData.coordinates)
          }

          // Layer 2: Glowing cyan navigation lane
          if (!routePolylineRef.current) {
            routePolylineRef.current = L.polyline(routeData.coordinates, {
              color: '#0284c7',
              weight: 4.5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '6, 8',
            }).addTo(map)
          } else {
            routePolylineRef.current.setLatLngs(routeData.coordinates)
          }
        }
      })

      return () => {
        isCancelled = true
      }
    }

    // Auto fit bounds
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
    } else if (bounds.length === 1) {
      map.panTo(bounds[0])
    }
  }, [victimCoords, vehicleCoords, ngoCoords, distanceKm, etaMins, status])

  const activeDistance = roadDetails?.distanceKm || distanceKm
  const activeEta = roadDetails?.durationMins || etaMins

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner ${className}`} style={{ height }}>
      {/* Leaflet container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Dynamic Road Navigation & ETA Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 shadow-xl text-right">
        <div className="flex items-center justify-end gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Road Navigation</span>
        </div>
        <div className="flex items-center justify-end gap-2 mt-0.5">
          {activeDistance && (
            <span className="text-xs font-black text-emerald-400">
              {activeDistance} km
            </span>
          )}
          {activeEta !== null && activeEta !== undefined && (
            <span className="text-xs font-black text-sky-400">
              • {activeEta} mins
            </span>
          )}
        </div>
        {roadDetails?.summary && (
          <div className="text-[9px] text-slate-300 max-w-[140px] truncate mt-0.5 font-medium">
            🛣️ {roadDetails.summary}
          </div>
        )}
      </div>

      {/* Floating Legend Overlay */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[10px] text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-rose-200"></span>
            <span>🔴 Victim (Distress Pin)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-red-200"></span>
            <span>🚑 Ambulance (Live Siren GPS)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 ring-2 ring-sky-200"></span>
            <span>🏢 NGO Command Base</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-sky-700">
            <span className="w-2.5 h-0.5 bg-sky-600"></span>
            <span>🛣️ Street Navigation Route</span>
          </div>
        </div>
      )}
    </div>
  )
}
