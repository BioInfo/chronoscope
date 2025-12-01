import { useState, useEffect, type ChangeEvent } from 'react';
import {
  Globe,
  Calendar,
  Clock,
  Crosshair,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { useChronoscope } from '../context/ChronoscopeContext';
import { validateSpatialCoordinates, validateTemporalCoordinates, getDaysInMonth } from '../utils/validation';
import type { SpatialCoordinates, TemporalCoordinates } from '../types';

interface CoordinateInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

function CoordinateInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: CoordinateInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const parsed = parseFloat(newValue);
    if (!isNaN(parsed)) {
      let clamped = parsed;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    setInputValue(value.toString());
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="data-label">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className="input-chrono w-full pr-8 text-sm"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-chrono-text-dim text-xs">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function ControlPlane() {
  const { state, setSpatialCoordinates, setTemporalCoordinates, renderScene, reset } = useChronoscope();
  const { inputCoordinates, isRendering, error } = state;

  const [localSpatial, setLocalSpatial] = useState<SpatialCoordinates>(inputCoordinates.spatial);
  const [localTemporal, setLocalTemporal] = useState<TemporalCoordinates>(inputCoordinates.temporal);

  // Sync local state when context updates (e.g., from waypoint selection)
  useEffect(() => {
    setLocalSpatial(inputCoordinates.spatial);
    setLocalTemporal(inputCoordinates.temporal);
  }, [inputCoordinates]);

  const handleSpatialChange = (key: keyof SpatialCoordinates, value: number) => {
    const newSpatial = { ...localSpatial, [key]: value };
    setLocalSpatial(newSpatial);
    setSpatialCoordinates(newSpatial);
  };

  const handleTemporalChange = (key: keyof TemporalCoordinates, value: number) => {
    const newTemporal = { ...localTemporal, [key]: value };

    // Auto-correct day if it exceeds the month's max days
    if (key === 'month' || key === 'year') {
      const maxDays = getDaysInMonth(newTemporal.year, newTemporal.month);
      if (newTemporal.day > maxDays) {
        newTemporal.day = maxDays;
      }
    }

    setLocalTemporal(newTemporal);
    setTemporalCoordinates(newTemporal);
  };

  const handleRender = () => {
    if (!isRendering) {
      renderScene();
    }
  };

  const spatialValidation = validateSpatialCoordinates(localSpatial);
  const temporalValidation = validateTemporalCoordinates(localTemporal);
  const isValid = spatialValidation.isValid && temporalValidation.isValid;

  const maxDays = getDaysInMonth(localTemporal.year, localTemporal.month);

  return (
    <div className="panel-chrono p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-chrono-border pb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-chrono-blue" />
          <h2 className="font-mono text-sm uppercase tracking-wider text-chrono-blue">
            Control Plane
          </h2>
        </div>
        <button
          onClick={reset}
          className="p-2 text-chrono-text-dim hover:text-chrono-blue transition-colors"
          title="Reset to defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Spatial Coordinates */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-chrono-green">
          <Globe className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Spatial Coordinates</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <CoordinateInput
            label="Latitude"
            value={localSpatial.latitude}
            onChange={(v) => handleSpatialChange('latitude', v)}
            min={-90}
            max={90}
            step={0.0001}
            unit="°"
          />
          <CoordinateInput
            label="Longitude"
            value={localSpatial.longitude}
            onChange={(v) => handleSpatialChange('longitude', v)}
            min={-180}
            max={180}
            step={0.0001}
            unit="°"
          />
        </div>
      </div>

      {/* Temporal Coordinates */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-chrono-orange">
          <Calendar className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Temporal Coordinates</span>
        </div>

        <div className="grid grid-cols-[1fr_0.7fr_0.7fr] gap-3">
          <CoordinateInput
            label="Year"
            value={localTemporal.year}
            onChange={(v) => handleTemporalChange('year', Math.round(v))}
            min={-10000}
            max={3000}
            step={1}
          />
          <CoordinateInput
            label="Month"
            value={localTemporal.month}
            onChange={(v) => handleTemporalChange('month', Math.round(v))}
            min={1}
            max={12}
            step={1}
          />
          <CoordinateInput
            label="Day"
            value={localTemporal.day}
            onChange={(v) => handleTemporalChange('day', Math.round(v))}
            min={1}
            max={maxDays}
            step={1}
          />
        </div>

        <div className="flex items-center gap-2 text-chrono-orange mt-4">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Local Time</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <CoordinateInput
            label="Hour (24h)"
            value={localTemporal.hour}
            onChange={(v) => handleTemporalChange('hour', Math.round(v))}
            min={0}
            max={23}
            step={1}
          />
          <CoordinateInput
            label="Minute"
            value={localTemporal.minute}
            onChange={(v) => handleTemporalChange('minute', Math.round(v))}
            min={0}
            max={59}
            step={1}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-chrono-red/10 border border-chrono-red rounded text-sm">
          <AlertTriangle className="w-4 h-4 text-chrono-red flex-shrink-0" />
          <span className="text-chrono-red font-mono">{error}</span>
        </div>
      )}

      {/* Validation warnings */}
      {!spatialValidation.isValid && (
        <div className="text-xs text-chrono-orange font-mono">
          ⚠ {spatialValidation.error}
        </div>
      )}
      {!temporalValidation.isValid && (
        <div className="text-xs text-chrono-orange font-mono">
          ⚠ {temporalValidation.error}
        </div>
      )}

      {/* Render Button */}
      <button
        onClick={handleRender}
        disabled={isRendering || !isValid}
        className="btn-tactical-primary w-full relative overflow-hidden group"
      >
        <span className={`flex items-center justify-center gap-2 ${isRendering ? 'opacity-0' : 'opacity-100'}`}>
          <Crosshair className="w-5 h-5" />
          <span>Initialize Jump</span>
        </span>

        {isRendering && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="animate-pulse font-mono">RENDERING...</span>
          </span>
        )}

        {/* Tactical button effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-chrono-blue/0 via-chrono-blue/10 to-chrono-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>

      {/* Coordinate Preview */}
      <div className="pt-3 border-t border-chrono-border">
        <div className="text-xs text-chrono-text-dim font-mono space-y-1">
          <div className="flex justify-between">
            <span>TARGET:</span>
            <span className="text-chrono-text">
              {localSpatial.latitude.toFixed(4)}°, {localSpatial.longitude.toFixed(4)}°
            </span>
          </div>
          <div className="flex justify-between">
            <span>EPOCH:</span>
            <span className="text-chrono-text">
              {localTemporal.year <= 0 ? `${Math.abs(localTemporal.year - 1)} BC` : `${localTemporal.year} AD`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
