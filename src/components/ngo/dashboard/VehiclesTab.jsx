import { useState } from 'react'

const INITIAL_FLEET = [
  {
    id: 'AM-01',
    name: 'Ambulance AM-01 (Advanced Life Support)',
    type: 'Emergency Ambulance',
    emoji: '🚑',
    driver: 'Karan Malhotra',
    status: 'En Route',
    roadNav: 'Active (OSRM)',
    location: 'Patna Riverside Sector',
    fuel: 86,
    equipment: ['Defibrillator', 'Ventilator', 'Spine Board', 'Oxygen Tanks'],
    speed: '42 km/h',
    assignedRescue: '#SOS-647499',
  },
  {
    id: 'AM-02',
    name: 'Ambulance AM-02 (Rapid Response)',
    type: 'Emergency Ambulance',
    emoji: '🚑',
    driver: 'Suresh Raina',
    status: 'Standby Base',
    roadNav: 'Standby',
    location: 'Patna Central Hospital Station',
    fuel: 94,
    equipment: ['First Aid Trauma Kit', 'AED', 'Stretcher'],
    speed: '0 km/h',
    assignedRescue: null,
  },
  {
    id: 'RB-04',
    name: 'Rescue Boat RB-04 (High Capacity)',
    type: 'Motorized Flood Raft',
    emoji: '🚤',
    driver: 'Vikram Singh (Pilot)',
    status: 'En Route',
    roadNav: 'Waterway Vector',
    location: 'Ganga Flood Basin',
    fuel: 75,
    equipment: ['Life Vests (12)', 'Throw Ropes', 'Echo Sounder', 'Thermal Camera'],
    speed: '18 knots',
    assignedRescue: '#SOS-442656',
  },
  {
    id: 'RB-08',
    name: 'Rescue Boat RB-08 (Zodiac Swift)',
    type: 'Inflatable Zodiac Craft',
    emoji: '🚤',
    driver: 'Anil Kumar',
    status: 'Standby Base',
    roadNav: 'Standby',
    location: 'Patna Ghat Relief Dock',
    fuel: 100,
    equipment: ['Life Jackets (8)', 'Padded Rescue Sled', 'Emergency Beacon'],
    speed: '0 knots',
    assignedRescue: null,
  },
  {
    id: 'QR-01',
    name: 'All-Terrain Quick Response Unit (4x4)',
    type: 'Disaster Evacuation Van',
    emoji: '🚒',
    driver: 'Rajesh Sharma',
    status: 'Available',
    roadNav: 'Ready',
    location: 'Central Relief Depot',
    fuel: 90,
    equipment: ['Winch (5 Ton)', 'Submersible Pumps', 'Flood Lighting Rig'],
    speed: '0 km/h',
    assignedRescue: null,
  },
]

export default function VehiclesTab({ showToast }) {
  const [fleet, setFleet] = useState(INITIAL_FLEET)
  const [filter, setFilter] = useState('all')

  const filtered = fleet.filter(v => {
    if (filter === 'all') return true
    if (filter === 'ambulance') return v.type.toLowerCase().includes('ambulance')
    if (filter === 'boat') return v.type.toLowerCase().includes('boat') || v.type.toLowerCase().includes('raft')
    return v.status.toLowerCase() === filter.toLowerCase()
  })

  const toggleStatus = (id) => {
    setFleet(prev => prev.map(v => {
      if (v.id === id) {
        const next = v.status === 'En Route' ? 'Standby Base' : 'En Route'
        showToast(`${v.name} status updated to ${next}!`)
        return { ...v, status: next }
      }
      return v
    }))
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🚑</span>
            <h2 className="text-xl font-black text-slate-900">Rescue Fleet &amp; Craft Logistics</h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              {fleet.length} Operational Vehicles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time GPS transponders, turn-by-turn road navigation status, fuel telemetry and equipment onboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'ambulance', 'boat', 'En Route'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition ${
                filter === f
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((v) => {
          const isEnRoute = v.status === 'En Route'
          return (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200 shrink-0">
                      {v.emoji}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                        Unit {v.id} • {v.type}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-tight mt-0.5">
                        {v.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Status & Telemetry Pill */}
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1.5 ${
                    isEnRoute
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isEnRoute ? 'bg-rose-600 animate-ping' : 'bg-emerald-500'}`} />
                    {v.status.toUpperCase()}
                  </span>

                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                    🛣️ {v.roadNav}
                  </span>
                </div>

                {/* Details specs */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Assigned Driver / Pilot</span>
                    <span className="font-bold text-slate-800">{v.driver}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Current Sector</span>
                    <span className="font-bold text-slate-800 truncate max-w-[160px]">{v.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Telemetry Speed</span>
                    <span className="font-mono font-bold text-slate-800">{v.speed}</span>
                  </div>
                  {v.assignedRescue && (
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-medium">Mission Linked</span>
                      <span className="font-bold text-rose-600">{v.assignedRescue}</span>
                    </div>
                  )}

                  {/* Fuel gauge */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>Fuel / Battery Level</span>
                      <span className={v.fuel < 40 ? 'text-rose-600 font-black' : 'text-emerald-600 font-black'}>
                        {v.fuel}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          v.fuel < 40 ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${v.fuel}%` }}
                      />
                    </div>
                  </div>

                  {/* Onboard Gear */}
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                      Medical &amp; Tactical Gear
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {v.equipment.map((eq, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md border border-slate-200">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => toggleStatus(v.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    isEnRoute
                      ? 'bg-slate-800 hover:bg-slate-900 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {isEnRoute ? 'Mark as Standby' : '🚀 Dispatch Vehicle'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
