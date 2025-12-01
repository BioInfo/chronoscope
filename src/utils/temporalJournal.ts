import type { JournalEntry, TemporalJournal, SpacetimeCoordinates } from '../types';

const JOURNAL_KEY = 'chronoscope_journal';
const MAX_ENTRIES = 50;

/**
 * Get the journal from localStorage
 */
export function getJournal(): TemporalJournal {
  try {
    const stored = localStorage.getItem(JOURNAL_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        entries: parsed.entries || [],
        maxEntries: parsed.maxEntries || MAX_ENTRIES,
      };
    }
  } catch {
    // Failed to load journal - return empty
  }
  return { entries: [], maxEntries: MAX_ENTRIES };
}

/**
 * Save the journal to localStorage
 */
function saveJournal(journal: TemporalJournal): void {
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  } catch {
    // Failed to save journal - localStorage may be unavailable
  }
}

/**
 * Check if two coordinates are the same location/time
 */
function coordinatesMatch(a: SpacetimeCoordinates, b: SpacetimeCoordinates): boolean {
  return (
    a.spatial.latitude === b.spatial.latitude &&
    a.spatial.longitude === b.spatial.longitude &&
    a.temporal.year === b.temporal.year &&
    a.temporal.month === b.temporal.month &&
    a.temporal.day === b.temporal.day &&
    a.temporal.hour === b.temporal.hour &&
    a.temporal.minute === b.temporal.minute
  );
}

// Time window for considering an entry as "recent" (5 minutes)
const RECENT_ENTRY_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * Add a new journal entry (idempotent for recent identical coordinates)
 * If a recent entry exists for the same coordinates, updates it instead of creating a duplicate
 */
export function addJournalEntry(
  coordinates: SpacetimeCoordinates,
  locationName: string,
  hasGeneratedImage: boolean = false,
  thumbnail?: string
): JournalEntry {
  const journal = getJournal();
  const now = Date.now();

  // Check if the most recent entry is for the same coordinates and was created recently
  if (journal.entries.length > 0) {
    const lastEntry = journal.entries[0];
    const timeSinceLastEntry = now - lastEntry.timestamp;

    if (
      coordinatesMatch(lastEntry.coordinates, coordinates) &&
      timeSinceLastEntry < RECENT_ENTRY_THRESHOLD_MS
    ) {
      // Update the existing entry instead of creating a duplicate
      // Only upgrade hasGeneratedImage (false -> true), never downgrade
      if (hasGeneratedImage && !lastEntry.hasGeneratedImage) {
        lastEntry.hasGeneratedImage = true;
      }
      if (thumbnail && !lastEntry.thumbnail) {
        lastEntry.thumbnail = thumbnail;
      }
      // Update timestamp to reflect latest interaction
      lastEntry.timestamp = now;
      saveJournal(journal);
      return lastEntry;
    }
  }

  const newEntry: JournalEntry = {
    id: crypto.randomUUID(),
    coordinates,
    locationName,
    timestamp: now,
    hasGeneratedImage,
    thumbnail,
  };

  // Add to the beginning (most recent first)
  journal.entries.unshift(newEntry);

  // Trim to max entries
  if (journal.entries.length > journal.maxEntries) {
    journal.entries = journal.entries.slice(0, journal.maxEntries);
  }

  saveJournal(journal);
  return newEntry;
}

/**
 * Update an existing journal entry (e.g., when image is generated)
 */
export function updateJournalEntry(
  id: string,
  updates: Partial<Pick<JournalEntry, 'hasGeneratedImage' | 'thumbnail'>>
): JournalEntry | null {
  const journal = getJournal();
  const index = journal.entries.findIndex((e) => e.id === id);

  if (index === -1) return null;

  journal.entries[index] = {
    ...journal.entries[index],
    ...updates,
  };

  saveJournal(journal);
  return journal.entries[index];
}

/**
 * Remove a journal entry by ID
 */
export function removeJournalEntry(id: string): boolean {
  const journal = getJournal();
  const originalLength = journal.entries.length;
  journal.entries = journal.entries.filter((e) => e.id !== id);

  if (journal.entries.length !== originalLength) {
    saveJournal(journal);
    return true;
  }
  return false;
}

/**
 * Clear all journal entries
 */
export function clearJournal(): void {
  const journal: TemporalJournal = { entries: [], maxEntries: MAX_ENTRIES };
  saveJournal(journal);
}

/**
 * Export journal as JSON file
 */
export function exportJournal(): void {
  const journal = getJournal();
  const blob = new Blob([JSON.stringify(journal, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chronoscope-journal-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import journal from JSON file
 * Returns the number of entries imported
 */
export function importJournal(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as TemporalJournal;

        if (!imported.entries || !Array.isArray(imported.entries)) {
          throw new Error('Invalid journal format');
        }

        // Validate entries have required fields
        const validEntries = imported.entries.filter(
          (entry) =>
            entry.id &&
            entry.coordinates &&
            entry.locationName &&
            entry.timestamp
        );

        const journal = getJournal();

        // Merge entries, avoiding duplicates by ID
        const existingIds = new Set(journal.entries.map((e) => e.id));
        const newEntries = validEntries.filter((e) => !existingIds.has(e.id));

        journal.entries = [...newEntries, ...journal.entries]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, journal.maxEntries);

        saveJournal(journal);
        resolve(newEntries.length);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Format coordinates for display
 */
export function formatCoordinatesShort(coordinates: SpacetimeCoordinates): string {
  const { spatial, temporal } = coordinates;
  const lat = spatial.latitude.toFixed(2);
  const lng = spatial.longitude.toFixed(2);
  const year = temporal.year < 0 ? `${Math.abs(temporal.year)} BC` : `${temporal.year}`;
  return `${lat}°, ${lng}° | ${year}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
