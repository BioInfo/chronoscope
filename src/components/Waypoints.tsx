import React, { useState } from 'react';
import {
  Bookmark,
  ChevronRight,
  Radiation,
  Rocket,
  Mountain,
  Plane,
  Building,
  Music,
  Ship,
  Crosshair,
  Flame,
  Sparkles,
  Swords,
  BookOpen,
} from 'lucide-react';
import { useChronoscope } from '../context/ChronoscopeContext';
import { CURATED_WAYPOINTS } from '../data/waypoints';
import type { Waypoint, HazardLevel } from '../types';
import { formatYear } from '../utils/validation';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Radiation,
  Rocket,
  Mountain,
  Plane,
  Building,
  Music,
  Ship,
  Crosshair,
  Flame,
  Sparkles,
  Swords,
  BookOpen,
};

// Category configuration
const categoryConfig = {
  conflict: { label: 'Conflicts', color: 'text-chrono-red', icon: Swords },
  discovery: { label: 'Discoveries', color: 'text-chrono-blue', icon: Sparkles },
  disaster: { label: 'Disasters', color: 'text-chrono-orange', icon: Flame },
  achievement: { label: 'Achievements', color: 'text-chrono-green', icon: Rocket },
  culture: { label: 'Culture', color: 'text-chrono-yellow', icon: Music },
};

const hazardColorMap: Record<HazardLevel, string> = {
  low: 'bg-hazard-low/20 border-hazard-low text-hazard-low',
  medium: 'bg-hazard-medium/20 border-hazard-medium text-hazard-medium',
  high: 'bg-hazard-high/20 border-hazard-high text-hazard-high',
  critical: 'bg-hazard-critical/20 border-hazard-critical text-hazard-critical',
};

interface WaypointCardProps {
  waypoint: Waypoint;
  onSelect: () => void;
  isSelected: boolean;
}

function WaypointCard({ waypoint, onSelect, isSelected }: WaypointCardProps) {
  const IconComponent = iconMap[waypoint.icon] || Bookmark;
  const hazardLevel = waypoint.previewData.safety.hazardLevel;
  const year = waypoint.coordinates.temporal.year;

  return (
    <button
      onClick={onSelect}
      className={`
        w-full text-left p-3 rounded-lg border transition-all duration-300
        ${isSelected
          ? 'bg-chrono-blue/10 border-chrono-blue shadow-glow-blue'
          : 'bg-chrono-dark/50 border-chrono-border hover:border-chrono-blue/50 hover:bg-chrono-dark'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded ${hazardColorMap[hazardLevel]}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-mono text-sm font-semibold text-chrono-text truncate">
              {waypoint.name}
            </h3>
            <ChevronRight className={`w-4 h-4 text-chrono-text-dim flex-shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs text-chrono-text-dim">
              {formatYear(year)}
            </span>
            <span className={`px-1.5 py-0.5 text-xs font-mono rounded border ${hazardColorMap[hazardLevel]}`}>
              {hazardLevel.toUpperCase()}
            </span>
          </div>

          <p className="font-mono text-xs text-chrono-text-dim mt-2 line-clamp-2">
            {waypoint.previewData.locationName}
          </p>
        </div>
      </div>
    </button>
  );
}

export function Waypoints() {
  const { jumpToWaypoint } = useChronoscope();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const handleSelect = (waypoint: Waypoint) => {
    setSelectedId(waypoint.id);
    jumpToWaypoint(waypoint.coordinates, waypoint.previewData);
  };

  const filteredWaypoints = filterCategory
    ? CURATED_WAYPOINTS.filter((w) => w.category === filterCategory)
    : CURATED_WAYPOINTS;

  // Group waypoints by category for display
  const categories = ['achievement', 'disaster', 'conflict', 'culture'] as const;

  return (
    <div className="panel-chrono p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-2rem)] lg:max-h-none">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-chrono-border pb-3">
        <Bookmark className="w-5 h-5 text-chrono-yellow" />
        <h2 className="font-mono text-sm uppercase tracking-wider text-chrono-yellow">
          Quick Jump
        </h2>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
            filterCategory === null
              ? 'bg-chrono-blue/20 border-chrono-blue text-chrono-blue'
              : 'border-chrono-border text-chrono-text-dim hover:border-chrono-blue/50'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const config = categoryConfig[cat];
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors flex items-center gap-1 ${
                filterCategory === cat
                  ? `bg-chrono-blue/20 border-chrono-blue text-chrono-blue`
                  : `border-chrono-border text-chrono-text-dim hover:border-chrono-blue/50`
              }`}
            >
              <config.icon className="w-3 h-3" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Waypoint list */}
      <div className="space-y-2">
        {filteredWaypoints.map((waypoint) => (
          <WaypointCard
            key={waypoint.id}
            waypoint={waypoint}
            onSelect={() => handleSelect(waypoint)}
            isSelected={selectedId === waypoint.id}
          />
        ))}
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-chrono-border">
        <p className="font-mono text-xs text-chrono-text-dim text-center">
          {filteredWaypoints.length} waypoint{filteredWaypoints.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}
