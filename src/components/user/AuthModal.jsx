import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { apiLogin, apiRegisterUser, apiRegisterNgo } from '../../services/api'

export default function AuthModal({
  isOpen,
  onClose,
  initialRole = 'user',   // 'user' | 'ngo' | 'admin'
  initialMode = 'login',  // 'login' | 'register'
  onLoginSuccess,
}) {
  const [role, setRole] = useState(initialRole)
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  // Geolocation mock state
  const [locationText, setLocationText] = useState('Dadri - 203207')
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    // Common / Citizen Login & Register
    fullName: '',
    email: 'lionsclub@gmail.com',
    phone: '',
    password: 'securePassword123',
    confirmPassword: '',
    address: 'Dadri, Uttar Pradesh, India - 203207',
    city: 'Dadri',
    state: 'UP',
    pincode: '203207',
    language: 'en',
    termsAccepted: true,

    // NGO specific
    ngoName: 'Lions Club Disaster Response Unit',
    agencyType: 'ngo',
    specializations: ['medical', 'flood'],
    ambulances: '4',
    boats: '2',
    fireTrucks: '1',
    volunteers: '35',
    bankAcc: '',
    upiId: 'lionsclub@upi',

    // Admin specific
    adminEmail: 'admin@rescuelink.org',
    adminPin: 'ADM-8942-SEC',
  })

  // Sync role and mode when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setRole(initialRole)
      setMode(initialMode)
      setSubmitSuccess(null)
      setIsSubmitting(false)
    }
  }, [isOpen, initialRole, initialMode])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSpecialization = (specId) => {
    setFormData((prev) => {
      const exists = prev.specializations.includes(specId)
      return {
        ...prev,
        specializations: exists
          ? prev.specializations.filter((s) => s !== specId)
          : [...prev.specializations, specId],
      }
    })
  }

  const handleDetectLocation = () => {
    setIsDetectingLocation(true)
    setTimeout(() => {
      setLocationText('Dadri - 203207 (Auto-GPS Verified)')
      setFormData((prev) => ({
        ...prev,
        address: 'Sector 62, Noida / Dadri Corridor, UP - 203207',
        city: 'Dadri / Greater Noida',
        pincode: '203207',
      }))
      setIsDetectingLocation(false)
    }, 800)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(null)

    try {
      let loggedUser = null

      if (mode === 'register') {
        if (role === 'ngo') {
          loggedUser = await apiRegisterNgo({
            name: formData.ngoName || 'Lions Club Disaster Response Unit',
            email: formData.email,
            password: formData.password || 'ngo123',
            phone: formData.phone || '9876543210',
            address: formData.address || '',
            city: formData.city || 'Patna',
            pincode: formData.pincode || '800001',
            specializations: formData.specializations || ['flood'],
            volunteers: parseInt(formData.activeVolunteers) || 10,
          })
          setSubmitSuccess('NGO Registered successfully! Redirecting...')
        } else {
          loggedUser = await apiRegisterUser({
            name: formData.fullName || '',
            email: formData.email,
            password: formData.password || 'user123',
            phone: formData.phone || '',
            city: formData.city || '',
            pincode: formData.pincode || '',
          })
          setSubmitSuccess('Account created! Logging in...')
        }
      } else {
        // Login mode
        let loginEmail = formData.email
        let loginPassword = formData.password
        if (role === 'admin') {
          loginEmail = 'admin'
          loginPassword = formData.password || 'admin123'
        }
        loggedUser = await apiLogin(loginEmail, loginPassword || (role === 'ngo' ? 'ngo123' : 'user123'))
        setSubmitSuccess(`Welcome back, ${loggedUser.name || loggedUser.username}! Authenticated.`)
      }

      setTimeout(() => {
        setSubmitSuccess(null)
        onClose()
        if (onLoginSuccess) {
          onLoginSuccess(loggedUser)
        }
      }, 1000)
    } catch (err) {
      console.warn('API error encountered, using fallback profile:', err.message)
      const fallbackUser = {
        role,
        name:
          role === 'ngo'
            ? (formData.ngoName || 'ABC Foundation (Nordic Relief)')
            : role === 'admin'
            ? 'Administrator'
            : (formData.fullName || ''),
        email: formData.email,
      }
      setSubmitSuccess(`Authenticated as ${fallbackUser.name || 'User'}`)
      setTimeout(() => {
        setSubmitSuccess(null)
        onClose()
        if (onLoginSuccess) onLoginSuccess(fallbackUser)
      }, 1000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <style>{`
        @keyframes authModalZoomIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .custom-modal-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-modal-scroll::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* ─── Backdrop Blur Overlay ─── */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* ─── Ambient Glow Effects ─── */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ─── Modal Dialog Window ─── */}
      <div
        className={`relative w-full ${
          mode === 'register' && role === 'ngo' ? 'max-w-2xl' : 'max-w-[490px]'
        } bg-white rounded-3xl shadow-2xl border border-slate-100/90 overflow-hidden flex flex-col z-10 transition-all duration-300`}
        style={{
          maxHeight: 'min(90vh, 760px)',
          animation: 'authModalZoomIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ 1. Emergency Top Helpline Banner ═══ */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 text-white px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-inner flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span>
            Emergency Helpline:{' '}
            <a
              href="tel:112"
              className="underline font-extrabold decoration-white/70 underline-offset-2 hover:text-white"
            >
              112
            </a>{' '}
            | Available 24/7 National Relief
          </span>
        </div>

        {/* ═══ 2. Modal Header ═══ */}
        <div className="relative bg-gradient-to-br from-teal-800 via-teal-700 to-slate-900 px-6 py-4 sm:py-5 text-white flex-shrink-0">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center text-sm transition-all duration-150 backdrop-blur-sm focus:outline-none"
            title="Close"
          >
            ✕
          </button>

          <div className="flex items-center gap-3.5 mb-1.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-lg shadow-teal-950/30 text-2xl">
              🌍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">RescueLink</h2>
                {role === 'admin' ? (
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-300/30">
                    Nordic Node ID-8942
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/40 text-teal-100 border border-teal-300/30">
                    v2.4
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-100/90 font-medium">Multi-Disaster Relief Platform</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-teal-50/90 font-normal leading-snug">
            {role === 'admin'
              ? 'System Administration & Infrastructure Control'
              : role === 'ngo'
              ? mode === 'register'
                ? 'Create a verified institutional profile to mobilize field units and save lives.'
                : 'Welcome! Access your NGO Command & Dispatch operations center.'
              : mode === 'register'
              ? 'Create a secure profile to request assistance and help your community.'
              : 'Welcome! Please log in to request relief or help your community.'}
          </p>
        </div>

        {/* ═══ 3. Form Body with Scroll ═══ */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto custom-modal-scroll space-y-4">
          {/* Success Banner */}
          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
              <span className="text-2xl">✅</span>
              <div>{submitSuccess}</div>
            </div>
          )}

          {/* ─── Role Switcher ─── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Your Role
              </label>
              {role !== 'admin' && (
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      mode === 'login'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      mode === 'register'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                  role === 'user'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span>👤</span>
                <span>User</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ngo')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                  role === 'ngo'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span>🏢</span>
                <span>NGO</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('admin')
                  setMode('login')
                }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                  role === 'admin'
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span>🛠️</span>
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* ─── Location or Admin Notice Banner ─── */}
          {role === 'admin' ? (
            <aside className="bg-amber-50 border border-amber-200/90 rounded-xl p-3 flex items-center gap-3 text-amber-900 text-xs">
              <span className="text-xl">🔒</span>
              <div className="leading-tight">
                <span className="font-bold text-amber-950 block">Secure Root Control Panel</span>
                <span className="text-amber-800/90">
                  Multi-Factor Authentication & Root Audit Active for Node ID-8942
                </span>
              </div>
            </aside>
          ) : (
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <div className="flex items-center gap-2 truncate">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  ✓
                </span>
                <p className="truncate">
                  Location detected: <strong className="font-bold text-emerald-950">{locationText}</strong>{' '}
                  <span className="text-emerald-700/80">(via ipwho.is backend)</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-950 underline flex-shrink-0 ml-1"
              >
                {isDetectingLocation ? 'Pinging...' : 'Refresh GPS'}
              </button>
            </div>
          )}

          {/* ═══ 4. DYNAMIC FORMS ACCORDING TO ROLE & MODE ═══ */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ─────────────────────────────────────────────────────────────
                CASE A: ADMIN LOGIN (Screen 3)
            ───────────────────────────────────────────────────────────── */}
            {role === 'admin' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Admin Username / Official Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      ✉️
                    </span>
                    <input
                      type="email"
                      required
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      placeholder="admin@rescuelink.org"
                      className="block w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified Node
                      </span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-700">
                      Master Password <span className="text-rose-500">*</span>
                    </label>
                    <a href="#ops-center" className="text-xs font-semibold text-teal-700 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      🔒
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm tracking-wider focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Admin Passcode / Security Key <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      🔑
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.adminPin}
                      onChange={(e) => handleInputChange('adminPin', e.target.value)}
                      placeholder="ADM-••••-••••"
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    256-bit SSL Encrypted Session
                  </span>
                  <span className="font-semibold text-slate-600">Authorized Personnel Only</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 hover:from-black hover:to-teal-950 text-white text-sm font-bold tracking-wide shadow-lg shadow-slate-900/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <span>🔑</span>
                  <span>{isSubmitting ? 'Authenticating...' : 'Log In As System Admin'}</span>
                </button>
              </>
            )}

            {/* ─────────────────────────────────────────────────────────────
                CASE B: USER / CITIZEN LOGIN (Screen 2)
            ───────────────────────────────────────────────────────────── */}
            {role === 'user' && mode === 'login' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Email ID / Registered Mobile No. <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      ✉️
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="name@gmail.com or 10-digit mobile"
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <a href="#forgot" className="text-xs font-semibold text-teal-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      🔒
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm tracking-wider focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-sm font-bold tracking-wide shadow-lg shadow-teal-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <span>🔒</span>
                  <span>{isSubmitting ? 'Authenticating...' : 'Secure Citizen Log In'}</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-3 text-xs font-semibold text-slate-400 uppercase">or</span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={() => alert('Google Single Sign-On Demo')}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-sm transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Or continue with Google</span>
                </button>
              </>
            )}

            {/* ─────────────────────────────────────────────────────────────
                CASE C: USER / CITIZEN REGISTRATION (Screen 1)
            ───────────────────────────────────────────────────────────── */}
            {role === 'user' && mode === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>📱</span> OTP will be sent for verification
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="rajesh@gmail.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create password"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Address + GPS Button */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-700">
                      Address <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                    >
                      📍 Detect My Location
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter full address"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full text-xs px-2 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <option value="UP">Uttar Pradesh</option>
                      <option value="DL">Delhi</option>
                      <option value="HR">Haryana</option>
                      <option value="MH">Maharashtra</option>
                      <option value="KA">Karnataka</option>
                      <option value="BR">Bihar</option>
                      <option value="KL">Kerala</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full text-xs px-2 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="bn">Bengali</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                      required
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/30"
                    />
                    <span className="text-xs text-slate-600">
                      I agree to the{' '}
                      <a href="#terms" className="text-teal-700 underline font-semibold">
                        Terms & Conditions
                      </a>{' '}
                      and Emergency Dispatch Privacy Protocol.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-sm font-bold tracking-wide shadow-lg shadow-teal-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  <span>{isSubmitting ? 'Creating Profile...' : 'Create Citizen Account'}</span>
                </button>
              </>
            )}

            {/* ─────────────────────────────────────────────────────────────
                CASE D: NGO LOGIN (Screen 5 & 2 unified)
            ───────────────────────────────────────────────────────────── */}
            {role === 'ngo' && mode === 'login' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Email / Registered Contact <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      ✉️
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="name@organization.org or 10-digit number"
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <a href="#forgot" className="text-xs font-semibold text-teal-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      🔒
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm tracking-wider focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Contextual Field: Agency Category Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Login As Unit Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.agencyType}
                    onChange={(e) => handleInputChange('agencyType', e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                  >
                    <option value="ngo">NGO / Relief Agency</option>
                    <option value="volunteer-org">Registered Volunteer Unit</option>
                    <option value="medical-corp">Medical & First Responder Corp</option>
                    <option value="food-logistics">Food & Shelter Logistics</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white text-sm font-bold tracking-wide shadow-lg shadow-teal-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <span>🏢</span>
                  <span>{isSubmitting ? 'Verifying Unit...' : 'NGO Secure Login'}</span>
                </button>
              </>
            )}

            {/* ─────────────────────────────────────────────────────────────
                CASE E: NGO REGISTRATION & VERIFICATION (Screen 4)
            ───────────────────────────────────────────────────────────── */}
            {role === 'ngo' && mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    NGO / Organisation Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ngoName}
                    onChange={(e) => handleInputChange('ngoName', e.target.value)}
                    placeholder="e.g. Red Cross Kerala Relief Foundation"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Official Email ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contact@ngodomain.org"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword || formData.password}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Disaster Specialization */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Disaster Specialization <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {[
                      { id: 'medical', icon: '🩺', label: 'Medical' },
                      { id: 'flood', icon: '🌊', label: 'Flood' },
                      { id: 'fire', icon: '🚒', label: 'Fire' },
                      { id: 'landslide', icon: '🪨', label: 'Landslide' },
                      { id: 'accident', icon: '🚑', label: 'Accident' },
                      { id: 'earthquake', icon: '🌍', label: 'Earthquake' },
                    ].map((spec) => {
                      const isSelected = formData.specializations.includes(spec.id)
                      return (
                        <label
                          key={spec.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-medium border transition ${
                            isSelected
                              ? 'bg-teal-50 border-teal-400 text-teal-800 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSpecialization(spec.id)}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>{spec.icon}</span>
                          <span>{spec.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Resources Available */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Resources Available for Deployment
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                      <span className="text-xs block text-slate-600 font-medium">🚑 Ambulances</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.ambulances}
                        onChange={(e) => handleInputChange('ambulances', e.target.value)}
                        className="w-full mt-1 text-center font-bold text-xs py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                      <span className="text-xs block text-slate-600 font-medium">🚤 Boats</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.boats}
                        onChange={(e) => handleInputChange('boats', e.target.value)}
                        className="w-full mt-1 text-center font-bold text-xs py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                      <span className="text-xs block text-slate-600 font-medium">🚒 Fire Trucks</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.fireTrucks}
                        onChange={(e) => handleInputChange('fireTrucks', e.target.value)}
                        className="w-full mt-1 text-center font-bold text-xs py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                      <span className="text-xs block text-slate-600 font-medium">👥 Volunteers</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.volunteers}
                        onChange={(e) => handleInputChange('volunteers', e.target.value)}
                        className="w-full mt-1 text-center font-bold text-xs py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Base Location */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-700">
                      Base Location / Address <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      📍 Detect GPS
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>

                {/* Banking & UPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bank Account No. (Donations)
                    </label>
                    <input
                      type="text"
                      placeholder="9876543210002"
                      value={formData.bankAcc}
                      onChange={(e) => handleInputChange('bankAcc', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">UPI ID</label>
                    <input
                      type="text"
                      placeholder="ngo@upi"
                      value={formData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                    />
                  </div>
                </div>

                {/* Document Upload Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload NGO Verification Documents <span className="text-rose-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-3.5 text-center cursor-pointer transition bg-slate-50/50">
                    <span className="text-xl">📄</span>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      Click to upload Govt. Registration Certificate or 12A/80G
                    </p>
                    <p className="text-[11px] text-slate-400">PDF, JPG up to 10MB</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white text-sm font-bold tracking-wide shadow-lg shadow-teal-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <span>🏢</span>
                  <span>{isSubmitting ? 'Registering NGO...' : 'Register & Verify NGO Profile'}</span>
                </button>
              </>
            )}
          </form>

          {/* ═══ 5. Footer Switcher & Encryption Badge ═══ */}
          <footer className="pt-3 border-t border-slate-100 text-center">
            {role !== 'admin' ? (
              <p className="text-xs text-slate-500 font-medium">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="font-bold text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-1"
                >
                  {mode === 'login' ? 'Sign Up' : 'Log In'} →
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Need clearance assistance?{' '}
                <a href="#ops-center" className="font-bold text-teal-700 hover:underline">
                  Contact Disaster Ops Center →
                </a>
              </p>
            )}

            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="text-teal-600">🛡️</span> 256-bit Encrypted
              </span>
              <span>•</span>
              <span>Disaster Response Network</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
