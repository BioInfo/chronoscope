import { useState, useEffect, useRef } from 'react';
import {
  ScrollText,
  Trash2,
  Download,
  Upload,
  X,
  MapPin,
  Clock,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useChronoscope } from '../context/ChronoscopeContext';
import type { JournalEntry } from '../types';
import {
  getJournal,
  removeJournalEntry,
  clearJournal,
  exportJournal,
  importJournal,
  formatTimestamp,
} from '../utils/temporalJournal';
import { formatYear } from '../utils/validation';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onSelect: () => void;
  onDelete: () => void;
  isSelected: boolean;
}

function JournalEntryCard({ entry, onSelect, onDelete, isSelected }: JournalEntryCardProps) {
  const { temporal } = entry.coordinates;
  const formattedDate = `${temporal.month}/${temporal.day}/${formatYear(temporal.year)}`;
  const formattedTime = `${temporal.hour.toString().padStart(2, '0')}:${temporal.minute.toString().padStart(2, '0')}`;

  return (
    <div
      className={`
        relative group text-left p-3 rounded-lg border transition-all duration-300
        ${isSelected
          ? 'bg-chrono-purple/10 border-chrono-purple shadow-glow-purple'
          : 'bg-chrono-dark/50 border-chrono-border hover:border-chrono-purple/50 hover:bg-chrono-dark'
        }
      `}
    >
      <button
        onClick={onSelect}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-chrono-purple/20 border border-chrono-purple/50">
            <MapPin className="w-4 h-4 text-chrono-purple" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-sm font-semibold text-chrono-text truncate">
              {entry.locationName}
            </h3>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-mono text-xs text-chrono-text-dim">
                {formattedDate}
              </span>
              <span className="font-mono text-xs text-chrono-text-dim">
                {formattedTime}
              </span>
              {entry.hasGeneratedImage && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono rounded border bg-chrono-green/20 border-chrono-green/50 text-chrono-green">
                  <ImageIcon className="w-3 h-3" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 mt-2 text-chrono-text-dim">
              <Clock className="w-3 h-3" />
              <span className="font-mono text-xs">
                {formatTimestamp(entry.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Delete button - visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-chrono-dark/80 hover:bg-chrono-red/20 text-chrono-text-dim hover:text-chrono-red"
        title="Remove from journal"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export function TemporalJournal() {
  const { jumpToWaypoint } = useChronoscope();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load journal entries on mount and listen for updates
  useEffect(() => {
    const loadEntries = () => {
      const journal = getJournal();
      setEntries(journal.entries);
    };

    loadEntries();

    // Listen for storage events (for cross-tab sync)
    window.addEventListener('storage', loadEntries);

    // Listen for custom journal update events
    window.addEventListener('journalUpdated', loadEntries);

    return () => {
      window.removeEventListener('storage', loadEntries);
      window.removeEventListener('journalUpdated', loadEntries);
    };
  }, []);

  const handleSelect = (entry: JournalEntry) => {
    setSelectedId(entry.id);
    jumpToWaypoint(entry.coordinates);
  };

  const handleDelete = (id: string) => {
    removeJournalEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleClearAll = () => {
    clearJournal();
    setEntries([]);
    setSelectedId(null);
    setShowConfirmClear(false);
  };

  const handleExport = () => {
    exportJournal();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await importJournal(file);
      const journal = getJournal();
      setEntries(journal.entries);
      alert(`Imported ${count} new entries`);
    } catch (error) {
      alert('Failed to import journal. Please check the file format.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (entries.length === 0) {
    return (
      <div className="panel-chrono p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-chrono-border pb-3">
          <ScrollText className="w-5 h-5 text-chrono-purple" />
          <h2 className="font-mono text-sm uppercase tracking-wider text-chrono-purple">
            Temporal Journal
          </h2>
        </div>

        {/* Empty state */}
        <div className="text-center py-6">
          <ScrollText className="w-8 h-8 text-chrono-text-dim mx-auto mb-3 opacity-50" />
          <p className="font-mono text-xs text-chrono-text-dim">
            No visits recorded yet.
          </p>
          <p className="font-mono text-xs text-chrono-text-dim mt-1">
            Render a scene to start your journey.
          </p>
        </div>

        {/* Import button */}
        <div className="pt-3 border-t border-chrono-border">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded border border-chrono-border text-chrono-text-dim hover:border-chrono-purple/50 hover:text-chrono-purple transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-chrono p-4 space-y-4">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between border-b border-chrono-border pb-3"
      >
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-chrono-purple" />
          <h2 className="font-mono text-sm uppercase tracking-wider text-chrono-purple">
            Temporal Journal
          </h2>
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-chrono-purple/20 text-chrono-purple">
            {entries.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-chrono-text-dim" />
        ) : (
          <ChevronDown className="w-4 h-4 text-chrono-text-dim" />
        )}
      </button>

      {isExpanded && (
        <>
          {/* Entry list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onSelect={() => handleSelect(entry)}
                onDelete={() => handleDelete(entry.id)}
                isSelected={selectedId === entry.id}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-chrono-border space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded border border-chrono-border text-chrono-text-dim hover:border-chrono-blue/50 hover:text-chrono-blue transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded border border-chrono-border text-chrono-text-dim hover:border-chrono-purple/50 hover:text-chrono-purple transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>

            {showConfirmClear ? (
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded border border-chrono-red bg-chrono-red/20 text-chrono-red hover:bg-chrono-red/30 transition-colors"
                >
                  Confirm Clear
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded border border-chrono-border text-chrono-text-dim hover:border-chrono-text-dim transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded border border-chrono-border text-chrono-text-dim hover:border-chrono-red/50 hover:text-chrono-red transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
