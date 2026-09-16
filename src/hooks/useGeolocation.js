import { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * useGeolocation
 * Automatically detects real-world GPS coordinates, reverse-geocodes
 * to street/locality via OpenStreetMap Nominatim, and manages permission state.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'locating' | 'granted' | 'denied' | 'unavailable'
  const [permissionState, setPermissionState] = useState(null) // 'granted' | 'prompt' | 'denied'
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  // Reverse geocode latitude & longitude to real street and city
  const reverseGeocode = useCallback(async (lat, lng) => {
    setIsGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      if (res.ok) {
        const data = await res.json()
        const fullAddr = data?.display_name || ''
        const addrObj = data?.address || {}
        const cityName =
          addrObj.city ||
          addrObj.town ||
          addrObj.village ||
          addrObj.suburb ||
          addrObj.county ||
          addrObj.state_district ||
          addrObj.state ||
          ''
        if (fullAddr) setAddress(fullAddr)
        if (cityName) setCity(cityName)
        return { address: fullAddr, city: cityName }
      }
    } catch (err) {
      console.warn('Reverse geocode fallback:', err)
    } finally {
      setIsGeocoding(false)
    }
    return null
  }, [])

  // Explicitly prompt / request user location
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable')
      setErrorMsg('Geolocation is not supported by your browser.')
      return
    }

    setStatus('locating')
    setErrorMsg(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000
        const lng = Math.round(pos.coords.longitude * 10000) / 10000
        const acc = Math.round(pos.coords.accuracy || 10)
        setCoords({ lat, lng })
        setAccuracy(acc)
        setStatus('granted')
        reverseGeocode(lat, lng)
      },
      (err) => {
        if (err.code === 1) {
          // PERMISSION_DENIED
          setStatus('denied')
          setErrorMsg('Location permission was denied by browser.')
        } else if (err.code === 2) {
          // POSITION_UNAVAILABLE
          setStatus('unavailable')
          setErrorMsg('GPS fix unavailable. Please check device location.')
        } else if (err.code === 3) {
          // TIMEOUT
          setStatus('unavailable')
          setErrorMsg('GPS satellite sync timed out.')
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    )
  }, [reverseGeocode])

  // Automatically request on mount and listen to permission changes
  useEffect(() => {
    let active = true

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((perm) => {
          if (!active) return
          setPermissionState(perm.state)

          if (perm.state === 'granted' || perm.state === 'prompt') {
            // Automatically prompt or fetch
            requestLocation()
          } else if (perm.state === 'denied') {
            setStatus('denied')
          }

          perm.onchange = () => {
            if (!active) return
            setPermissionState(perm.state)
            if (perm.state === 'granted') {
              requestLocation()
            } else if (perm.state === 'denied') {
              setStatus('denied')
            }
          }
        })
        .catch(() => {
          requestLocation()
        })
    } else {
      requestLocation()
    }

    return () => {
      active = false
    }
  }, [requestLocation])

  return useMemo(() => ({
    coords,
    accuracy,
    address,
    city,
    status,
    permissionState,
    isGeocoding,
    errorMsg,
    requestLocation,
  }), [
    coords,
    accuracy,
    address,
    city,
    status,
    permissionState,
    isGeocoding,
    errorMsg,
    requestLocation,
  ])
}
