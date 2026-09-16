import { useState } from 'react'

export default function SettingsTab({ showToast }) {
  const [settings, setSettings] = useState({
    dispatchRadius: 15,
    telemetryRate: '2',
    sirenSound: true,
    roadNavigationMode: true,
    autoAcceptCritical: false,
    smsAlerts: true,
  })

  const saveSettings = (e) => {
    e.preventDefault()
    showToast('Command Center settings saved successfully!')
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⚙️</span>
          <h2 className="text-xl font-black text-slate-900">Command Center &amp; CAD Settings</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure real-time telemetry streaming parameters, automated road navigation, and emergency sound alerts.
        </p>
      </div>

      <form onSubmit={saveSettings} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5 text-xs font-bold text-slate-700">
        {/* Radius Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-slate-900 font-extrabold text-sm">Automated CAD Dispatch Radius</label>
            <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
              {settings.dispatchRadius} km Radial Perimeter
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            step="1"
            value={settings.dispatchRadius}
            onChange={e => setSettings({ ...settings, dispatchRadius: Number(e.target.value) })}
            className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>5 km (Local Sector)</span>
            <span>20 km (Metropolitan)</span>
            <span>40 km (District Regional)</span>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Telemetry Frequency */}
        <div>
          <label className="text-slate-900 font-extrabold text-sm block mb-1">GPS Telemetry Stream Frequency</label>
          <p className="text-[11px] text-slate-400 font-normal mb-2">Controls WebSocket transponder update rate for ambulances and rescue boats.</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: '1', label: 'Ultra High (1s)' },
              { val: '2', label: 'Balanced (2s)' },
              { val: '5', label: 'Low Bandwidth (5s)' },
            ].map(opt => (
              <button
                type="button"
                key={opt.val}
                onClick={() => setSettings({ ...settings, telemetryRate: opt.val })}
                className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition ${
                  settings.telemetryRate === opt.val
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Toggles */}
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-slate-900 font-extrabold">🛣️ Real Road Navigation Engine (OSRM)</p>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">Route ambulances along actual roads and streets instead of straight lines.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.roadNavigationMode}
              onChange={e => setSettings({ ...settings, roadNavigationMode: e.target.checked })}
              className="w-4 h-4 accent-teal-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-slate-900 font-extrabold">🚨 Emergency Siren Sound Alert on Critical SOS</p>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">Play high-priority audible dispatch tone when life-threatening emergency enters radius.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.sirenSound}
              onChange={e => setSettings({ ...settings, sirenSound: e.target.checked })}
              className="w-4 h-4 accent-teal-600 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-slate-900 font-extrabold">📲 Immediate Volunteer SMS Broadcast</p>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">Auto-transmit emergency coordinates to active duty team leads.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsAlerts}
              onChange={e => setSettings({ ...settings, smsAlerts: e.target.checked })}
              className="w-4 h-4 accent-teal-600 cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold rounded-xl text-xs shadow-md transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
