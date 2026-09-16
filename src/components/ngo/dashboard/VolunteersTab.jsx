import { useState } from 'react'

const INITIAL_VOLUNTEERS = [
  { id: 'VOL-101', name: 'Dr. Aarav Sharma', role: 'Chief Medical Officer / Paramedic', team: 'Team Alpha', phone: '+91 98765 11201', skills: ['Trauma Care', 'Triage', 'BLS Certified'], status: 'Deployed', location: 'Riverside Sector 4' },
  { id: 'VOL-102', name: 'Vikram Singh', role: 'Motorized Boat Pilot & Diver', team: 'Team Alpha', phone: '+91 98765 11202', skills: ['Swiftwater Rescue', 'Navigation', 'Night Diving'], status: 'Deployed', location: 'Riverside Sector 4' },
  { id: 'VOL-103', name: 'Priya Verma', role: 'Emergency Dispatcher & Comms', team: 'Base Operations', phone: '+91 98765 11203', skills: ['Radio Comms', 'GIS Mapping', 'CAD Triage'], status: 'On Duty', location: 'Command Base' },
  { id: 'VOL-104', name: 'Rohan Mehra', role: 'Heavy Evacuation Specialist', team: 'Team Bravo', phone: '+91 98765 11204', skills: ['High-Angle Rescue', 'Structural Collapse', 'First Aid'], status: 'Standby', location: 'Patna Central Hub' },
  { id: 'VOL-105', name: 'Sunita Patel', role: 'Food & Emergency Logistics', team: 'Team Charlie', phone: '+91 98765 11205', skills: ['Ration Distribution', 'Camp Shelter', 'Child Care'], status: 'On Duty', location: 'Relief Center 2' },
  { id: 'VOL-106', name: 'Karan Malhotra', role: 'Ambulance Driver & Technician', team: 'Team Alpha', phone: '+91 98765 11206', skills: ['Emergency Driving', 'Life Support', 'Mechanic'], status: 'Deployed', location: 'En Route (AM-01)' },
]

export default function VolunteersTab({ showToast }) {
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS)
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [newVol, setNewVol] = useState({ name: '', role: 'First Responder', team: 'Team Alpha', phone: '', skills: 'First Aid' })

  const filtered = volunteers.filter(v => {
    if (filter === 'all') return true
    return v.status.toLowerCase() === filter.toLowerCase()
  })

  const handleAddVolunteer = (e) => {
    e.preventDefault()
    if (!newVol.name || !newVol.phone) return
    const created = {
      id: `VOL-${Math.floor(100 + Math.random() * 900)}`,
      name: newVol.name,
      role: newVol.role,
      team: newVol.team,
      phone: newVol.phone,
      skills: newVol.skills.split(',').map(s => s.trim()),
      status: 'Standby',
      location: 'Command Base Station',
    }
    setVolunteers([created, ...volunteers])
    setModalOpen(false)
    setNewVol({ name: '', role: 'First Responder', team: 'Team Alpha', phone: '', skills: 'First Aid' })
    showToast(`Volunteer ${created.name} onboarded to ${created.team}!`)
  }

  const toggleStatus = (id) => {
    setVolunteers(prev => prev.map(v => {
      if (v.id === id) {
        const next = v.status === 'Deployed' ? 'On Duty' : v.status === 'On Duty' ? 'Standby' : 'Deployed'
        showToast(`${v.name} status changed to ${next}`)
        return { ...v, status: next }
      }
      return v
    }))
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👥</span>
            <h2 className="text-xl font-black text-slate-900">Volunteers &amp; Field Responders</h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {volunteers.length} Active Personnel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified rescue divers, paramedics, logistics specialists and ambulance drivers available for dispatch.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <span>＋</span>
          <span>Add New Volunteer</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'deployed', 'on duty', 'standby'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${
              filter === f
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f} ({f === 'all' ? volunteers.length : volunteers.filter(v => v.status.toLowerCase() === f).length})
          </button>
        ))}
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Volunteer</th>
                <th className="px-5 py-3.5">Assigned Squad</th>
                <th className="px-5 py-3.5">Specialization &amp; Skills</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Sector</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                        {v.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{v.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{v.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {v.team}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {v.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/80 px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-600">
                    <a href={`tel:${v.phone}`} className="text-teal-600 hover:underline flex items-center gap-1">
                      📞 {v.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    📍 {v.location}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${
                      v.status === 'Deployed' ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse' :
                      v.status === 'On Duty' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      ● {v.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(v.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition"
                    >
                      Cycle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Volunteer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Field Volunteer</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleAddVolunteer} className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newVol.name}
                  onChange={e => setNewVol({ ...newVol, name: e.target.value })}
                  placeholder="e.g. Rahul Sen"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newVol.phone}
                  onChange={e => setNewVol({ ...newVol, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Role / Position</label>
                  <select
                    value={newVol.role}
                    onChange={e => setNewVol({ ...newVol, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option>First Responder</option>
                    <option>Paramedic / Medic</option>
                    <option>Rescue Boat Pilot</option>
                    <option>Ambulance Driver</option>
                    <option>Logistics Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Assigned Team</label>
                  <select
                    value={newVol.team}
                    onChange={e => setNewVol({ ...newVol, team: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option>Team Alpha</option>
                    <option>Team Bravo</option>
                    <option>Team Charlie</option>
                    <option>Base Comms</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Skills / Certifications (comma separated)</label>
                <input
                  type="text"
                  value={newVol.skills}
                  onChange={e => setNewVol({ ...newVol, skills: e.target.value })}
                  placeholder="e.g. CPR, Swimmer, Water Rescue"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-md transition"
                >
                  Onboard Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
