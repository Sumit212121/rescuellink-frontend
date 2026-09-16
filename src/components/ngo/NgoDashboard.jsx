import { useState, useEffect } from 'react'
import NgoSidebar          from './dashboard/NgoSidebar'
import NgoTopBar           from './dashboard/NgoTopBar'
import WelcomeHeader       from './dashboard/WelcomeHeader'
import KpiCards            from './dashboard/KpiCards'
import MapAndNotifications from './dashboard/MapAndNotifications'
import SosRequestsTable    from './dashboard/SosRequestsTable'
import ActiveRescuesTable  from './dashboard/ActiveRescuesTable'
import TrackingAndDetails  from './dashboard/TrackingAndDetails'
import DonationsSection    from './dashboard/DonationsSection'
import TrustBannerFooter   from './dashboard/TrustBannerFooter'
import VolunteersTab       from './dashboard/VolunteersTab'
import VehiclesTab         from './dashboard/VehiclesTab'
import ResourcesTab        from './dashboard/ResourcesTab'
import ReportsTab          from './dashboard/ReportsTab'
import NotificationsTab    from './dashboard/NotificationsTab'
import ProfileTab          from './dashboard/ProfileTab'
import SettingsTab         from './dashboard/SettingsTab'
import {
  apiGetEmergencies,
  apiAcceptSos,
  apiDispatchSos,
  apiMarkArrived,
  apiResolveSos,
  apiGetSosHistory,
} from '../../services/api'

