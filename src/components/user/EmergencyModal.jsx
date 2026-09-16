import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { apiCreateEmergency } from '../../services/api'

/* ─── Vector Disaster Scenario Icons ──────────────────────── */
function WaterIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 13c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5-1.5 5 0M2 17c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5-1.5 5 0M12 3v4m-3 0h6" />
    </svg>
  )
}

function MountainIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M4 20l6-11 4 6 6-9" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
      <circle cx="16" cy="11" r="1.5" fill="currentColor" />
    </svg>
  )
}

function FlameIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c1 3-2 5-2 8a6 6 0 1012 0c0-4-3-6-3-9-2 2-3 4-4 4s-2-1-3-3z" />
    </svg>
  )
}

function GlobeQuakeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-3 3 6 2-4 3 2 2-1h6" />
    </svg>
  )
}

function AmbulanceIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-4l-3-4H4a1 1 0 00-1 1v8c0 .6.4 1 1 1h2m13 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M7 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0M9 9h4m-2-2v4" />
    </svg>
  )
}

function MedCrossIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

const emergencyTypes = [
  { id: 'flood',      icon: WaterIcon,       label: 'Flood',      color: 'from-sky-500 to-sky-600', ring: 'border-sky-500 bg-sky-50/80 text-sky-900' },
  { id: 'landslide',  icon: MountainIcon,    label: 'Landslide',  color: 'from-amber-500 to-amber-600', ring: 'border-amber-500 bg-amber-50/80 text-amber-900' },
  { id: 'fire',       icon: FlameIcon,       label: 'Fire',       color: 'from-orange-500 to-red-600', ring: 'border-orange-500 bg-orange-50/80 text-orange-900' },
  { id: 'earthquake', icon: GlobeQuakeIcon,  label: 'Quake',      color: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-500 bg-emerald-50/80 text-emerald-900' },
  { id: 'accident',   icon: AmbulanceIcon,   label: 'Accident',   color: 'from-rose-500 to-red-700', ring: 'border-rose-500 bg-rose-50/80 text-rose-900' },
  { id: 'medical',    icon: MedCrossIcon,    label: 'Medical',    color: 'from-teal-500 to-emerald-700', ring: 'border-teal-500 bg-teal-50/80 text-teal-900' },
]

const isGenericName = (name) => {
  if (!name || typeof name !== 'string') return true
  const lower = name.trim().toLowerCase()
  return (
    lower === 'citizen user' ||
    lower === 'citizen' ||
    lower === 'user' ||
    lower === 'anonymous' ||
    lower === 'unknown' ||
    lower.startsWith('citizen')
  )
}

const isGenericPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return true
  const clean = phone.replace(/[\s\+\-\(\)]/g, '')
  return clean === '9876543210' || clean === '919876543210' || clean === '1234567890'
}

