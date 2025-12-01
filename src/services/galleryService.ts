import { openDB, type IDBPDatabase, type DBSchema } from 'idb';
import type { GalleryImage, SpacetimeCoordinates } from '../types';

interface GalleryDB extends DBSchema {
  images: {
    key: string;
    value: GalleryImage;
    indexes: {
      'by-timestamp': number;
      'by-fingerprint': string;
    };
  };
}

const DB_NAME = 'chronoscope-gallery';
const DB_VERSION = 2; // Bump version for new index
const STORE_NAME = 'images';

let dbPromise: Promise<IDBPDatabase<GalleryDB>> | null = null;

// Mutex lock to prevent concurrent saves
let saveLock: Promise<void> = Promise.resolve();

/**
 * Generate a fingerprint for duplicate detection
 * Uses first 100 chars of image data + coordinates for fast comparison
 */
function generateFingerprint(imageData: string, coordinates: SpacetimeCoordinates): string {
  const { spatial, temporal } = coordinates;
  const coordKey = `${spatial.latitude.toFixed(4)}_${spatial.longitude.toFixed(4)}_${temporal.year}_${temporal.month}_${temporal.day}_${temporal.hour}_${temporal.minute}`;
  // Use first 100 chars of image data as partial hash (enough for uniqueness)
  const imagePrefix = imageData.substring(0, 100);
  return `${coordKey}_${imagePrefix}`;
}

/**
 * Get or initialize the database connection
 */
function getDB(): Promise<IDBPDatabase<GalleryDB>> {
  if (!dbPromise) {
    dbPromise = openDB<GalleryDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        // Handle fresh install
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-timestamp', 'timestamp');
          store.createIndex('by-fingerprint', 'fingerprint', { unique: true });
        } else if (oldVersion < 2) {
          // Migrate from v1 to v2: add fingerprint index
          const store = transaction.objectStore(STORE_NAME);
          if (!store.indexNames.contains('by-fingerprint')) {
            store.createIndex('by-fingerprint', 'fingerprint', { unique: true });
          }
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Save an image to the gallery (with robust duplicate prevention)
 * Uses mutex lock + fingerprint index to prevent race conditions and duplicates
 */
export async function saveGalleryImage(
  imageData: string,
  coordinates: SpacetimeCoordinates,
  locationName: string,
  description: string
): Promise<GalleryImage> {
  // Wait for any pending save to complete (mutex)
  const currentLock = saveLock;
  let releaseLock: () => void;
  saveLock = new Promise(resolve => { releaseLock = resolve; });

  await currentLock;

  try {
    const db = await getDB();
    const fingerprint = generateFingerprint(imageData, coordinates);

    // Check for duplicate using the fingerprint index (fast O(1) lookup)
    try {
      const existing = await db.getFromIndex(STORE_NAME, 'by-fingerprint', fingerprint);
      if (existing) {
        // Return existing image instead of creating duplicate
        return existing;
      }
    } catch {
      // Index might not exist on older databases, fall back to full scan
      const existingImages = await db.getAll(STORE_NAME);
      const duplicate = existingImages.find(img =>
        (img as GalleryImage & { fingerprint?: string }).fingerprint === fingerprint ||
        img.imageData === imageData
      );
      if (duplicate) {
        return duplicate;
      }
    }

    const newImage: GalleryImage & { fingerprint: string } = {
      id: crypto.randomUUID(),
      imageData,
      coordinates,
      locationName,
      description,
      timestamp: Date.now(),
      fingerprint,
    };

    await db.add(STORE_NAME, newImage as unknown as GalleryImage);
    return newImage;
  } finally {
    // Release the lock
    releaseLock!();
  }
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

/**
 * Remove duplicate images from the gallery
 * Keeps the oldest version of each duplicate (first saved)
 * Returns the number of duplicates removed
 */
export async function deduplicateGallery(): Promise<number> {
  const db = await getDB();
  const images = await db.getAll(STORE_NAME);

  // Group by imageData (or first 1000 chars for performance)
  const seen = new Map<string, GalleryImage>();
  const duplicateIds: string[] = [];

  // Sort by timestamp ascending (oldest first)
  images.sort((a, b) => a.timestamp - b.timestamp);

  for (const image of images) {
    // Use first 1000 chars of imageData as key for grouping
    const key = image.imageData.substring(0, 1000);

    if (seen.has(key)) {
      // This is a duplicate - mark for deletion
      duplicateIds.push(image.id);
    } else {
      seen.set(key, image);
    }
  }

  // Delete duplicates
  for (const id of duplicateIds) {
    await db.delete(STORE_NAME, id);
  }

  return duplicateIds.length;
}
