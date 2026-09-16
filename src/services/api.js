const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Helper for auth headers
function getHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json',
  }
  const savedUser = localStorage.getItem('rescue_user')
  const authToken = token || (savedUser ? JSON.parse(savedUser)?.token : null)
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }
  return headers
}

// 1. AUTH: Login
export async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.detail || 'Login failed')
    }
    return {
      ...data.user,
      token: data.access,
    }
  } catch (err) {
    console.warn('Backend login API error, returning error:', err.message)
    throw err
  }
}

// 2. AUTH: Register Citizen
export async function apiRegisterUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/register/user/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || 'Registration failed')
  }
  return {
    ...data.user,
    token: data.access,
  }
}

// 3. AUTH: Register NGO
export async function apiRegisterNgo(ngoData) {
  const res = await fetch(`${API_BASE_URL}/auth/register/ngo/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(ngoData),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.detail || 'NGO registration failed')
  }
  return {
    ...data.user,
    token: data.access,
  }
}

// 4. PUBLIC: Get verified NGOs list
export async function apiGetPublicNgos() {
  try {
    const res = await fetch(`${API_BASE_URL}/public/ngos/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.warn('Could not fetch NGOs from backend:', err)
    return []
  }
}

// 5. EMERGENCY: Create SOS
export async function apiCreateEmergency(sosData) {
  try {
    const res = await fetch(`${API_BASE_URL}/emergencies/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sosData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Failed to submit emergency SOS')
    return data
  } catch (err) {
    console.warn('Emergency dispatch backend error:', err)
    throw err
  }
}

// 6. EMERGENCY: Get active emergencies list
export async function apiGetEmergencies() {
  try {
    const res = await fetch(`${API_BASE_URL}/emergencies/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.warn('Could not fetch emergencies from backend:', err)
    return []
  }
}

// 7. ADMIN: Get stats
export async function apiGetAdminStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('Could not fetch admin stats:', err)
    return null
  }
}

// 8. ADMIN: Get NGOs
export async function apiGetAdminNgos() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/ngos/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.warn('Could not fetch admin NGOs:', err)
    return []
  }
}

// 9. ADMIN: Toggle verify NGO
export async function apiToggleVerifyNgo(ngoId) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/ngos/${ngoId}/toggle-verify/`, {
      method: 'POST',
      headers: getHeaders(),
    })
    return await res.json()
  } catch (err) {
    console.warn('Could not toggle NGO verification:', err)
    throw err
  }
}

// 10. DONATIONS: Get public ledger & summary
export async function apiGetDonations(summary = false) {
  try {
    const url = summary ? `${API_BASE_URL}/donations/?format=summary` : `${API_BASE_URL}/donations/`
    const res = await fetch(url, {
      headers: getHeaders(),
    })
    if (!res.ok) return summary ? null : []
    return await res.json()
  } catch (err) {
    console.warn('Could not fetch donations:', err)
    return summary ? null : []
  }
}

// 11. DONATIONS: Fund Relief Station (Create donation)
export async function apiCreateDonation(donationData) {
  try {
    const res = await fetch(`${API_BASE_URL}/donations/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.detail || 'Donation submission failed')
    }
    return data
  } catch (err) {
    console.warn('Donation API error:', err)
    throw err
  }
}

// 12. SOS WORKFLOW: Get Nearby NGOs for SOS
export async function apiGetNearbyNgos(sosId) {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/${sosId}/nearby-ngos/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return { nearbyNgos: [], count: 0 }
    return await res.json()
  } catch (err) {
    console.warn('Failed to fetch nearby NGOs:', err)
    return { nearbyNgos: [], count: 0 }
  }
}

// 13. SOS WORKFLOW: NGO Accepts SOS & Assigns Resources
export async function apiAcceptSos(sosId, assignmentData = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/${sosId}/accept/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        rescue_team: assignmentData.rescue_team || assignmentData.rescueTeam || 'Team Alpha',
        vehicle: assignmentData.vehicle || assignmentData.rescueVehicle || 'Rescue Boat RB-04',
        eta: assignmentData.eta ? parseInt(assignmentData.eta) : 15,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Failed to accept SOS')
    return data
  } catch (err) {
    console.warn('Accept SOS API error:', err)
    throw err
  }
}

