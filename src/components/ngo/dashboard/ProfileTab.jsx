import { useState } from 'react'

export default function ProfileTab({ user, showToast }) {
  const [profile, setProfile] = useState({
    name: user?.name || 'Lions Club Disaster Response Unit',
    email: user?.email || 'lionsclub@gmail.com',
    phone: user?.phone || '+91 98765 00000',
    address: user?.address || 'Patna Riverside Headquarters, Gandhi Maidan Road',
    city: user?.city || 'Patna',
    pincode: user?.pincode || '800001',
    regNo: 'NGO-BIH-2021-98841',
    ambulances: user?.ambulances || 2,
    boats: user?.boats || 4,
    fireTrucks: user?.fire_trucks || 1,
    volunteers: user?.volunteers || 35,
    coverage: '15 km Operational Radius',
  })

  const handleSave = (e) => {
    e.preventDefault()
    showToast('NGO organization credentials & operational profile updated!')
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-teal-500/20">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{profile.name}</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ✓ Government Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registration No: <span className="font-mono font-bold text-slate-700">{profile.regNo}</span> • Authorized CAD First Responder
            </p>
          </div>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
          <span className="text-2xl">🚑</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{profile.ambulances}</p>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Ambulances</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
          <span className="text-2xl">🚤</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{profile.boats}</p>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Rescue Boats</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
          <span className="text-2xl">🚒</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{profile.fireTrucks}</p>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Quick Units</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
          <span className="text-2xl">👥</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{profile.volunteers}</p>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Volunteers</span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 text-xs font-bold text-slate-700">
        <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5">
          Organization Credentials &amp; Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Organization Legal Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block mb-1">24/7 Emergency Hotline</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block mb-1">Official Dispatch Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block mb-1">Operational City &amp; Pincode</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={profile.city}
                onChange={e => setProfile({ ...profile, city: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
              />
              <input
                type="text"
                value={profile.pincode}
                onChange={e => setProfile({ ...profile, pincode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1">Headquarters Physical Address</label>
          <input
            type="text"
            value={profile.address}
            onChange={e => setProfile({ ...profile, address: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-md transition"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  )
}
