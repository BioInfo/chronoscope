import type { SpacetimeCoordinates } from '../types';

/**
 * URL-based coordinate sharing utility
 * Encodes and decodes spacetime coordinates to/from URL query parameters
 */

/**
 * Encode spacetime coordinates into URL query string
 */
export function encodeCoordinates(coords: SpacetimeCoordinates): string {
  const params = new URLSearchParams();
  params.set('lat', coords.spatial.latitude.toString());
  params.set('lng', coords.spatial.longitude.toString());
  params.set('year', coords.temporal.year.toString());
  params.set('month', coords.temporal.month.toString());
  params.set('day', coords.temporal.day.toString());
  params.set('hour', coords.temporal.hour.toString());
  params.set('minute', coords.temporal.minute.toString());
  return params.toString();
}

/**
 * Decode spacetime coordinates from URL query string
 * Returns null if required parameters are missing
 */
export function decodeCoordinates(search: string): SpacetimeCoordinates | null {
  const params = new URLSearchParams(search);

  // Check if we have at least lat/lng/year (minimum required)
  if (!params.has('lat') || !params.has('lng') || !params.has('year')) {
    return null;
  }

  const lat = parseFloat(params.get('lat')!);
  const lng = parseFloat(params.get('lng')!);
  const year = parseInt(params.get('year')!, 10);

  // Validate parsed values
  if (isNaN(lat) || isNaN(lng) || isNaN(year)) {
    return null;
  }

  // Use defaults for optional time components
  const month = params.has('month') ? parseInt(params.get('month')!, 10) : 1;
  const day = params.has('day') ? parseInt(params.get('day')!, 10) : 1;
  const hour = params.has('hour') ? parseInt(params.get('hour')!, 10) : 12;
  const minute = params.has('minute') ? parseInt(params.get('minute')!, 10) : 0;

  return {
    spatial: {
      latitude: lat,
      longitude: lng,
    },
    temporal: {
      year,
      month: isNaN(month) ? 1 : month,
      day: isNaN(day) ? 1 : day,
      hour: isNaN(hour) ? 12 : hour,
      minute: isNaN(minute) ? 0 : minute,
    },
  };
}

/**
 * Update the browser URL with coordinates (without page reload)
 */
export function updateUrlWithCoordinates(coords: SpacetimeCoordinates): void {
  const queryString = encodeCoordinates(coords);
  const newUrl = `${window.location.pathname}?${queryString}`;
  window.history.replaceState({}, '', newUrl);
}

/**
 * Get the current URL's coordinates, if any
 */
export function getCoordinatesFromUrl(): SpacetimeCoordinates | null {
  return decodeCoordinates(window.location.search);
}

/**
 * Generate a shareable URL for the given coordinates
 */
export function generateShareableUrl(coords: SpacetimeCoordinates): string {
  const queryString = encodeCoordinates(coords);
  return `${window.location.origin}${window.location.pathname}?${queryString}`;
}

/**
 * Copy the shareable URL to clipboard
 * Returns true on success, false on failure
 */
export async function copyShareableUrl(coords: SpacetimeCoordinates): Promise<boolean> {
  const url = generateShareableUrl(coords);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Clear coordinates from URL
 */
export function clearUrlCoordinates(): void {
  window.history.replaceState({}, '', window.location.pathname);
}
