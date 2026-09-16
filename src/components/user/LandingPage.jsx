import { useState, useEffect } from 'react'
import EmergencyModal from './EmergencyModal'
import AuthModal from './AuthModal'
import FiscalTransparencyModal from './FiscalTransparencyModal'
import RescueTrackingModal from './RescueTrackingModal'
import SosHistoryModal from './SosHistoryModal'
import HaikeiWaveDivider from '../common/HaikeiWaveDivider'
import { apiGetActiveSos } from '../../services/api'
import haikeiHeroWaves from '../../assets/haikei-hero-waves.svg'
import haikeiBlobCluster from '../../assets/haikei-blob-cluster.svg'
import { useGeolocation } from '../../hooks/useGeolocation'

/* ─── Real-Time CAD Iconography ────────────────────────────── */
function FloodWaterIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 13c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0M2 17c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0M12 3v4m-3 0h6" />
    </svg>
  )
}

function LandslideIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M4 20l6-11 4 6 6-9" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
      <circle cx="16" cy="11" r="1.5" fill="currentColor" />
    </svg>
  )
}

function FireFlareIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c1 3-2 5-2 8a6 6 0 1012 0c0-4-3-6-3-9-2 2-3 4-4 4s-2-1-3-3z" />
    </svg>
  )
}

function QuakeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-3 3 6 2-4 3 2 2-1h6" />
    </svg>
  )
}

function TraumaAmbulanceIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 17h2c.6 0 1-.4 1-1v-4l-3-4H4a1 1 0 00-1 1v8c0 .6.4 1 1 1h2m13 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M7 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0M9 9h4m-2-2v4" />
    </svg>
  )
}

function ShieldCheckIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function SatelliteBeaconIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

function MenuBarsIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

