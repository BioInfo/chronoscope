import { openDB, type IDBPDatabase, type DBSchema } from 'idb';
import type { GalleryImage, SpacetimeCoordinates } from '../types';

interface GalleryDB extends DBSchema {
  images: {
    key: string;
    value: GalleryImage;
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'chronoscope-gallery';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let dbPromise: Promise<IDBPDatabase<GalleryDB>> | null = null;

/**
 * Get or initialize the database connection
 */
function getDB(): Promise<IDBPDatabase<GalleryDB>> {
  if (!dbPromise) {
    dbPromise = openDB<GalleryDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Save an image to the gallery
 */
export async function saveGalleryImage(
  imageData: string,
  coordinates: SpacetimeCoordinates,
  locationName: string,
  description: string
): Promise<GalleryImage> {
  const db = await getDB();

  const newImage: GalleryImage = {
    id: crypto.randomUUID(),
    imageData,
    coordinates,
    locationName,
    description,
    timestamp: Date.now(),
  };

  await db.add(STORE_NAME, newImage);
  return newImage;
}

/**
 * Get all images from the gallery, sorted by timestamp (newest first)
 */
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  const db = await getDB();
  const images = await db.getAllFromIndex(STORE_NAME, 'by-timestamp');
  // Return in reverse order (newest first)
  return images.reverse();
}

/**
 * Get a single image by ID
 */
export async function getGalleryImage(id: string): Promise<GalleryImage | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

/**
 * Delete an image from the gallery
 */
export async function deleteGalleryImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/**
 * Clear all images from the gallery
 */
export async function clearGallery(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

/**
 * Get the count of images in the gallery
 */
export async function getGalleryCount(): Promise<number> {
  const db = await getDB();
  return db.count(STORE_NAME);
}

/**
 * Estimate storage usage (rough estimate based on image data sizes)
 */
export async function estimateStorageUsage(): Promise<{ used: number; formatted: string }> {
  const images = await getAllGalleryImages();
  let totalBytes = 0;

  for (const image of images) {
    // Base64 is roughly 4/3 the size of the original binary data
    // Each character in a base64 string is 1 byte in JavaScript strings
    totalBytes += image.imageData.length;
    // Add some overhead for metadata
    totalBytes += JSON.stringify(image.coordinates).length;
    totalBytes += image.locationName.length;
    totalBytes += image.description.length;
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return {
    used: totalBytes,
    formatted: formatBytes(totalBytes),
  };
}

/**
 * Download an image as PNG
 */
export function downloadImage(image: GalleryImage): void {
  const { coordinates, locationName } = image;
  const { temporal } = coordinates;

  // Create filename from location and date
  const year =
    temporal.year < 0 ? `${Math.abs(temporal.year)}BC` : `${temporal.year}`;
  const safeName = locationName
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);
  const filename = `chronoscope-${safeName}-${year}.png`;

  // Create download link
  const link = document.createElement('a');
  link.href = image.imageData;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format coordinates for display
 */
export function formatCoordinatesDisplay(coordinates: SpacetimeCoordinates): string {
  const { spatial, temporal } = coordinates;
  const lat = spatial.latitude.toFixed(4);
  const lng = spatial.longitude.toFixed(4);
  const year =
    temporal.year < 0 ? `${Math.abs(temporal.year)} BC` : `${temporal.year} AD`;

  return `${lat}°, ${lng}° | ${temporal.month}/${temporal.day}/${year}`;
}
