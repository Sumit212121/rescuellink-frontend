/**
 * roadRouting.js
 * Service for fetching real road navigation routes via OpenStreetMap / OSRM engine.
 * Converts driving navigation geometry for Leaflet [lat, lng] polylines.
 */

const routeCache = new Map()

/**
 * Compute road route from start to destination using OSRM Driving Engine.
 * @param {Object} start - { lat, lng }
 * @param {Object} end - { lat, lng }
 * @returns {Promise<{ coordinates: Array<[number, number]>, distanceKm: number, durationMins: number, steps: Array }>}
 */
export async function fetchRoadRoute(start, end) {
  if (!start?.lat || !start?.lng || !end?.lat || !end?.lng) {
    return null
  }

  const startLat = parseFloat(start.lat)
  const startLng = parseFloat(start.lng)
  const endLat = parseFloat(end.lat)
  const endLng = parseFloat(end.lng)

  // Cache key with 4 decimal places (~11m precision)
  const cacheKey = `${startLat.toFixed(4)},${startLng.toFixed(4)}->${endLat.toFixed(4)},${endLng.toFixed(4)}`
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`OSRM HTTP ${response.status}`)
    }

    const data = await response.json()
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No road route found between points')
    }

    const primaryRoute = data.routes[0]

    // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
    const coordinates = primaryRoute.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    const distanceKm = Math.max(0.1, Math.round((primaryRoute.distance / 1000) * 10) / 10)
    const durationMins = Math.max(1, Math.round(primaryRoute.duration / 60))

    const steps = (primaryRoute.legs?.[0]?.steps || []).map(step => ({
      instruction: step.maneuver?.type 
        ? `${step.maneuver.type} ${step.name ? 'onto ' + step.name : ''}`.trim() 
        : (step.name || 'Continue on road'),
      name: step.name || '',
      distanceKm: Math.round((step.distance / 1000) * 10) / 10,
    }))

    const result = {
      coordinates,
      distanceKm,
      durationMins,
      steps,
      summary: primaryRoute.legs?.[0]?.summary || 'Primary Road Network'
    }

    routeCache.set(cacheKey, result)
    return result
  } catch (err) {
    console.warn('Road routing via OSRM unavailable, utilizing fallback interpolation:', err.message)
    // Fallback road-like path with subtle midpoint offset
    const fallbackCoords = createFallbackRoadPath(startLat, startLng, endLat, endLng)
    const dLat = endLat - startLat
    const dLng = endLng - startLng
    const approxDist = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 111 * 10) / 10
    return {
      coordinates: fallbackCoords,
      distanceKm: Math.max(0.5, approxDist),
      durationMins: Math.max(2, Math.round(approxDist * 2.2)),
      steps: [{ instruction: 'Follow connecting streets', name: 'Connecting Route', distanceKm: approxDist }],
      summary: 'Connecting Street Network'
    }
  }
}

/**
 * Generate a curved road-like fallback path when external API is unreachable.
 */
function createFallbackRoadPath(startLat, startLng, endLat, endLng, points = 16) {
  const coords = []
  // Add a slight realistic curve to simulate road turns
  const midLat = (startLat + endLat) / 2 + (endLng - startLng) * 0.15
  const midLng = (startLng + endLng) / 2 - (endLat - startLat) * 0.15

  for (let i = 0; i <= points; i++) {
    const t = i / points
    // Quadratic Bezier interpolation
    const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * midLat + t * t * endLat
    const lng = (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * midLng + t * t * endLng
    coords.push([Math.round(lat * 100000) / 100000, Math.round(lng * 100000) / 100000])
  }
  return coords
}

/**
 * Resample a list of road coordinates to a target number of smooth waypoints.
 * Perfect for smooth vehicle simulation along the road.
 * @param {Array<[number, number]>} coords 
 * @param {number} targetCount 
 * @returns {Array<[number, number]>}
 */
export function resampleRoadPath(coords, targetCount = 20) {
  if (!coords || coords.length === 0) return []
  if (coords.length <= targetCount) return coords

  const result = [coords[0]]
  const totalOriginal = coords.length - 1
  const step = totalOriginal / (targetCount - 1)

  for (let i = 1; i < targetCount - 1; i++) {
    const idx = Math.min(totalOriginal, Math.round(i * step))
    result.push(coords[idx])
  }
  result.push(coords[totalOriginal])
  return result
}
