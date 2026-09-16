import { useState } from 'react'

const INITIAL_RESOURCES = [
  { id: 'RES-01', name: 'Adult USCG Life Jackets', category: 'Water Safety', stock: 124, max: 150, unit: 'Units', icon: '🦺' },
  { id: 'RES-02', name: 'Child / Infant Life Vests', category: 'Water Safety', stock: 45, max: 60, unit: 'Units', icon: '🦺' },
  { id: 'RES-03', name: 'Inflatable 8-Person Life Rafts', category: 'Evacuation', stock: 12, max: 15, unit: 'Rafts', icon: '🛶' },
  { id: 'RES-04', name: 'Advanced Trauma & Burn Medical Kits', category: 'Medical', stock: 38, max: 50, unit: 'Kits', icon: '🩹' },
  { id: 'RES-05', name: 'Emergency MRE Food Rations (3-Day)', category: 'Rations', stock: 1420, max: 2000, unit: 'Packs', icon: '🥫' },
  { id: 'RES-06', name: 'Gravity Water Purification Filters', category: 'Hygiene', stock: 310, max: 500, unit: 'Filters', icon: '💧' },
  { id: 'RES-07', name: 'High-Lumen Tactical Searchlights', category: 'Equipment', stock: 24, max: 30, unit: 'Lights', icon: '🔦' },
  { id: 'RES-08', name: 'Portable Gasoline Inverter Generators', category: 'Power', stock: 6, max: 8, unit: 'Generators', icon: '⚡' },
]

export default function ResourcesTab({ showToast }) {
  const [resources, setResources] = useState(INITIAL_RESOURCES)

  const restock = (id) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        showToast(`Requisition sent: +10 ${r.unit} of ${r.name} ordered!`)
        return { ...r, stock: Math.min(r.max, r.stock + 10) }
      }
      return r
    }))
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📦</span>
            <h2 className="text-xl font-black text-slate-900">Relief Supplies &amp; Equipment Inventory</h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {resources.length} Tracked Item Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock indicators for disaster mitigation, emergency food, water filtration and field gear.
          </p>
        </div>

        <button
          onClick={() => showToast('Master warehouse restock requisition generated!')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
        >
          <span>📋</span>
          <span>Generate Restock Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((r) => {
          const percent = Math.round((r.stock / r.max) * 100)
          const isLow = percent < 40
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-2xl">{r.icon}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    isLow ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    {isLow ? 'Low Stock' : 'Ample Supply'}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm mt-2.5">{r.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium">{r.category}</p>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">{r.stock}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {r.max} {r.unit}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-rose-500' : 'bg-teal-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{percent}% Available</span>
                <button
                  onClick={() => restock(r.id)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                >
                  ＋ Add Stock
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
