import React from 'react';
import {
  Thermometer,
  Droplets,
  Eye,
  Cloud,
  Users,
  Cpu,
  Building,
  AlertTriangle,
  Shield,
  Activity,
  Zap,
} from 'lucide-react';
import { useChronoscope } from '../context/ChronoscopeContext';
import type { HazardLevel } from '../types';

interface DataRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

function DataRow({ icon, label, value, unit, highlight }: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-chrono-border/50 last:border-0">
      <div className="flex items-center gap-2 text-chrono-text-dim">
        {icon}
        <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className={`font-mono text-sm ${highlight ? 'text-chrono-blue' : 'text-chrono-text'}`}>
        {value}
        {unit && <span className="text-chrono-text-dim ml-1">{unit}</span>}
      </div>
    </div>
  );
}

interface HazardIndicatorProps {
  level: HazardLevel;
}

function HazardIndicator({ level }: HazardIndicatorProps) {
  const config = {
    low: {
      color: 'text-hazard-low border-hazard-low bg-hazard-low/10',
      label: 'LOW',
      bars: 1,
    },
    medium: {
      color: 'text-hazard-medium border-hazard-medium bg-hazard-medium/10',
      label: 'MEDIUM',
      bars: 2,
    },
    high: {
      color: 'text-hazard-high border-hazard-high bg-hazard-high/10',
      label: 'HIGH',
      bars: 3,
    },
    critical: {
      color: 'text-hazard-critical border-hazard-critical bg-hazard-critical/10 animate-pulse',
      label: 'CRITICAL',
      bars: 4,
    },
  };

  const { color, label, bars } = config[level];

  return (
    <div className={`flex items-center gap-3 p-3 rounded border ${color}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm ${i <= bars ? color.split(' ')[0].replace('text-', 'bg-') : 'bg-chrono-grid'}`}
          />
        ))}
      </div>
      <span className="font-mono text-sm uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function DataStream() {
  const { state } = useChronoscope();
  const { currentScene, isRendering } = state;

  if (isRendering) {
    return (
      <div className="panel-chrono p-4 space-y-6">
        <div className="flex items-center gap-2 border-b border-chrono-border pb-3">
          <Activity className="w-5 h-5 text-chrono-blue animate-pulse" />
          <h2 className="font-mono text-sm uppercase tracking-wider text-chrono-blue">
            Data Stream
          </h2>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-chrono-grid rounded w-1/3 mb-2" />
              <div className="h-6 bg-chrono-grid rounded" />
            </div>
          ))}
        </div>

        <div className="text-center font-mono text-xs text-chrono-text-dim animate-pulse">
          Fetching telemetry...
        </div>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="panel-chrono p-4 space-y-6">
        <div className="flex items-center gap-2 border-b border-chrono-border pb-3">
          <Activity className="w-5 h-5 text-chrono-text-dim" />
          <h2 className="font-mono text-sm uppercase tracking-wider text-chrono-text-dim">
            Data Stream
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Zap className="w-8 h-8 text-chrono-text-dim mb-4" />
          <p className="font-mono text-sm text-chrono-text-dim">
            No active scene
          </p>
          <p className="font-mono text-xs text-chrono-text-dim/50 mt-2">
            Initialize a jump to view telemetry
          </p>
        </div>
      </div>
    );
  }

  const { environment, anthropology, safety } = currentScene;

  return (
    <div className="panel-chrono p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-2rem)] lg:max-h-none">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-chrono-border pb-3">
        <Activity className="w-5 h-5 text-chrono-green" />
        <h2 className="font-mono text-sm uppercase tracking-wider text-chrono-green">
          Data Stream
        </h2>
        <span className="ml-auto text-xs text-chrono-green font-mono animate-pulse">● LIVE</span>
      </div>

      {/* Safety Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-chrono-red">
          <Shield className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Safety Analysis</span>
        </div>

        <HazardIndicator level={safety.hazardLevel} />

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-chrono-text-dim">HAZARD TYPE:</span>
            <span className="text-chrono-text">{safety.hazardType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-chrono-text-dim">SURVIVAL RATE:</span>
            <span className={safety.survivalProbability < 50 ? 'text-chrono-red' : 'text-chrono-green'}>
              {safety.survivalProbability}%
            </span>
          </div>
        </div>

        {/* Warnings */}
        {safety.warnings.length > 0 && (
          <div className="mt-3 space-y-2">
            {safety.warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-chrono-dark rounded text-xs"
              >
                <AlertTriangle className="w-3 h-3 text-chrono-yellow flex-shrink-0 mt-0.5" />
                <span className="font-mono text-chrono-yellow">{warning}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Environmental Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-chrono-blue">
          <Cloud className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Environmental</span>
        </div>

        <div className="bg-chrono-dark/50 rounded p-3 space-y-1">
          <DataRow
            icon={<Cloud className="w-4 h-4" />}
            label="Weather"
            value={environment.weather}
          />
          <DataRow
            icon={<Thermometer className="w-4 h-4" />}
            label="Temperature"
            value={environment.temperature}
            unit="°C"
          />
          <DataRow
            icon={<Droplets className="w-4 h-4" />}
            label="Humidity"
            value={environment.humidity}
            unit="%"
          />
          <DataRow
            icon={<Eye className="w-4 h-4" />}
            label="Visibility"
            value={environment.visibility}
          />
        </div>
      </div>

      {/* Anthropological Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-chrono-orange">
          <Users className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Anthropological</span>
        </div>

        <div className="bg-chrono-dark/50 rounded p-3 space-y-1">
          <DataRow
            icon={<Users className="w-4 h-4" />}
            label="Population"
            value={anthropology.populationDensity.toLocaleString()}
            unit="/km²"
          />
          <DataRow
            icon={<Cpu className="w-4 h-4" />}
            label="Tech Level"
            value={anthropology.technologyLevel}
            highlight
          />
          <DataRow
            icon={<Building className="w-4 h-4" />}
            label="Civilization"
            value={anthropology.civilization}
          />
        </div>

        {/* Notable Events */}
        {anthropology.notableEvents.length > 0 && (
          <div className="space-y-2">
            <span className="font-mono text-xs text-chrono-text-dim uppercase">Notable Events:</span>
            <div className="flex flex-wrap gap-2">
              {anthropology.notableEvents.map((event, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-chrono-dark rounded text-xs font-mono text-chrono-text border border-chrono-border"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-chrono-border text-center">
        <span className="font-mono text-xs text-chrono-text-dim">
          Data simulated for demonstration
        </span>
      </div>
    </div>
  );
}
