import { useState, useEffect } from 'react'
import LandingPage from './components/user/LandingPage'
import NgoDashboard from './components/ngo/NgoDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rescue_user')
      if (!saved) return null
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed.name === 'string' && parsed.name.toLowerCase().includes('citizen')) {
        parsed.name = ''
        localStorage.setItem('rescue_user', JSON.stringify(parsed))
      }
      return parsed
    } catch {
      return null
    }
  })

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    try {
      localStorage.setItem('rescue_user', JSON.stringify(user))
    } catch (e) {
      console.error('Failed to persist user session', e)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    try {
      localStorage.removeItem('rescue_user')
    } catch (e) {
      console.error('Failed to clear user session', e)
    }
  }

  // If logged in as Admin, display the Stitch Admin Command Dashboard
  if (currentUser?.role === 'admin') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />
  }

  // If logged in as NGO, display the Stitch NGO Command Dashboard
  if (currentUser?.role === 'ngo') {
    return <NgoDashboard user={currentUser} onLogout={handleLogout} />
  }

  return (
    <LandingPage
      user={currentUser}
      onLogout={handleLogout}
      onLoginSuccess={handleLoginSuccess}
    />
  )
}

export default App
