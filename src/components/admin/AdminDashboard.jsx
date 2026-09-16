import { useState, useEffect } from 'react'
import AdminSidebar from './dashboard/AdminSidebar'
import AdminTopBar from './dashboard/AdminTopBar'
import AdminMetricsCards from './dashboard/AdminMetricsCards'
import SosStatusChart from './dashboard/SosStatusChart'
import NgoStatusChart from './dashboard/NgoStatusChart'
import AdminRecentSosTable from './dashboard/AdminRecentSosTable'
import RecentUsersTable from './dashboard/RecentUsersTable'
import RecentNgosTable from './dashboard/RecentNgosTable'
import AdminFooter from './dashboard/AdminFooter'
import AdminRescueMonitorModal from './dashboard/AdminRescueMonitorModal'
import {
  apiGetAdminStats,
  apiGetAdminNgos,
  apiGetEmergencies,
  apiToggleVerifyNgo,
  apiDeleteAdminRequest
} from '../../services/api'

export default function AdminDashboard({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [monitoredSos, setMonitoredSos] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Real-time backend states (initialized to empty, populated live from DB)
  const [stats, setStats] = useState({
    totalRequests: 0,
    registeredNgos: 0,
    pendingRequests: 0,
    activeRescues: 0,
    resolvedRescues: 0,
    peopleHelped: 0
  })
  const [sosList, setSosList] = useState([])
  const [ngosList, setNgosList] = useState([])
  const [usersList, setUsersList] = useState([])

  // Live polling for real-time synchronization
  const fetchAdminData = async () => {
    try {
      // 1. Fetch real-time metrics
      const statsRes = await apiGetAdminStats()
      if (statsRes) {
        setStats(statsRes)
      }

      // 2. Fetch live emergencies list
      const emergencies = await apiGetEmergencies()
      if (Array.isArray(emergencies)) {
        const formatted = emergencies.map((e) => ({
          id: e.id || e.sosId,
          type: e.type || (e.disaster ? e.disaster.toUpperCase() : 'EMERGENCY'),
          priority: e.urgency ? e.urgency.toUpperCase() : 'HIGH',
          priorityClass: e.urgency === 'critical' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200',
          status: (e.status || 'pending').replace('_', ' ').toUpperCase(),
          statusClass: e.status === 'resolved' 
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : ['accepted', 'assigned', 'dispatched', 'on_the_way', 'arrived'].includes(e.status)
            ? 'bg-blue-100 text-blue-700 border-blue-200'
            : 'bg-amber-100 text-amber-800 border-amber-200',
          createdAt: e.createdAt || e.time || 'Just now',
          raw: e
        }))
        setSosList(formatted)

        // Derive registered reporting citizens dynamically
        const uniqueCitizens = []
        const seenPhones = new Set()
        emergencies.forEach((e) => {
          if (e.phone && !seenPhones.has(e.phone)) {
            seenPhones.add(e.phone)
            uniqueCitizens.push({
              id: `USR-${e.phone.slice(-4)}`,
              name: e.name || 'Citizen Reporter',
              phone: e.phone,
              role: 'Citizen',
              status: 'Active'
            })
          }
        })
        if (uniqueCitizens.length > 0) {
          setUsersList(uniqueCitizens)
        }
      }

      // 3. Fetch registered NGOs
      const ngos = await apiGetAdminNgos()
      if (Array.isArray(ngos) && ngos.length > 0) {
        setNgosList(ngos.map(n => ({
          id: n.id,
          name: n.name,
          specialization: Array.isArray(n.specializations) ? n.specializations.join(', ') : (n.specializations || 'Flood'),
          location: n.city || n.address || 'Patna',
          status: n.isVerified ? 'Verified' : 'Pending',
          boats: n.boats,
          volunteers: n.volunteers
        })))
      }
    } catch (err) {
      console.warn('Real-time admin sync notice:', err)
    }
  }

  useEffect(() => {
    fetchAdminData()
    // Poll every 2.5 seconds for instant real-time updates
    const interval = setInterval(fetchAdminData, 2500)
    return () => clearInterval(interval)
  }, [])

  const toggleUserStatus = (userId) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Blocked' : 'Active'
          showToast(`User ${u.name} is now ${newStatus}`)
          return { ...u, status: newStatus }
        }
        return u
      })
    )
  }

  const toggleNgoStatus = async (ngoId) => {
    try {
      const res = await apiToggleVerifyNgo(ngoId)
      setNgosList((prev) =>
        prev.map((n) => {
          if (n.id === ngoId) {
            const newStatus = res.isVerified ? 'Verified' : 'Pending'
            showToast(`NGO ${n.name} status updated to ${newStatus}`)
            return { ...n, status: newStatus }
          }
          return n
        })
      )
    } catch (e) {
      showToast('Could not update NGO status')
    }
  }

  return (
    <div className="bg-[#f8fafc] text-slate-800 antialiased h-screen flex flex-col lg:flex-row font-sans selection:bg-teal-100 selection:text-teal-900 overflow-hidden">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Header */}
        <AdminTopBar
          setMobileMenuOpen={setMobileMenuOpen}
          showToast={showToast}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          onLogout={onLogout}
        />

        {/* Dashboard Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Metrics Summary Cards */}
          <AdminMetricsCards stats={stats} />

          {/* Mid Section: Charts & SOS Table */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <SosStatusChart sosList={sosList} stats={stats} />
            <NgoStatusChart ngosList={ngosList} />
            <AdminRecentSosTable
              sosList={sosList}
              showToast={showToast}
              onSelectSos={(item) => setMonitoredSos(item)}
            />
          </section>

          {/* Bottom Tables Section */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RecentUsersTable usersList={usersList} toggleUserStatus={toggleUserStatus} />
            <RecentNgosTable ngosList={ngosList} toggleNgoStatus={toggleNgoStatus} />
          </section>
        </div>

        {/* Admin Live Tracking Monitor Modal */}
        {monitoredSos && (
          <AdminRescueMonitorModal
            isOpen={Boolean(monitoredSos)}
            onClose={() => setMonitoredSos(null)}
            sosId={monitoredSos.id}
            initialRecord={monitoredSos}
          />
        )}

        {/* Footer */}
        <AdminFooter />
      </main>
    </div>
  )
}