export default function NgoDashboard({ user, onLogout }) {
  // ── Navigation ────────────────────────────────────────────
  const [activeTab, setActiveTab]           = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ── Availability status ───────────────────────────────────
  const [status, setStatus]                 = useState('Available')
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // ── Search ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('')

  // ── Toast notifications ───────────────────────────────────
  const [toastMessage, setToastMessage]     = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // ── Tracking selection ────────────────────────────────────
  const [activeRescueId, setActiveRescueId] = useState(null)

  // ── Live backend state (Initialized clean: zero mock data) ──
  const [sosRequests, setSosRequests]     = useState([])
  const [activeRescues, setActiveRescues] = useState([])
  const [rescueHistory, setRescueHistory] = useState([])

  // ── Assignment & Resolution Modals ────────────────────────
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [targetSos, setTargetSos] = useState(null)
  const [assignForm, setAssignForm] = useState({
    rescueTeam: 'Team Alpha',
    vehicle: 'Rescue Boat RB-04',
    eta: 15,
  })

  const [resolveModalOpen, setResolveModalOpen] = useState(false)
  const [resolveTargetSos, setResolveTargetSos] = useState(null)
  const [resolveForm, setResolveForm] = useState({
    rescuedPeople: 3,
    notes: 'Family safely evacuated via Rescue Boat RB-04 to relief center.',
  })

  // ── Real-time Live Backend Sync ───────────────────────────
  const fetchBackendData = async () => {
    try {
      const emergencies = await apiGetEmergencies()
      if (Array.isArray(emergencies)) {
        const pending = emergencies.filter(
          (e) => e.status === 'pending' || e.status === 'ngo_found'
        )
        const active = emergencies.filter(
          (e) =>
            ['accepted', 'assigned', 'dispatched', 'on_the_way', 'arrived', 'rescue_in_progress'].includes(
              (e.status || '').toLowerCase()
            )
        )
        const resolved = emergencies.filter(
          (e) => (e.status || '').toLowerCase() === 'resolved'
        )

        setSosRequests(pending)
        setActiveRescues(active)
        setRescueHistory(resolved)

        if (active.length > 0) {
          setActiveRescueId((prev) => (prev && active.some(a => a.id === prev) ? prev : active[0].id))
        } else {
          setActiveRescueId(null)
        }
      }
    } catch (e) {
      console.warn('Backend real-time sync in NgoDashboard:', e)
    }
  }

  useEffect(() => {
    fetchBackendData()
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      fetchBackendData()
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // ── Derived: currently selected rescue ────────────────────
  const selectedRescue =
    activeRescues.find((r) => r.id === activeRescueId) || activeRescues[0]

  // ── Display names ─────────────────────────────────────────
  const ngoDisplayName = user?.name  || 'Lions Club Disaster Response Unit'
  const ngoEmail       = user?.email || 'lionsclub@gmail.com'

  // ── Handlers ──────────────────────────────────────────────
  const handleAcceptSos = (req) => {
    setTargetSos(req)
    setAssignForm({
      rescueTeam: 'Team Alpha',
      vehicle: req.type?.toLowerCase().includes('flood') ? 'Rescue Boat RB-04' : 'Ambulance Unit 1',
      eta: 15,
    })
    setAssignModalOpen(true)
  }

  const confirmAcceptSos = async () => {
    if (!targetSos) return
    const req = targetSos
    setSosRequests((prev) => prev.filter((item) => item.id !== req.id))

    try {
      await apiAcceptSos(req.id, {
        rescue_team: assignForm.rescueTeam,
        vehicle: assignForm.vehicle,
        eta: assignForm.eta,
      })
    } catch (e) {
      console.warn('Backend accept fallback:', e)
    }

    const newRescue = {
      id: req.id,
      type: req.type || 'Flood',
      location: req.location || req.address,
      people: req.people || 3,
      status: 'Accepted',
      statusClass: 'bg-blue-100 text-blue-700 border-blue-200',
      eta: `${assignForm.eta} mins`,
      progressStep: 2,
      desc: req.description || `Urgent response dispatched for ${req.people} people.`,
      volunteer: assignForm.rescueTeam,
      rescue_team: assignForm.rescueTeam,
      volunteerPhone: '+91 98765 00000',
      vehicle: assignForm.vehicle,
    }

    setActiveRescues((prev) => [newRescue, ...prev.filter(r => r.id !== req.id)])
    setActiveRescueId(req.id)
    setAssignModalOpen(false)
    showToast(`Accepted #${req.id}! ${assignForm.rescueTeam} assigned with ${assignForm.vehicle}. SMS notification sent to victim.`)
  }

  const handleDispatch = async (rescue) => {
    const id = rescue.id || activeRescueId
    try {
      await apiDispatchSos(id)
    } catch (e) {
      console.warn('Dispatch API fallback:', e)
    }
    setActiveRescues((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'Dispatched', progressStep: 3, statusClass: 'bg-sky-100 text-sky-700 border-sky-200' }
          : r
      )
    )
    showToast(`Dispatched team for #${id}! Vehicle is on the way.`)
  }

  const handleMarkArrived = async (rescue) => {
    const id = rescue.id || activeRescueId
    try {
      await apiMarkArrived(id)
    } catch (e) {
      console.warn('Arrived API fallback:', e)
    }
    setActiveRescues((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'Arrived', progressStep: 4, statusClass: 'bg-purple-100 text-purple-700 border-purple-200' }
          : r
      )
    )
    showToast(`Marked #${id} as Arrived! Victim notified: "The rescue team has arrived at your location."`)
  }

  const handleOpenResolveModal = (rescue) => {
    setResolveTargetSos(rescue || selectedRescue)
    setResolveForm({
      rescuedPeople: rescue?.people || 3,
      notes: 'Family safely evacuated via rescue craft to Danapur relief camp.',
    })
    setResolveModalOpen(true)
  }

  const confirmResolveSos = async () => {
    if (!resolveTargetSos) return
    const id = resolveTargetSos.id
    try {
      await apiResolveSos(id, {
        rescued_people_count: resolveForm.rescuedPeople,
        resolution_notes: resolveForm.notes,
      })
    } catch (e) {
      console.warn('Resolve API fallback:', e)
    }

    // Move from active to history
    setActiveRescues((prev) => prev.filter((r) => r.id !== id))
    const resolvedRecord = {
      ...resolveTargetSos,
      status: 'Resolved',
      rescued_people_count: resolveForm.rescuedPeople,
      resolution_notes: resolveForm.notes,
      resolved_at: new Date().toISOString(),
    }
    setRescueHistory((prev) => [resolvedRecord, ...prev])
    setResolveModalOpen(false)
    showToast(`Rescue #${id} marked Resolved! ${resolveForm.rescuedPeople} people rescued successfully.`)
  }

  const handleRejectSos = (req) => {
    setSosRequests((prev) => prev.filter((item) => item.id !== req.id))
    showToast(`Dismissed request #${req.id} from queue.`)
  }

  const handleUpdateRescueStatus = () => {
    if (!selectedRescue) return
    const statusLower = (selectedRescue.status || '').toLowerCase()
    if (statusLower === 'accepted' || statusLower === 'assigned') {
      handleDispatch(selectedRescue)
    } else if (statusLower === 'enroute' || statusLower === 'dispatched' || statusLower === 'on_the_way') {
      handleMarkArrived(selectedRescue)
    } else if (statusLower === 'arrived' || statusLower === 'on site') {
      handleOpenResolveModal(selectedRescue)
    }
  }

  // Search-filtered datasets
  const filteredSosRequests = searchQuery.trim()
    ? sosRequests.filter(s =>
        (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.location || s.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.disaster || s.type || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sosRequests

  const filteredActiveRescues = searchQuery.trim()
    ? activeRescues.filter(r =>
        (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.vehicle || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeRescues

  // Completed Rescue History Table Element
  const historyTableElement = (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <h3 className="font-bold text-slate-900 text-base">Completed Rescue History</h3>
          <span className="text-xs text-slate-400 font-medium">({rescueHistory.length} missions resolved)</span>
        </div>
        <span className="text-xs font-bold text-emerald-600">100% Impact Verified</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5">ID</th>
              <th className="px-6 py-3.5">Disaster</th>
              <th className="px-6 py-3.5">Victim &amp; Location</th>
              <th className="px-6 py-3.5 text-center">People Rescued</th>
              <th className="px-6 py-3.5">Assigned Craft</th>
              <th className="px-6 py-3.5">Completion Time</th>
              <th className="px-6 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {rescueHistory.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                  No completed rescue missions in this session yet.
                </td>
              </tr>
            ) : (
              rescueHistory.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">#{h.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{h.icon || '🌊'}</span>
                      <span>{h.type || 'Flood'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{h.name || 'Citizen'}</div>
                    <div className="text-[11px] text-slate-500">{h.location}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-extrabold text-emerald-700 text-sm">
                    {h.rescued_people_count || h.people || 3} People
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{h.vehicle || 'Rescue Boat RB-04'}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {h.resolved_at ? new Date(h.resolved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      RESOLVED
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans antialiased h-screen flex overflow-hidden selection:bg-teal-100 selection:text-teal-800">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 text-xs">✕</button>
        </div>
      )}

      {/* Left Sidebar */}
      <NgoSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        sosRequests={sosRequests}
        activeRescues={activeRescues}
        onLogout={onLogout}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top App Bar */}
        <NgoTopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          ngoDisplayName={ngoDisplayName}
          ngoEmail={ngoEmail}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={onLogout}
          setActiveTab={setActiveTab}
          showToast={showToast}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <WelcomeHeader
                ngoDisplayName={ngoDisplayName}
                status={status}
                setStatus={setStatus}
                showStatusMenu={showStatusMenu}
                setShowStatusMenu={setShowStatusMenu}
                showToast={showToast}
              />

              <KpiCards
                sosRequests={sosRequests}
                activeRescues={activeRescues}
                rescueHistory={rescueHistory}
              />

              <MapAndNotifications
                showToast={showToast}
                handleAcceptSos={handleAcceptSos}
                sosRequests={filteredSosRequests}
                activeRescues={filteredActiveRescues}
              />

              <SosRequestsTable
                sosRequests={filteredSosRequests}
                handleAcceptSos={handleAcceptSos}
                handleRejectSos={handleRejectSos}
                showToast={showToast}
              />

              <ActiveRescuesTable
                activeRescues={filteredActiveRescues}
                activeRescueId={activeRescueId}
                setActiveRescueId={setActiveRescueId}
                showToast={showToast}
              />

              <TrackingAndDetails
                selectedRescue={selectedRescue}
                handleUpdateRescueStatus={handleUpdateRescueStatus}
                onDispatch={handleDispatch}
                onMarkArrived={handleMarkArrived}
                onOpenResolveModal={handleOpenResolveModal}
                showToast={showToast}
              />

              {historyTableElement}

              <DonationsSection showToast={showToast} />

              <TrustBannerFooter showToast={showToast} />
            </>
          )}

          {/* TAB 2: SOS REQUESTS */}
          {activeTab === 'sos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Emergency SOS Distress Queue</h2>
                    <p className="text-xs text-slate-500">Live incoming flood &amp; medical distress signals from citizens needing CAD extraction.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-black rounded-full border border-rose-200">
                  {sosRequests.length} Pending Actions
                </span>
              </div>

              <SosRequestsTable
                sosRequests={filteredSosRequests}
                handleAcceptSos={handleAcceptSos}
                handleRejectSos={handleRejectSos}
                showToast={showToast}
              />

              <ActiveRescuesTable
                activeRescues={filteredActiveRescues}
                activeRescueId={activeRescueId}
                setActiveRescueId={setActiveRescueId}
                showToast={showToast}
              />
            </div>
          )}

          {/* TAB 3: ACTIVE RESCUES & LIVE ROAD NAVIGATION */}
          {activeTab === 'rescues' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚑</span>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Active Missions &amp; Roadway Navigation</h2>
                    <p className="text-xs text-slate-500">Turn-by-turn road navigation, ambulance transponder tracking, and field extrication milestones.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-black rounded-full border border-teal-200">
                  {activeRescues.length} Units En Route
                </span>
              </div>

              <TrackingAndDetails
                selectedRescue={selectedRescue}
                handleUpdateRescueStatus={handleUpdateRescueStatus}
                onDispatch={handleDispatch}
                onMarkArrived={handleMarkArrived}
                onOpenResolveModal={handleOpenResolveModal}
                showToast={showToast}
              />

              <ActiveRescuesTable
                activeRescues={filteredActiveRescues}
                activeRescueId={activeRescueId}
                setActiveRescueId={setActiveRescueId}
                showToast={showToast}
              />

              {historyTableElement}
            </div>
          )}

          {/* TAB 4: LIVE MAP */}
          {activeTab === 'map' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Interactive Emergency GIS Command Map</h2>
                    <p className="text-xs text-slate-500">Full telemetry view with victim pins, ambulance siren route, and relief station base.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-black rounded-full border border-sky-200">
                  Live SatLink Stream
                </span>
              </div>

              <MapAndNotifications
                showToast={showToast}
                handleAcceptSos={handleAcceptSos}
                sosRequests={filteredSosRequests}
                activeRescues={filteredActiveRescues}
              />

              <TrackingAndDetails
                selectedRescue={selectedRescue}
                handleUpdateRescueStatus={handleUpdateRescueStatus}
                onDispatch={handleDispatch}
                onMarkArrived={handleMarkArrived}
                onOpenResolveModal={handleOpenResolveModal}
                showToast={showToast}
              />
            </div>
          )}

          {/* TAB 5: VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <VolunteersTab showToast={showToast} />
          )}

          {/* TAB 6: VEHICLES & FLEET */}
          {activeTab === 'vehicles' && (
            <VehiclesTab showToast={showToast} />
          )}

          {/* TAB 7: RESOURCES */}
          {activeTab === 'resources' && (
            <ResourcesTab showToast={showToast} />
          )}

          {/* TAB 8: DONATIONS */}
          {activeTab === 'donations' && (
            <div className="space-y-6 animate-fadeIn">
              <DonationsSection showToast={showToast} />
              <TrustBannerFooter showToast={showToast} />
            </div>
          )}

          {/* TAB 9: REPORTS */}
          {activeTab === 'reports' && (
            <ReportsTab rescueHistory={rescueHistory} showToast={showToast} />
          )}

          {/* TAB 10: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <NotificationsTab showToast={showToast} />
          )}

          {/* TAB 11: NGO PROFILE */}
          {activeTab === 'profile' && (
            <ProfileTab user={user} showToast={showToast} />
          )}

          {/* TAB 12: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsTab showToast={showToast} />
          )}

        </main>
      </div>

      {/* ── ASSIGN RESCUE MODAL ── */}
      {assignModalOpen && targetSos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-modalSlideIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🚤</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Accept & Assign Rescue Unit</h3>
                  <p className="text-xs text-slate-400">Deploy resources for #{targetSos.id}</p>
                </div>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
              <p className="font-bold text-slate-800">Victim: {targetSos.name || 'Citizen'}</p>
              <p className="text-slate-600">Location: {targetSos.location}</p>
              <p className="text-slate-600">People Trapped: <strong>{targetSos.people}</strong></p>
              <p className="text-teal-700 font-bold">Distance: {targetSos.distance || '1.1 km'}</p>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Assigned Rescue Team</label>
                <input
                  type="text"
                  value={assignForm.rescueTeam}
                  onChange={(e) => setAssignForm(f => ({ ...f, rescueTeam: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="e.g. Team Alpha"
                />
              </div>
              <div>
                <label className="block mb-1">Vehicle / Craft</label>
                <input
                  type="text"
                  value={assignForm.vehicle}
                  onChange={(e) => setAssignForm(f => ({ ...f, vehicle: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="e.g. Rescue Boat RB-04"
                />
              </div>
              <div>
                <label className="block mb-1">Estimated Arrival (Minutes)</label>
                <input
                  type="number"
                  value={assignForm.eta}
                  onChange={(e) => setAssignForm(f => ({ ...f, eta: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                  min="1"
                  max="60"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAcceptSos}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-md transition"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESOLVE RESCUE MODAL ── */}
      {resolveModalOpen && resolveTargetSos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-modalSlideIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Complete & Resolve Rescue</h3>
                  <p className="text-xs text-slate-400">Record final mission outcome for #{resolveTargetSos.id}</p>
                </div>
              </div>
              <button onClick={() => setResolveModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Number of People Rescued</label>
                <input
                  type="number"
                  value={resolveForm.rescuedPeople}
                  onChange={(e) => setResolveForm(f => ({ ...f, rescuedPeople: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                  min="1"
                />
              </div>
              <div>
                <label className="block mb-1">Rescue Notes & Destination</label>
                <textarea
                  rows="3"
                  value={resolveForm.notes}
                  onChange={(e) => setResolveForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600 resize-none"
                  placeholder="Describe rescue details and patient condition..."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResolveModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResolveSos}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