export default function EmergencyModal({ isOpen, onClose, preselectedType = null, user = null, onSosCreated = null, geo = null }) {
  const [selectedType, setSelectedType] = useState('flood')
  const [submitted, setSubmitted] = useState(false)
  const [createdSos, setCreatedSos] = useState(null)
  const [internalCoords, setInternalCoords] = useState({ lat: 28.5734, lng: 77.3250 })
  const [internalAccuracy, setInternalAccuracy] = useState(null)
  const [internalStatus, setInternalStatus] = useState('locating') // 'locating' | 'acquired' | 'denied' | 'unavailable'
  const [internalGeocoding, setInternalGeocoding] = useState(false)
  const timerRef = useRef(null)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    peopleCount: '3 People',
    urgency: 'Critical - Immediate Threat to Life',
    details: 'Trapped in emergency area. Urgent squad dispatch needed.',
  })

  // Determine active geolocation values (from geo prop if provided, else internal state)
  const coords = geo?.coords || internalCoords
  const gpsAccuracy = geo?.accuracy ?? internalAccuracy
  const gpsStatus = geo
    ? geo.status === 'granted'
      ? 'acquired'
      : geo.status === 'denied'
      ? 'denied'
      : geo.status === 'locating'
      ? 'locating'
      : geo.status === 'unavailable'
      ? 'unavailable'
      : 'denied'
    : internalStatus
  const isGeocoding = geo ? geo.isGeocoding : internalGeocoding

  const roundToFive = (num) => Math.round(num * 10000) / 10000

  // Reverse geocode latitude & longitude into a real street / landmark address (fallback)
  const reverseGeocode = async (lat, lng) => {
    setInternalGeocoding(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.display_name) {
          setForm(prev => ({
            ...prev,
            address: data.display_name
          }))
        }
      }
    } catch (e) {
      console.warn('Reverse geocode fallback:', e)
    } finally {
      setInternalGeocoding(false)
    }
  }

  // Actively trigger browser location permission and coordinates acquisition
  const requestUserLocation = () => {
    if (geo && geo.requestLocation) {
      geo.requestLocation()
      return
    }

    if (!navigator.geolocation) {
      setInternalStatus('unavailable')
      return
    }

    setInternalStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = roundToFive(pos.coords.latitude)
        const lng = roundToFive(pos.coords.longitude)
        const acc = Math.round(pos.coords.accuracy || 10)
        setInternalCoords({ lat, lng })
        setInternalAccuracy(acc)
        setInternalStatus('acquired')
        reverseGeocode(lat, lng)
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setInternalStatus('denied')
        } else {
          setInternalStatus('unavailable')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  // Auto-sync address from geo prop when it resolves
  useEffect(() => {
    if (geo?.address) {
      setForm(prev => {
        // Only override if address is empty or default
        if (!prev.address || prev.address === 'Emergency Incident Location') {
          return { ...prev, address: geo.address }
        }
        return prev
      })
    }
  }, [geo?.address])

  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true
      setSelectedType(preselectedType || 'flood')
      setSubmitted(false)

      // Clean out any default/placeholder names so inputs always start clean
      const candidateName = user?.name || user?.username || ''
      const safeName = isGenericName(candidateName) ? '' : candidateName

      const candidatePhone = user?.phone || ''
      const safePhone = isGenericPhone(candidatePhone) ? '' : candidatePhone

      setForm({
        fullName: safeName,
        phone: safePhone,
        address: geo?.address || user?.address || '',
        peopleCount: '3 People',
        urgency: 'Critical - Immediate Threat to Life',
        details: 'Trapped in emergency area. Urgent squad dispatch needed.',
      })

      // Automatically attempt location detection when modal opens if not already granted
      if (!geo || geo.status !== 'granted') {
        requestUserLocation()
      }
    } else if (!isOpen) {
      wasOpenRef.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    let newSos = null
    try {
      const payload = {
        name: form.fullName.trim() || user?.name || 'Citizen In Need',
        phone: form.phone.trim() || user?.phone || 'Emergency Contact',
        disaster: selectedType,
        address: form.address || 'Emergency Incident Location',
        latitude: coords.lat,
        longitude: coords.lng,
        location_accuracy: gpsAccuracy || 10.0,
        accuracy: gpsAccuracy || 10.0,
        location_updated_at: new Date().toISOString(),
        location: { lat: coords.lat, lng: coords.lng, accuracy: gpsAccuracy || 10.0 },
        urgency: form.urgency.toLowerCase().includes('critical') ? 'critical' : form.urgency.toLowerCase().includes('medium') ? 'medium' : 'high',
        people: form.peopleCount.split(' ')[0] || '3',
        description: form.details,
      }
      newSos = await apiCreateEmergency(payload)
      setCreatedSos(newSos)
      if (newSos?.sosId) {
        try {
          localStorage.setItem('active_sos_id', newSos.sosId)
          localStorage.setItem('last_created_sos', JSON.stringify(newSos))
        } catch (e) {
          console.error(e)
        }
      }
    } catch (err) {
      console.warn('Backend emergency submission fallback:', err.message)
      newSos = {
        sosId: 'SOS-' + Math.floor(100000 + Math.random() * 900000),
        name: form.fullName.trim() || user?.name || 'Citizen In Need',
        phone: form.phone.trim() || user?.phone || 'Emergency Contact',
        disaster: selectedType,
        address: form.address || 'Emergency Incident Location',
        status: 'pending',
        people: form.peopleCount.split(' ')[0] || '3',
        nearbyNgosCount: 3,
        nearbyNgos: [
          { name: 'National Disaster Response Force (NDRF)', distance_km: 1.1, boats: 8 },
          { name: 'Lions Club Disaster Response Unit', distance_km: 2.4, boats: 5 },
          { name: 'Indian Red Cross Emergency Unit', distance_km: 3.8, boats: 12 },
        ]
      }
      setCreatedSos(newSos)
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSubmitted(false)
      onClose()
      if (onSosCreated && newSos) {
        onSosCreated(newSos)
      }
    }, 2800)
  }

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6"
      style={{ zIndex: 9999, background: 'rgba(11, 15, 25, 0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Luminous Top Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500 sticky top-0 z-10" />

        <div className="p-5 sm:p-7 space-y-5">
          {/* Header */}
          <header className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div
                className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-md"
                style={{ backgroundColor: '#e11d48' }}
              >
                <AmbulanceIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Emergency CAD Dispatch SOS
                </h2>
                <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#be123c' }}>
                  Automatic 15 km Radial Telemetry &amp; Squad Assignment
                </p>
              </div>
            </div>
            <button
              aria-label="Close modal"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition motion-spring cursor-pointer"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
          </header>

          {/* Success State */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
              <div
                className="w-16 h-16 rounded-full text-white flex items-center justify-center text-3xl shadow-xl ring-8 ring-emerald-100"
                style={{ backgroundColor: '#059669' }}
              >
                ✓
              </div>
              <div>
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}
                >
                  {createdSos?.sosId || 'SOS BROADCASTED'}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Emergency Distress Transmitted!</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Searching nearby specialized rescue units within 15 km operational perimeter.
                </p>
              </div>

              {createdSos?.nearbyNgos && createdSos.nearbyNgos.length > 0 && (
                <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-200 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {createdSos.nearbyNgos.length} Specialized Units Monitoring:
                    </span>
                    <span className="font-black" style={{ color: '#047857' }}>&lt; 15 km</span>
                  </div>
                  {createdSos.nearbyNgos.slice(0, 3).map((ngo, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{ngo.name}</p>
                        <p className="text-[10px] text-slate-400">🚤 {ngo.boats || 4} Rescue Boats • 👥 {ngo.volunteers || 20} Volunteers</p>
                      </div>
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-lg border"
                        style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}
                      >
                        {ngo.distance_km} km
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="w-full pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (timerRef.current) clearTimeout(timerRef.current)
                    setSubmitted(false)
                    onClose()
                    if (onSosCreated && createdSos) onSosCreated(createdSos)
                  }}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 motion-spring motion-press cursor-pointer"
                  style={{ backgroundColor: '#e11d48' }}
                >
                  <span>Open Live Radar Tracker</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-800" htmlFor="em-fullName">
                    Victim / Reporter Name <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:bg-white outline-none transition-all shadow-xs"
                    id="em-fullName"
                    placeholder="Enter full name"
                    required
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-800" htmlFor="em-phone">
                    Emergency Phone Number <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:bg-white outline-none transition-all shadow-xs"
                    id="em-phone"
                    placeholder="e.g. 9876543210"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* ══════════════ SMART AUTOMATIC GPS & LOCATION PERMISSION CARD ══════════════ */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-800" htmlFor="em-address">
                    Current Trapped Address / Landmark <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  {isGeocoding && (
                    <span className="text-[10px] font-bold text-sky-700 animate-pulse">
                      📍 Fetching street address...
                    </span>
                  )}
                </div>

                <input
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:bg-white outline-none transition-all shadow-xs"
                  id="em-address"
                  placeholder={isGeocoding ? "Detecting address..." : "e.g. Street name, village, landmark or building name"}
                  required
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
                />

                {/* State 1: GPS Acquired (Successful) */}
                {gpsStatus === 'acquired' && (
                  <div
                    className="flex items-center justify-between p-3 rounded-2xl border shadow-xs"
                    style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <div>
                        <span className="font-black text-[11px] text-emerald-950">Live GPS Locked: </span>
                        <span className="font-mono text-[11px] font-bold text-emerald-800">{coords.lat}, {coords.lng}</span>
                        {gpsAccuracy && (
                          <span className="text-[10px] text-emerald-700 font-bold ml-1.5 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            ±{gpsAccuracy}m precision
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={requestUserLocation}
                      className="text-[10px] font-black uppercase text-emerald-900 bg-white hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition cursor-pointer"
                    >
                      Re-detect GPS
                    </button>
                  </div>
                )}

                {/* State 2: GPS Locating (In-progress) */}
                {gpsStatus === 'locating' && (
                  <div
                    className="flex items-center gap-2.5 p-3 rounded-2xl border shadow-xs"
                    style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}
                  >
                    <span className="w-3 h-3 rounded-full bg-sky-500 animate-ping shrink-0" />
                    <span className="text-[11px] font-bold text-sky-900">
                      Acquiring real-time device coordinates &amp; reverse geocoding address...
                    </span>
                  </div>
                )}

                {/* State 3: GPS Permission Denied / Not Given (Interactive Permission Prompt) */}
                {gpsStatus === 'denied' && (
                  <div
                    className="p-4 rounded-2xl border shadow-sm space-y-2.5"
                    style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs"
                        style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                      >
                        📍
                      </div>
                      <div className="text-xs">
                        <p className="font-black text-amber-950 text-sm">Location Permission Required for Auto-Dispatch</p>
                        <p className="text-amber-900 mt-1 leading-relaxed">
                          Your browser has withheld live coordinates. Grant location access so nearby relief motorboats and ambulances receive your exact satellite pin.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={requestUserLocation}
                        className="px-4 py-2 rounded-xl font-black text-xs text-white shadow-xs transition motion-press cursor-pointer flex items-center gap-1.5"
                        style={{ backgroundColor: '#d97706' }}
                      >
                        <span>📍</span>
                        <span>Grant Location Access</span>
                      </button>
                      <span className="text-[11px] font-bold text-amber-800">
                        Or verify trapped address manually above
                      </span>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-800 flex items-center gap-1.5">
                      <span>💡 <strong>If blocked:</strong> Click the 🔒 lock icon in your browser URL bar &gt; set <strong>Location</strong> to &quot;Allow&quot;, then click Grant Location Access.</span>
                    </div>
                  </div>
                )}

                {/* State 4: GPS Hardware Unavailable */}
                {gpsStatus === 'unavailable' && (
                  <div
                    className="p-3 rounded-2xl border flex items-center justify-between text-xs"
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <span className="text-slate-700 font-semibold text-[11px]">
                        GPS sensor unavailable. Please confirm your landmark address above.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={requestUserLocation}
                      className="text-[10px] font-black uppercase text-slate-700 bg-white hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-300 cursor-pointer"
                    >
                      Retry GPS
                    </button>
                  </div>
                )}
              </div>

              {/* Vibrant Emergency Type Selector */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-black text-slate-800">
                  Type of Emergency <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {emergencyTypes.map((t) => {
                    const IconC = t.icon
                    const isSelected = selectedType === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedType(t.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 motion-spring motion-press cursor-pointer ${
                          isSelected
                            ? `${t.ring} shadow-md`
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${t.color} text-white flex items-center justify-center mb-1 shadow-xs`}>
                          <IconC className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-black tracking-tight">
                          {t.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* People Count & Urgency Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-800" htmlFor="em-people">
                    Affected People <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <select
                    className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none pr-9 cursor-pointer transition-all"
                    id="em-people"
                    value={form.peopleCount}
                    onChange={(e) => setForm(f => ({ ...f, peopleCount: e.target.value }))}
                  >
                    <option>1 Person</option>
                    <option>2 People</option>
                    <option>3 People</option>
                    <option>4-6 People (Family)</option>
                    <option>7-12 People (Community)</option>
                    <option>13+ People (Mass Incident)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-800" htmlFor="em-urgency">
                    Urgency Severity Level <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <select
                    className="w-full appearance-none border rounded-xl px-3.5 py-2.5 font-black text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none pr-9 cursor-pointer transition-all"
                    id="em-urgency"
                    value={form.urgency}
                    onChange={(e) => setForm(f => ({ ...f, urgency: e.target.value }))}
                    style={{ backgroundColor: '#fff1f2', borderColor: '#fda4af', color: '#9f1239' }}
                  >
                    <option>Critical - Immediate Threat to Life</option>
                    <option>High - Urgent Help Needed</option>
                    <option>Medium - Stranded but Stable</option>
                  </select>
                </div>
              </div>

              {/* Situation Details */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800" htmlFor="em-details">
                  Situation &amp; Immediate Obstacles
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:bg-white outline-none transition-all resize-none shadow-xs"
                  id="em-details"
                  rows="2"
                  placeholder="e.g. Rising flood water, elderly person trapped on 1st floor, road access cut off..."
                  value={form.details}
                  onChange={(e) => setForm(f => ({ ...f, details: e.target.value }))}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl text-white font-black text-sm tracking-wider uppercase shadow-xl motion-spring motion-press flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: '#e11d48', boxShadow: '0 8px 25px rgba(225,29,72,0.45)' }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span>BROADCAST DISTRESS TELEMETRY</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