/* ─── Real-Time Data Specifications ────────────────────────── */
const disasters = [
  {
    id: 'flood',
    icon: FloodWaterIcon,
    title: 'Flood & Inundation',
    sub: 'Motorized Boats & Evacuation',
    cardClass: 'disaster-card-flood',
    iconBg: 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md',
    badge: 'WATER SQUAD',
    badgeStyle: { backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' },
  },
  {
    id: 'landslide',
    icon: LandslideIcon,
    title: 'Landslide',
    sub: 'Earth Movers & Shoring',
    cardClass: 'disaster-card-landslide',
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md',
    badge: 'HEAVY RESCUE',
    badgeStyle: { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fde68a' },
  },
  {
    id: 'fire',
    icon: FireFlareIcon,
    title: 'Fire Emergency',
    sub: 'Thermal Beacon & Water Tender',
    cardClass: 'disaster-card-fire',
    iconBg: 'bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-md',
    badge: 'HAZARD UNIT',
    badgeStyle: { backgroundColor: '#ffedd5', color: '#c2410c', borderColor: '#fed7aa' },
  },
  {
    id: 'earthquake',
    icon: QuakeIcon,
    title: 'Earthquake',
    sub: 'Acoustic Sounders & Medics',
    cardClass: 'disaster-card-earthquake',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-700 text-white shadow-md',
    badge: 'COLLAPSE SEARCH',
    badgeStyle: { backgroundColor: '#d1fae5', color: '#047857', borderColor: '#a7f3d0' },
  },
  {
    id: 'accident',
    icon: TraumaAmbulanceIcon,
    title: 'Trauma & Highway',
    sub: 'Advanced Life Support (ALS)',
    cardClass: 'disaster-card-accident',
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-md',
    badge: 'IMMEDIATE DISPATCH',
    badgeStyle: { backgroundColor: '#ffe4e6', color: '#be123c', borderColor: '#fecdd3' },
    wide: true
  },
]

const liveTickerItems = [
  { time: 'Just now', tag: 'DISPATCH', loc: 'Patna Sector 4', text: 'Rescue Unit 04 en route with 2 motorboats', status: 'live' },
  { time: '3m ago', tag: 'AIR-DROP', loc: 'Wayanad Zone B', text: 'Emergency relief kit air-drop scheduled (250 rations)', status: 'alert' },
  { time: '6m ago', tag: 'RESOLVED', loc: 'Guwahati Outskirts', text: 'Family of 4 extricated safely to relief camp', status: 'verified' },
  { time: '11m ago', tag: 'MEDICAL', loc: 'Shimla Ridge', text: 'ALS Ambulance reached accident site; telemetry synced', status: 'live' }
]

const operationalStats = [
  {
    value: '12,450+',
    label: 'Verified Lives Rescued',
    meta: 'Audited CAD logs',
    cardStyle: { backgroundColor: '#fff1f2', borderColor: '#fecdd3' },
    textStyle: { color: '#be123c' },
  },
  {
    value: '530+',
    label: 'Accredited NGO Units',
    meta: 'National Disaster Registry',
    cardStyle: { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' },
    textStyle: { color: '#0369a1' },
  },
  {
    value: '3m 42s',
    label: 'Median Dispatch Time',
    meta: 'Telemetry verified',
    cardStyle: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
    textStyle: { color: '#047857' },
  },
  {
    value: '28 States',
    label: 'Disaster Grid Coverage',
    meta: '100% Pan-India Active Relay',
    cardStyle: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
    textStyle: { color: '#b45309' },
  },
]

const missionFeatures = [
  {
    icon: SatelliteBeaconIcon,
    badge: 'CAD TELEMETRY',
    badgeStyle: { backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#7dd3fc' },
    iconBg: 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md',
    title: 'Precision GPS Distress Relaying',
    desc: 'Automated reverse-geocode coordinate streaming directly connects stranded victims with the nearest equipped emergency unit with sub-second transmission latency.',
    detail: 'Zero app installation required • Operates on low-bandwidth GSM & GPS',
    pill: '99.98% Telemetry Uptime',
    accentBorder: 'hover:border-sky-400',
    topBarStyle: { backgroundColor: '#0284c7' }
  },
  {
    icon: ShieldCheckIcon,
    badge: 'FISCAL AUDIT',
    badgeStyle: { backgroundColor: '#d1fae5', color: '#047857', borderColor: '#6ee7b7' },
    iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-700 text-white shadow-md',
    title: 'Cryptographic Transparency Ledger',
    desc: 'Donations are directly mapped to tangible field assets. Track exact rations, thermal blankets, and trauma medicine kits dispatched with geo-stamped delivery logs.',
    detail: 'Complete receipt audit trail • Direct donor-to-beneficiary link',
    pill: '100% Verified Impact',
    accentBorder: 'hover:border-emerald-400',
    topBarStyle: { backgroundColor: '#059669' },
    interactive: true
  },
  {
    icon: TraumaAmbulanceIcon,
    badge: 'LOGISTICS SYNC',
    badgeStyle: { backgroundColor: '#ffe4e6', color: '#be123c', borderColor: '#fda4af' },
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-md',
    title: 'Cross-Agency NGO Coordination',
    desc: 'Relief commanders orchestrate heavy extrication equipment, inflatable motorized boats, and trauma squads across state boundaries without telephone delays.',
    detail: 'Unified relief command portal • Automated proximity load-balancing',
    pill: '530+ Verified Field Units',
    accentBorder: 'hover:border-rose-400',
    topBarStyle: { backgroundColor: '#e11d48' }
  }
]

const operationalSteps = [
  {
    step: '01',
    phase: 'Distress Beacon Transmission',
    latency: 'Sub-2s Packet Relay',
    desc: 'Victims or eyewitnesses trigger the one-touch SOS beacon. The system captures exact latitude, longitude, and hazard severity, routing encrypted distress packets instantly.',
    accentStyle: { backgroundColor: '#ffe4e6', color: '#be123c', borderColor: '#fda4af' },
    stepStyle: { backgroundColor: '#e11d48', color: '#ffffff' }
  },
  {
    step: '02',
    phase: 'Automated Equipment Matching',
    latency: 'Dynamic Proximity Routing',
    desc: 'Our dispatch engine cross-references required assets (e.g. swift-water rescue craft, hydraulic cutters) against vetted NGOs within a 15 km operational perimeter.',
    accentStyle: { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fcd34d' },
    stepStyle: { backgroundColor: '#d97706', color: '#ffffff' }
  },
  {
    step: '03',
    phase: 'Real-Time Transponder Navigation',
    latency: 'Continuous GIS Streaming',
    desc: 'En route emergency vehicles stream continuous transponder telemetry back to the victim’s tracker, giving precise turn-by-turn ETA and immediate survival guidance.',
    accentStyle: { backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#7dd3fc' },
    stepStyle: { backgroundColor: '#0284c7', color: '#ffffff' }
  },
  {
    step: '04',
    phase: 'Verified Resolution & Log Closing',
    latency: 'Permanent Audit Trail',
    desc: 'Upon secure victim extraction, field squads close the dispatch ticket with headcount confirmation, triggering instant supply replenishment and donor audit updates.',
    accentStyle: { backgroundColor: '#d1fae5', color: '#047857', borderColor: '#6ee7b7' },
    stepStyle: { backgroundColor: '#059669', color: '#ffffff' }
  }
]

const survivorAccounts = [
  {
    quote: '"During the intense floods in North Bihar, standard phone lines collapsed. We hit the RescueConnect SOS beacon on our phone. A relief boat was assigned within 4 minutes, and we watched their live GPS approach until we were safely evacuated."',
    author: 'Rajesh & Meena Kumar',
    location: 'Patna District, Bihar',
    verified: 'Flood Rescue #SOS-8924 Verified',
    tag: 'SURVIVOR ACCOUNT',
    tagStyle: { backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#7dd3fc' },
    date: 'August 2026'
  },
  {
    quote: '"As an on-ground coordinator during the Kerala landslides, RescueConnect eliminated chaos. We received filtered triage requests with exact coordinates instead of scattered WhatsApp forwards. Every kit we delivered was transparently logged."',
    author: 'Capt. Priya Menon (Retd.)',
    location: 'Wayanad Relief Command, Kerala',
    verified: 'State NGO Partner #412',
    tag: 'FIELD COMMANDER',
    tagStyle: { backgroundColor: '#d1fae5', color: '#047857', borderColor: '#6ee7b7' },
    date: 'July 2026'
  },
  {
    quote: '"I contributed ₹15,000 for emergency medical supplies. Within 6 hours, I received a verified dispatch manifest showing 30 suture kits and trauma dressings delivered to field medics in Guwahati. The transparency is unlike anything else."',
    author: 'Amitabh Sharma',
    location: 'Mumbai, Maharashtra',
    verified: 'Direct Aid Contributor #884',
    tag: 'VERIFIED DONOR',
    tagStyle: { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fcd34d' },
    date: 'September 2026'
  }
]

export default function LandingPage({ user, onLogout, onLoginSuccess }) {
  const geo = useGeolocation()
  const [activeDisaster, setActiveDisaster] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showFiscalModal, setShowFiscalModal] = useState(false)
  const [authRole, setAuthRole] = useState('user')
  const [authMode, setAuthMode] = useState('login')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Real-time active emergency check
  const [activeSosId, setActiveSosId] = useState(() => {
    try { return localStorage.getItem('active_sos_id') } catch { return null }
  })
  const [activeEmergency, setActiveEmergency] = useState(null)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [tickerIndex, setTickerIndex] = useState(0)

  // Rotate live CAD ticker every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveTickerItems.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Poll for active emergency
  useEffect(() => {
    let isMounted = true
    const checkActive = async () => {
      if (typeof document !== 'undefined' && document.hidden) return
      try {
        const res = await apiGetActiveSos()
        if (res?.active && res.emergency && isMounted) {
          setActiveEmergency(res.emergency)
          setActiveSosId(res.emergency.sosId)
          try { localStorage.setItem('active_sos_id', res.emergency.sosId) } catch (e) { }
        } else if (!res?.active && isMounted) {
          setActiveEmergency(null)
          setActiveSosId(null)
          try { localStorage.removeItem('active_sos_id') } catch (e) { }
        }
      } catch (err) {
        // quiet error
      }
    }
    checkActive()
    const interval = setInterval(checkActive, 5000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [user])

  const openAuth = (role = 'user', mode = 'login') => {
    setAuthRole(role)
    setAuthMode(mode)
    setShowAuthModal(true)
    setMobileMenuOpen(false)
  }

  const handleSosCreated = (newSos) => {
    if (newSos?.sosId) {
      setActiveSosId(newSos.sosId)
      setActiveEmergency(newSos)
      setShowTrackingModal(true)
    }
  }

  const currentTicker = liveTickerItems[tickerIndex]

  return (
    <div className="min-h-screen bg-topo-grid font-sans text-slate-800 antialiased selection:bg-rose-500 selection:text-white flex flex-col">

      {/* ══════════════ 1. REFINED CAD TELEMETRY STATUS BAR (GUARANTEED DARK) ══════════════ */}
      <div
        className="w-full text-xs px-4 py-2.5 sticky top-0 z-50 shadow-md border-b"
        style={{ backgroundColor: '#080d1a', borderColor: '#1e293b', color: '#e2e8f0' }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] tracking-wider uppercase border shadow-xs"
              style={{ backgroundColor: '#022c22', borderColor: '#059669', color: '#6ee7b7' }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CAD GRID LIVE • 28 HUBS ACTIVE
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 font-mono text-[11px]">
              GEO-COORDS: 28.6139° N, 77.2090° E (CENTRAL RELAY)
            </span>
          </div>

          {/* Real-time incident ticker item */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shadow-xs"
              style={{
                backgroundColor: currentTicker.tag === 'DISPATCH' ? '#881337' : currentTicker.tag === 'RESOLVED' ? '#064e3b' : '#78350f',
                borderColor: currentTicker.tag === 'DISPATCH' ? '#f43f5e' : currentTicker.tag === 'RESOLVED' ? '#10b981' : '#f59e0b',
                color: currentTicker.tag === 'DISPATCH' ? '#fecdd3' : currentTicker.tag === 'RESOLVED' ? '#a7f3d0' : '#fde68a'
              }}
            >
              {currentTicker.tag}
            </span>
            <span className="text-sky-300 font-bold">[{currentTicker.loc}]</span>
            <span className="text-slate-200 hidden sm:inline">{currentTicker.text}</span>
            <span className="text-slate-400 text-[10px]">({currentTicker.time})</span>
          </div>
        </div>
      </div>

      {/* ══════════════ 2. MASTERPIECE RESPONSIVE HEADER ══════════════ */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-[37px] z-40 motion-spring shadow-xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">

          {/* Brand Logo with Guaranteed Vibrant Crimson Beveled Shield */}
          <a href="#hero" className="flex items-center gap-1.5 sm:gap-3.5 group shrink-0">
            <div
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md sm:shadow-lg group-hover:scale-105 motion-spring border shrink-0"
              style={{ backgroundColor: '#e11d48', borderColor: '#fda4af', boxShadow: '0 4px 14px -2px rgba(225,29,72,0.45)' }}
            >
              <ShieldCheckIcon className="w-4.5 h-4.5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 leading-none whitespace-nowrap">
                  Rescue<span style={{ color: '#e11d48' }}>Connect</span>
                </span>
                <span
                  className="px-1.5 py-0.5 sm:px-2 rounded text-[8px] sm:text-[9px] font-black tracking-wider uppercase text-white shadow-xs shrink-0"
                  style={{ backgroundColor: '#e11d48' }}
                >
                  CAD
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-black tracking-widest text-slate-500 mt-1 uppercase whitespace-nowrap">
                National Emergency Relay Grid
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 mx-auto">
            {[
              ['#hero', 'Home'],
              ['#features', 'Features'],
              ['#impact', 'Impact'],
              ['#how-it-works', 'How It Works'],
              ['#testimonials', 'Testimonials'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-xs font-black text-slate-600 hover:text-rose-600 tracking-wider uppercase transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Guaranteed Solid Red SOS Button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider shadow-md motion-press motion-spring cursor-pointer"
              style={{ backgroundColor: '#dc2626', color: '#ffffff', boxShadow: '0 4px 14px rgba(220,38,38,0.4)' }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>SOS Alert</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFiscalModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black motion-press motion-spring border shadow-xs cursor-pointer"
              style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Fiscal Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 motion-press motion-spring shadow-xs cursor-pointer"
            >
              <span>📋</span>
              <span>History</span>
            </button>

            {activeSosId && (
              <button
                type="button"
                onClick={() => setShowTrackingModal(true)}
                className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-black text-xs motion-spring shadow-sm border cursor-pointer"
                style={{ backgroundColor: '#ffe4e6', borderColor: '#fda4af', color: '#9f1239' }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>Live Radar</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3.5 sm:py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 shadow-sm motion-spring cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div
                    className="w-8 h-8 rounded-full text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0"
                    style={{ backgroundColor: '#e11d48' }}
                  >
                    {(user.name || user.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight whitespace-nowrap">
                      {user.name || user.username || 'Field Operator'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-extrabold leading-none flex items-center gap-1 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                    </span>
                  </div>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name || user.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email || 'Citizen Account'}</p>
                    </div>
                    <button
                      onClick={() => { setShowHistoryModal(true); setShowUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <span>📋</span> Rescue History
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false)
                        if (onLogout) onLogout()
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-slate-100 cursor-pointer"
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuth('user', 'login')}
                className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full border border-slate-300 text-xs font-black text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 shadow-sm motion-spring motion-press uppercase tracking-wider cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer shrink-0 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <MenuBarsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setShowModal(true); setMobileMenuOpen(false); }}
                className="p-3 rounded-2xl text-white font-black text-xs text-center flex items-center justify-center gap-2"
                style={{ backgroundColor: '#e11d48' }}
              >
                <span>🚨</span> Broadcast SOS
              </button>
              <button
                onClick={() => { setShowFiscalModal(true); setMobileMenuOpen(false); }}
                className="p-3 rounded-2xl border text-xs font-bold text-center flex items-center justify-center gap-2"
                style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}
              >
                <span>🛡️</span> Fiscal Audit
              </button>
            </div>
            {activeSosId && (
              <button
                onClick={() => { setShowTrackingModal(true); setMobileMenuOpen(false); }}
                className="w-full p-3 rounded-2xl border text-xs font-bold text-center flex items-center justify-center gap-2"
                style={{ backgroundColor: '#ffe4e6', borderColor: '#fda4af', color: '#9f1239' }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>Open Live Radar Tracker</span>
              </button>
            )}
            <div className="flex flex-col space-y-1 pt-2 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
              {[
                ['#hero', 'Home'],
                ['#features', 'Features'],
                ['#impact', 'Impact'],
                ['#how-it-works', 'How It Works'],
                ['#testimonials', 'Testimonials'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-2 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ══════════════ GUARANTEED DARK ACTIVE EMERGENCY STATUS BANNER ══════════════ */}
      {activeEmergency && (
        <div
          className="border-b px-4 py-3.5 shadow-lg"
          style={{
            backgroundColor: '#080d1a',
            backgroundImage: 'linear-gradient(to right, #080d1a 0%, #4c0519 50%, #080d1a 100%)',
            borderColor: '#e11d48',
            color: '#ffffff'
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs uppercase tracking-wider" style={{ color: '#fda4af' }}>
                    {activeEmergency.status === 'resolved'
                      ? '✅ Rescue Confirmed & Closed'
                      : activeEmergency.status === 'arrived'
                        ? '📍 Squad On-Site at Distress Coordinates'
                        : activeEmergency.matchedNgo
                          ? '🚑 Rescue Squad Mobilized & En Route'
                          : '🚨 Live SOS Broadcasted to Grid'}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                  >
                    #{activeEmergency.sosId}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#f1f5f9' }}>
                  {activeEmergency.status === 'resolved'
                    ? `Extraction confirmed. ${activeEmergency.rescued_people_count || 3} civilians safely brought to emergency camp.`
                    : activeEmergency.status === 'arrived'
                      ? 'Rescue boat has reached your coordinates. Follow on-site squad instructions.'
                      : activeEmergency.matchedNgo
                        ? `${activeEmergency.matchedNgo.name} is on the way. ETA: ${activeEmergency.eta || '15 mins'}.`
                        : 'Relaying distress telemetry to specialized relief squads within 15 km perimeter.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTrackingModal(true)}
                className="px-4 py-2 rounded-xl text-white font-black text-xs shadow-md flex items-center gap-1.5 motion-spring motion-press cursor-pointer"
                style={{ backgroundColor: '#e11d48', boxShadow: '0 4px 14px rgba(225,29,72,0.45)' }}
              >
                <span>📡</span>
                <span>Open Tactical Radar</span>
              </button>
              {activeEmergency.status === 'resolved' && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveEmergency(null)
                    try { localStorage.removeItem('active_sos_id') } catch (e) { }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ 3. HERO & MASTERPIECE SOS RELAY CONSOLE ══════════════ */}
      <main className="flex-1">
        <section className="relative pt-12 pb-20 lg:pt-18 lg:pb-24 overflow-hidden" id="hero">

          {/* Multi-gradient Haikei Wave Backdrop */}
          <div className="absolute inset-0 pointer-events-none -z-10 opacity-80">
            <img src={haikeiHeroWaves} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-1/4 right-0 pointer-events-none -z-10 opacity-40 max-w-2xl">
            <img src={haikeiBlobCluster} alt="" className="w-full h-auto" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

            {/* Mission Ribbon */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black mb-6 shadow-xs"
              style={{ backgroundColor: '#ffffff', borderColor: '#fca5a5', color: '#881337' }}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse-dot" />
              <span>NATIONAL MULTI-DISASTER CAD EMERGENCY RELAY SYSTEM</span>
            </div>

            {/* Dynamic Two-Tone Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl leading-[1.1]">
              Rapid Response.<br />
              <span className="text-gradient-rescue">Zero Confusion.</span> Saved Lives.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              When disaster strikes, ordinary cellular lines fail. RescueConnect bridges stranded citizens, specialized motorboats, and trauma medics via automated GIS telemetry with zero bureaucratic delay.
            </p>

            {/* Guaranteed Solid Red & Emerald Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-black text-sm shadow-xl hover:scale-[1.02] motion-press motion-spring cursor-pointer"
                style={{
                  backgroundColor: '#e11d48',
                  backgroundImage: 'linear-gradient(to right, #e11d48, #be123c)',
                  boxShadow: '0 8px 25px rgba(225,29,72,0.45)'
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span>TRANSMIT EMERGENCY SOS</span>
              </button>

              <button
                onClick={() => setShowFiscalModal(true)}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white font-extrabold text-sm border shadow-sm motion-press motion-spring cursor-pointer hover:bg-emerald-50"
                style={{ borderColor: '#6ee7b7', color: '#047857' }}
              >
                <span>🛡️</span>
                <span>Track Relief Fund Ledgers</span>
              </button>
            </div>

            {/* Color-Coded Disaster Scenario Grid */}
            <div className="mt-14 w-full max-w-5xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-[11px] font-black tracking-widest uppercase text-slate-500">
                  Select Disaster Scenario for Pre-Configured Squad Dispatch
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {disasters.map((d) => {
                  const IconComp = d.icon
                  const isSelected = activeDisaster === d.id
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveDisaster(isSelected ? null : d.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 motion-spring motion-press cursor-pointer ${d.cardClass} ${d.wide ? 'col-span-2 sm:col-span-1' : ''
                        } ${isSelected ? 'active ring-2 ring-rose-400' : 'bg-white border-slate-200'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${d.iconBg} flex items-center justify-center shrink-0`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border"
                          style={d.badgeStyle}
                        >
                          {d.badge}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 leading-tight mt-1">{d.title}</h4>
                        <p className="text-[11px] text-slate-500">{d.sub}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ══════════════ 3D TACTILE SOS BUTTON & RELAY CONSOLE ══════════════ */}
            <div className="mt-14 w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-9 flex flex-col items-center relative overflow-hidden">

              {/* Tactical Status Header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border"
                  style={{ backgroundColor: '#ffe4e6', borderColor: '#fca5a5', color: '#9f1239' }}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  CAD Emergency Transponder Active
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-slate-500">AES-256 Encrypted</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center tracking-tight">
                Distress Telemetry Transponder
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 text-center mt-1 mb-8 max-w-md">
                One touch locks device latitude &amp; longitude coordinates and broadcasts directly to the closest standby relief fleet.
              </p>

              {/* Telemetry Status Badges */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {/* Dynamic Real-Time GPS Status Box */}
                {geo.status === 'granted' && geo.coords ? (
                  <div
                    className="flex items-center justify-between p-3 rounded-2xl border shadow-xs"
                    style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div
                        className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                        style={{ backgroundColor: '#059669' }}
                      >
                        📍
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-950">
                            GPS Fix: Locked
                          </p>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[130px] sm:max-w-[160px]" title={geo.address || `${geo.coords.lat}, ${geo.coords.lng}`}>
                          {geo.city ? `${geo.city} • ` : ''}{geo.coords.lat}, {geo.coords.lng}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full font-black text-[10px] border shrink-0"
                      style={{ backgroundColor: '#d1fae5', borderColor: '#6ee7b7', color: '#047857' }}
                    >
                      ±{geo.accuracy || 10}m
                    </span>
                  </div>
                ) : geo.status === 'locating' ? (
                  <div
                    className="flex items-center gap-3 p-3 rounded-2xl border shadow-xs text-left"
                    style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                      style={{ backgroundColor: '#0284c7' }}
                    >
                      <span className="animate-spin text-sm">🛰️</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-sky-950">Acquiring GPS Fix...</p>
                      <p className="text-xs font-bold text-slate-700">Detecting device coordinates</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between p-3 rounded-2xl border shadow-xs"
                    style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <div
                        className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                        style={{ backgroundColor: '#d97706' }}
                      >
                        📍
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-amber-950">
                          {geo.status === 'denied' ? 'GPS Blocked' : 'GPS Permission Needed'}
                        </p>
                        <p className="text-[11px] text-amber-900 font-semibold">
                          {geo.status === 'denied' ? 'Click 🔒 in address bar' : 'Allow for auto-dispatch'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={geo.requestLocation}
                      className="px-2.5 py-1 rounded-lg font-black text-[10px] uppercase text-white shadow-xs motion-press cursor-pointer shrink-0"
                      style={{ backgroundColor: '#d97706' }}
                    >
                      {geo.status === 'denied' ? 'Retry' : 'Allow GPS'}
                    </button>
                  </div>
                )}

                <div
                  className="flex items-center justify-between p-3 rounded-2xl border shadow-xs"
                  style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                      style={{ backgroundColor: '#d97706' }}
                    >
                      🚑
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#b45309' }}>Nearby Squads</p>
                      <p className="text-xs font-bold text-slate-800">14 Units Monitoring</p>
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full font-black text-[10px] border"
                    style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d', color: '#78350f' }}
                  >
                    STANDBY
                  </span>
                </div>
              </div>

              {/* Warning Banner if Location Permission is Denied on Browser */}
              {geo.status === 'denied' && (
                <div
                  className="w-full -mt-4 mb-6 p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 shadow-xs"
                  style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg shrink-0">⚠️</span>
                    <div className="text-xs">
                      <p className="font-black text-rose-950">GPS Location Blocked</p>
                      <p className="text-rose-800 text-[11px] mt-0.5">
                        Click the 🔒 icon next to the address in your browser URL bar, enable Location, then click Retry.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={geo.requestLocation}
                    className="px-3 py-1.5 rounded-xl font-black text-[11px] text-white shadow-xs shrink-0 motion-press cursor-pointer"
                    style={{ backgroundColor: '#dc2626' }}
                  >
                    Retry GPS
                  </button>
                </div>
              )}

              {/* 3D Masterpiece Tactile SOS Trigger with Guaranteed Vibrant Ruby Red */}
              <div className="relative my-4 flex items-center justify-center">
                {/* Sonar Ring 1 */}
                <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-rose-500/25 animate-radar-1 pointer-events-none" />
                {/* Sonar Ring 2 */}
                <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-amber-500/20 animate-radar-2 pointer-events-none" />

                {/* 3D Tactile Push-Button */}
                <button
                  type="button"
                  aria-label="Transmit Distress Coordinates"
                  onClick={() => setShowModal(true)}
                  className="relative z-10 w-44 h-44 sm:w-50 sm:h-50 rounded-full flex flex-col items-center justify-center text-white border-4 border-rose-200/90 glow-signal motion-press motion-spring hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer"
                  style={{
                    backgroundColor: '#e11d48',
                    backgroundImage: 'radial-gradient(circle at 35% 30%, #fb7185 0%, #e11d48 50%, #9f1239 100%)',
                    boxShadow: '0 0 0 6px rgba(244,63,94,0.3), 0 16px 36px rgba(225,29,72,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  <span className="text-3xl mb-1 group-hover:scale-110 motion-spring">🚨</span>
                  <span className="text-3xl sm:text-4xl font-black tracking-widest leading-none drop-shadow-md">
                    SOS
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-100 mt-1">
                    TRANSMIT RELAY
                  </span>
                </button>
              </div>

              <p className="mt-5 text-xs font-bold text-slate-700 flex items-center gap-1.5 text-center">
                <span className="font-black" style={{ color: '#e11d48' }}>👆 Tap or Press to Transmit Coordinates</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Low-bandwidth failover • Dual satellite &amp; cellular relay
              </p>

              {/* Priority Hotline Call Bar */}
              <div className="w-full mt-6">
                <a
                  href="tel:112"
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all group shadow-xs"
                  style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-xs"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      📞
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#be123c' }}>Priority Hotline</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">National Emergency Disaster Call 112</p>
                    </div>
                  </div>
                  <span className="font-black group-hover:translate-x-1 motion-spring text-xs" style={{ color: '#dc2626' }}>
                    Call Now →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Haikei Organic Wave Divider: Hero -> Features */}
        <HaikeiWaveDivider
          variant="top"
          gradient={{ from: '#ffe4e6', to: '#ffffff', id: 'hero-to-features', fromOpacity: 0.8, toOpacity: 1 }}
          height="56px"
        />

        {/* ══════════════ FEATURES SECTION: CAD DISPATCH ECOSYSTEM ══════════════ */}
        <section className="py-20 bg-white border-b border-slate-200" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider mb-3">
                MISSION-CRITICAL CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Designed for Field Operations, Not Theory
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                Engineered in collaboration with disaster response teams across India to eliminate telephone delays and provide complete operational traceability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {missionFeatures.map((f, i) => {
                const IconComp = f.icon
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (f.interactive) setShowFiscalModal(true)
                    }}
                    className={`card-tactile p-8 rounded-3xl transition-all flex flex-col relative overflow-hidden ${f.accentBorder} ${f.interactive ? 'cursor-pointer group' : ''
                      }`}
                  >
                    <div className="h-1.5 w-full absolute top-0 left-0" style={f.topBarStyle} />

                    <div className="flex items-center justify-between mb-6 pt-1">
                      <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center text-white`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
                        style={f.badgeStyle}
                      >
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                      {f.title}
                      {f.interactive && (
                        <span className="text-xs text-emerald-600 group-hover:translate-x-1 motion-spring">↗</span>
                      )}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {f.desc}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>{f.detail}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══════════════ IMPACT SECTION: REAL AUDITED NUMBERS ══════════════ */}
        <section className="py-20 bg-topo-grid" id="impact">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-black uppercase mb-4 shadow-2xs"
                style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                VERIFIED TELEMETRY AUDIT
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Accountability in Every Single Minute
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Real-world disaster relief requires uncompromising proof. Every coordinate transmission, fuel dispatch, and supply parcel is permanently ledgered.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {operationalStats.map((stat, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl border text-center flex flex-col items-center motion-spring shadow-sm"
                  style={stat.cardStyle}
                >
                  <div className="text-4xl sm:text-5xl font-black tracking-tight" style={stat.textStyle}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900 mt-2">
                    {stat.label}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">
                    {stat.meta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Haikei Organic Wave Divider: Impact -> How It Works */}
        <HaikeiWaveDivider
          variant="bottom"
          gradient={{ from: '#faf8f5', to: '#ffffff', id: 'impact-to-how-it-works', fromOpacity: 1, toOpacity: 1 }}
          height="52px"
        />

        {/* ══════════════ HOW IT WORKS: 4-STAGE OPERATIONAL PROTOCOL ══════════════ */}
        <section className="py-20 bg-white border-b border-slate-200" id="how-it-works">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider mb-3">
                STANDARD OPERATING PROCEDURE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                The 4-Minute Life-Saving Protocol
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                How our automated CAD system routes victims to field extrication teams without intermediate operator bottlenecks.
              </p>
            </div>

            <div className="space-y-6">
              {operationalSteps.map((step, i) => (
                <div
                  key={i}
                  className="card-tactile p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 motion-spring"
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-mono font-bold text-lg flex items-center justify-center shrink-0 shadow-md"
                    style={step.stepStyle}
                  >
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-black text-slate-900">
                        {step.phase}
                      </h3>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-black border"
                        style={step.accentStyle}
                      >
                        {step.latency}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ SURVIVOR & OPERATOR FIELD RECORDS ══════════════ */}
        <section className="py-20 bg-topo-grid" id="testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-700 text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
                FIELD VERIFICATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Accounts from the Disaster Zone
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Direct experiences from verified flood and landslide survivors, search &amp; rescue commanders, and humanitarian micro-donors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {survivorAccounts.map((item, i) => (
                <div key={i} className="card-tactile p-8 rounded-3xl flex flex-col justify-between motion-spring hover:shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider"
                        style={item.tagStyle}
                      >
                        {item.tag}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                      {item.quote}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm font-black text-slate-900">{item.author}</p>
                    <p className="text-xs text-slate-500">{item.location}</p>
                    <p className="text-[10px] font-mono font-black mt-1" style={{ color: '#047857' }}>
                      {item.verified}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Haikei Organic Wave Divider: Testimonials -> Footer */}
      <HaikeiWaveDivider
        variant="top"
        gradient={{ from: '#faf8f5', to: '#080d1a', id: 'content-to-footer', fromOpacity: 1, toOpacity: 1 }}
        height="64px"
      />

      {/* ══════════════ 4. MISSION-GRADE 5-COLUMN FOOTER (GUARANTEED DARK) ══════════════ */}
      <footer
        className="w-full pt-10 pb-12 border-t"
        style={{ backgroundColor: '#080d1a', borderColor: '#1e293b', color: '#94a3b8' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main 5-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-slate-800">

            {/* Col 1: Brand & Relay Architecture */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-lg text-white"
                  style={{ backgroundColor: '#e11d48' }}
                >
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Rescue<span style={{ color: '#fb7185' }}>Connect</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed max-w-sm" style={{ color: '#94a3b8' }}>
                India's unified multi-disaster computer-aided dispatch (CAD) relay. Coordinating flood, fire, earthquake, and trauma relief operations across 28 states with zero telephone friction and cryptographic ledger transparency.
              </p>

              {/* Certification Badges */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2 font-bold" style={{ color: '#34d399' }}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>NDRF &amp; State Disaster Grid Synchronized</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: '#64748b' }}>
                  <span>🛡️ ISO 27001 Certified CAD Relay</span>
                  <span>•</span>
                  <span>AES-256 Encrypted</span>
                </div>
              </div>
            </div>

            {/* Col 2: Citizen Services */}
            <div className="lg:col-span-2 space-y-3 text-xs">
              <h4 className="font-black text-white uppercase tracking-wider">CITIZEN RELAY</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => setShowModal(true)} className="hover:text-rose-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>Broadcast Emergency SOS</button></li>
                <li><button onClick={() => setShowHistoryModal(true)} className="hover:text-rose-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>Track Incident by ID</button></li>
                <li><button onClick={() => setShowFiscalModal(true)} className="hover:text-rose-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>Relief Supplies Ledger</button></li>
                <li><a href="tel:112" className="hover:text-rose-400 transition text-left" style={{ color: '#cbd5e1' }}>National Emergency 112</a></li>
              </ul>
            </div>

            {/* Col 3: NGO Portal */}
            <div className="lg:col-span-2 space-y-3 text-xs">
              <h4 className="font-black text-white uppercase tracking-wider">NGO PORTAL</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => openAuth('ngo', 'login')} className="hover:text-rose-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>Fleet Dispatch Console</button></li>
                <li><button onClick={() => openAuth('ngo', 'register')} className="hover:text-rose-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>Accreditation Application</button></li>
                <li><button onClick={() => openAuth('admin', 'login')} className="hover:text-rose-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>National Grid Admin</button></li>
                <li><a href="#impact" className="hover:text-rose-400 transition text-left" style={{ color: '#cbd5e1' }}>State Coverage Matrix</a></li>
              </ul>
            </div>

            {/* Col 4: Donor Transparency */}
            <div className="lg:col-span-2 space-y-3 text-xs">
              <h4 className="font-black text-white uppercase tracking-wider">TRANSPARENCY</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => setShowFiscalModal(true)} className="hover:text-emerald-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>100% Itemized Kits</button></li>
                <li><button onClick={() => setShowFiscalModal(true)} className="hover:text-emerald-400 transition text-left cursor-pointer" style={{ color: '#cbd5e1' }}>Direct Relief Vouchers</button></li>
                <li><span style={{ color: '#64748b' }}>Tax Exemption 80G Compliant</span></li>
                <li><span style={{ color: '#64748b' }}>Zero Intermediary Deductions</span></li>
              </ul>
            </div>

            {/* Col 5: 24/7 National Emergency Helplines Directory (High Contrast Cards) */}
            <div className="lg:col-span-2 space-y-3 text-xs">
              <h4 className="font-black text-white uppercase tracking-wider">CRISIS DIRECTORY</h4>
              <div className="space-y-2 pt-1">
                <a
                  href="tel:112"
                  className="flex items-center justify-between p-2.5 rounded-xl border font-bold transition shadow-xs"
                  style={{ backgroundColor: '#4c0519', borderColor: '#f43f5e', color: '#fecdd3' }}
                >
                  <span>112 All Emergencies</span>
                  <span className="text-[10px] font-mono font-black" style={{ color: '#ffffff' }}>24/7</span>
                </a>
                <a
                  href="tel:1078"
                  className="flex items-center justify-between p-2.5 rounded-xl border font-bold transition shadow-xs"
                  style={{ backgroundColor: '#082f49', borderColor: '#0ea5e9', color: '#bae6fd' }}
                >
                  <span>1078 NDRF Disaster</span>
                  <span className="text-[10px] font-mono font-black" style={{ color: '#ffffff' }}>Direct</span>
                </a>
                <a
                  href="tel:108"
                  className="flex items-center justify-between p-2.5 rounded-xl border font-bold transition shadow-xs"
                  style={{ backgroundColor: '#064e3b', borderColor: '#10b981', color: '#a7f3d0' }}
                >
                  <span>108 Trauma Ambulance</span>
                  <span className="text-[10px] font-mono font-black" style={{ color: '#ffffff' }}>Toll-Free</span>
                </a>
                <a
                  href="tel:101"
                  className="flex items-center justify-between p-2.5 rounded-xl border font-bold transition shadow-xs"
                  style={{ backgroundColor: '#78350f', borderColor: '#f59e0b', color: '#fde68a' }}
                >
                  <span>101 Fire Brigade</span>
                  <span className="text-[10px] font-mono font-black" style={{ color: '#ffffff' }}>Fast</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Indian Tricolor Badge */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono" style={{ color: '#64748b' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
                style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
              >
                <span className="flex h-2.5 w-4 rounded-xs overflow-hidden border border-slate-700">
                  <span className="w-1/3 bg-[#FF9933]" />
                  <span className="w-1/3 bg-white" />
                  <span className="w-1/3 bg-[#138808]" />
                </span>
                <span className="font-bold text-slate-200">Built with pride for humanitarian relief across India</span>
              </div>
            </div>
            <p>© 2026 RescueConnect Dispatch Protocol • Real-Time Geographical Telemetry Engine</p>
          </div>
        </div>
      </footer>

      {/* ══════════════ MODALS ══════════════ */}
      <EmergencyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        preselectedType={activeDisaster}
        user={user}
        onSosCreated={handleSosCreated}
        geo={geo}
      />

      <RescueTrackingModal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        sosId={activeSosId}
        initialEmergency={activeEmergency}
      />

      <SosHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialRole={authRole}
        initialMode={authMode}
        onLoginSuccess={onLoginSuccess}
      />

      <FiscalTransparencyModal
        isOpen={showFiscalModal}
        onClose={() => setShowFiscalModal(false)}
      />
    </div>
  )
}