// 14. SOS WORKFLOW: Dispatch Team
export async function apiDispatchSos(sosId) {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/${sosId}/dispatch/`, {
      method: 'POST',
      headers: getHeaders(),
    })
    return await res.json()
  } catch (err) {
    console.warn('Dispatch SOS API error:', err)
    throw err
  }
}

// 15. SOS WORKFLOW: Mark Arrived
export async function apiMarkArrived(sosId) {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/${sosId}/arrived/`, {
      method: 'POST',
      headers: getHeaders(),
    })
    return await res.json()
  } catch (err) {
    console.warn('Arrived SOS API error:', err)
    throw err
  }
}

// 16. SOS WORKFLOW: Mark Resolved with People & Notes
export async function apiResolveSos(sosId, resolveData = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/${sosId}/resolve/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        rescued_people_count: resolveData.rescued_people_count || resolveData.peopleRescued || 3,
        resolution_notes: resolveData.resolution_notes || resolveData.notes || 'Successfully evacuated.',
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Failed to resolve SOS')
    return data
  } catch (err) {
    console.warn('Resolve SOS API error:', err)
    throw err
  }
}

// 17. SOS WORKFLOW: Get Live Telemetry Tracking
export async function apiGetSosTracking(sosId) {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/${sosId}/tracking/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('Get SOS Tracking API error:', err)
    return null
  }
}

// 18. SOS WORKFLOW: Get Active SOS for current session
export async function apiGetActiveSos(sosId = null) {
  try {
    let savedSosId = sosId
    if (!savedSosId) {
      try {
        savedSosId = localStorage.getItem('active_sos_id')
      } catch (e) {}
    }
    const query = savedSosId ? `?sos_id=${encodeURIComponent(savedSosId)}` : ''
    const res = await fetch(`${API_BASE_URL}/sos/active/${query}`, {
      headers: getHeaders(),
    })
    if (!res.ok) return { active: false, emergency: null }
    return await res.json()
  } catch (err) {
    console.warn('Get Active SOS API error:', err)
    return { active: false, emergency: null }
  }
}

// 19. SOS WORKFLOW: Get Rescue History
export async function apiGetSosHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/history/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.warn('Get SOS History API error:', err)
    return []
  }
}

// 20. ADMIN: Delete SOS Request
export async function apiDeleteAdminRequest(sosId) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/requests/${sosId}/delete/`, {
      method: 'POST',
      headers: getHeaders(),
    })
    return await res.json()
  } catch (err) {
    console.warn('Could not delete SOS request:', err)
    throw err
  }
}

// 21. ECOSYSTEM: Get Live NGO Analytics
export async function apiGetNgoAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/ngo-analytics/`, {
      headers: getHeaders(),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('Get NGO Analytics error:', err)
    return null
  }
}

// 22. REAL-TIME TRACKING: Update Rescue Vehicle Location (REST API fallback)
export async function apiUpdateVehicleLocation(sosId, locationData) {
  try {
    const res = await fetch(`${API_BASE_URL}/rescue/${sosId}/location/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        latitude: locationData.latitude || locationData.lat,
        longitude: locationData.longitude || locationData.lng,
        accuracy: locationData.accuracy || 5.0,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Failed to update vehicle location')
    return data
  } catch (err) {
    console.warn('Vehicle location update error:', err)
    throw err
  }
}

// 23. REAL-TIME TRACKING: Get WebSocket URL for active rescue
export function getRescueWebSocketUrl(sosId, token = null) {
  const savedUser = localStorage.getItem('rescue_user')
  const authToken = token || (savedUser ? JSON.parse(savedUser)?.token : '')
  const wsBase = API_BASE_URL.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://').replace(/\/api$/, '')
  return `${wsBase}/ws/rescue/${sosId}/${authToken ? `?token=${encodeURIComponent(authToken)}` : ''}`
}

