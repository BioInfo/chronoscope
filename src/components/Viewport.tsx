import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Compass,
  Mountain,
  Eye,
  Radio,
  Image,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useChronoscope } from '../context/ChronoscopeContext';
import { saveGalleryImage } from '../services/galleryService';
import type { HazardLevel } from '../types';

// Generate random stars for the background
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    animationDelay: Math.random() * 3,
  }));
};

// Get color scheme based on hazard level
const getHazardColors = (hazardLevel: HazardLevel) => {
  switch (hazardLevel) {
    case 'critical':
      return {
        primary: 'rgb(255, 51, 102)',
        secondary: 'rgb(255, 107, 53)',
        glow: 'rgba(255, 51, 102, 0.3)',
        gradient: 'from-red-900/30 via-orange-900/20 to-red-900/30',
      };
    case 'high':
      return {
        primary: 'rgb(255, 107, 53)',
        secondary: 'rgb(255, 215, 0)',
        glow: 'rgba(255, 107, 53, 0.3)',
        gradient: 'from-orange-900/30 via-yellow-900/20 to-orange-900/30',
      };
    case 'medium':
      return {
        primary: 'rgb(255, 215, 0)',
        secondary: 'rgb(0, 212, 255)',
        glow: 'rgba(255, 215, 0, 0.3)',
        gradient: 'from-yellow-900/20 via-blue-900/10 to-yellow-900/20',
      };
    case 'low':
    default:
      return {
        primary: 'rgb(0, 255, 136)',
        secondary: 'rgb(0, 212, 255)',
        glow: 'rgba(0, 255, 136, 0.3)',
        gradient: 'from-green-900/20 via-blue-900/10 to-green-900/20',
      };
  }
};

// Get time-of-day atmosphere
const getTimeAtmosphere = (hour: number) => {
  if (hour >= 6 && hour < 8) {
    return { name: 'Dawn', baseColor: 'from-indigo-900 via-purple-900 to-orange-900', brightness: 0.4 };
  } else if (hour >= 8 && hour < 17) {
    return { name: 'Day', baseColor: 'from-sky-900 via-blue-900 to-cyan-900', brightness: 0.6 };
  } else if (hour >= 17 && hour < 20) {
    return { name: 'Dusk', baseColor: 'from-orange-900 via-red-900 to-purple-900', brightness: 0.4 };
  } else {
    return { name: 'Night', baseColor: 'from-slate-950 via-indigo-950 to-slate-950', brightness: 0.2 };
  }
};

export function Viewport() {
  const { state, generateImage, isApiConfigured } = useChronoscope();
  const {
    currentScene,
    isRendering,
    renderProgress,
    viewport,
    inputCoordinates,
    generatedImage,
    isGeneratingImage,
    imageError,
  } = state;

  const [compassRotation, setCompassRotation] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const stars = useMemo(() => generateStars(50), []);
  const lastSavedImage = useRef<string | null>(null);
  const isSaving = useRef(false);

  // Animate compass slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setCompassRotation((prev) => prev + (Math.random() - 0.5) * 2);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Auto-save generated images to gallery
  // Uses multiple guards to prevent duplicate saves:
  // 1. lastSavedImage ref - tracks what was last saved
  // 2. isSaving ref - prevents concurrent save attempts
  // 3. galleryService mutex - final safety net for race conditions
  useEffect(() => {
    // Skip if no image, no scene, already saved, or currently saving
    if (!generatedImage || !currentScene) return;
    if (generatedImage === lastSavedImage.current) return;
    if (isSaving.current) return;

    // Mark as saving SYNCHRONOUSLY before async operation
    isSaving.current = true;
    lastSavedImage.current = generatedImage;

    const saveToGallery = async () => {
      try {
        await saveGalleryImage(
          generatedImage,
          currentScene.coordinates,
          currentScene.locationName,
          currentScene.description
        );
        // Notify header to update gallery count
        window.dispatchEvent(new Event('galleryUpdated'));
      } catch (error) {
        console.error('Failed to save image to gallery:', error);
        // Reset on error so retry is possible
        lastSavedImage.current = null;
      } finally {
        isSaving.current = false;
      }
    };
    saveToGallery();
  }, [generatedImage, currentScene]); // Include currentScene for proper cleanup

  const hazardLevel = currentScene?.safety.hazardLevel || 'low';
  const colors = getHazardColors(hazardLevel);
  const hour = currentScene?.coordinates.temporal.hour ?? inputCoordinates.temporal.hour;
  const atmosphere = getTimeAtmosphere(hour);

  const handleGenerateImage = () => {
    generateImage();
  };

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-0 overflow-hidden rounded-lg border border-chrono-border bg-chrono-black">
      {/* Generated Image Display */}
      {generatedImage && showImage && (
        <div className="absolute inset-0 z-5">
          <img
            src={generatedImage}
            alt="Generated historical view"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for HUD visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-chrono-black/60 via-transparent to-chrono-black/40" />
        </div>
      )}

      {/* Atmospheric Placeholder (shown when no image or toggled off) */}
      {(!generatedImage || !showImage) && (
        <>
          {/* Background layers */}
          <div className={`absolute inset-0 bg-gradient-to-br ${atmosphere.baseColor} transition-all duration-1000`} />

          {/* Stars (visible at night or in space) */}
          <div className="absolute inset-0 overflow-hidden" style={{ opacity: 1 - atmosphere.brightness }}>
            {stars.map((star) => (
              <div
                key={star.id}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                  animationDelay: `${star.animationDelay}s`,
                }}
              />
            ))}
          </div>

          {/* Hazard color overlay */}
          {currentScene && (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} transition-all duration-1000`}
              style={{ opacity: hazardLevel === 'critical' ? 0.5 : hazardLevel === 'high' ? 0.3 : 0.2 }}
            />
          )}

          {/* Animated grid */}
          <div className="absolute inset-0 grid-overlay opacity-30" />

          {/* Scan line effect */}
          <div className="scanline" />

          {/* Center wireframe */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full border-2 animate-pulse-slow"
                style={{ borderColor: colors.primary, boxShadow: `0 0 20px ${colors.glow}` }}
              />

              {/* Inner rings */}
              <div
                className="absolute inset-8 rounded-full border opacity-50"
                style={{ borderColor: colors.secondary }}
              />
              <div
                className="absolute inset-16 rounded-full border opacity-30"
                style={{ borderColor: colors.primary }}
              />

              {/* Center dot */}
              <div
                className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary, boxShadow: `0 0 20px ${colors.glow}` }}
              />

              {/* Crosshairs */}
              <div
                className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2 opacity-30"
                style={{ background: `linear-gradient(to bottom, transparent, ${colors.primary}, transparent)` }}
              />
              <div
                className="absolute left-0 top-1/2 w-full h-px -translate-y-1/2 opacity-30"
                style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* HUD Elements */}
      <div className="absolute inset-0 p-4 pointer-events-none">
        {/* Top left - Status */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRendering || isGeneratingImage ? 'bg-chrono-yellow animate-pulse' : 'bg-chrono-green'}`} />
            <span className="font-mono text-xs text-chrono-text-dim uppercase tracking-wider">
              {isRendering ? 'Rendering' : isGeneratingImage ? 'Generating' : 'Ready'}
            </span>
          </div>
          <div className="font-mono text-xs text-chrono-text-dim">
            <span className="text-chrono-blue">SYS</span> TEMPORAL_ENGINE v2.1
          </div>
          {generatedImage && (
            <div className="font-mono text-xs text-chrono-green">
              <span className="text-chrono-green">IMG</span> AI Generated
            </div>
          )}
        </div>

        {/* Top right - Compass */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Compass
              className="w-5 h-5 text-chrono-blue transition-transform"
              style={{ transform: `rotate(${viewport.compassHeading + compassRotation}deg)` }}
            />
            <span className="font-mono text-sm text-chrono-text">
              {Math.round(viewport.compassHeading + compassRotation + 360) % 360}°
            </span>
          </div>
          <div className="flex items-center gap-2 text-chrono-text-dim">
            <Mountain className="w-4 h-4" />
            <span className="font-mono text-xs">{viewport.altitude}m ALT</span>
          </div>
        </div>

        {/* Bottom left - Coordinates */}
        <div className="absolute bottom-4 left-4 font-mono text-xs space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-chrono-blue" />
            <span className="text-chrono-text-dim">VIEWPORT</span>
          </div>
          <div className="text-chrono-text">
            LAT: {(currentScene?.coordinates.spatial.latitude ?? inputCoordinates.spatial.latitude).toFixed(4)}°
          </div>
          <div className="text-chrono-text">
            LNG: {(currentScene?.coordinates.spatial.longitude ?? inputCoordinates.spatial.longitude).toFixed(4)}°
          </div>
        </div>

        {/* Bottom right - Time */}
        <div className="absolute bottom-4 right-4 font-mono text-xs text-right space-y-1">
          <div className="flex items-center justify-end gap-2">
            <span className="text-chrono-text-dim">EPOCH</span>
            <Radio className="w-4 h-4 text-chrono-orange" />
          </div>
          <div className="text-chrono-text">
            {(currentScene?.coordinates.temporal.year ?? inputCoordinates.temporal.year) <= 0
              ? `${Math.abs((currentScene?.coordinates.temporal.year ?? inputCoordinates.temporal.year) - 1)} BCE`
              : `${currentScene?.coordinates.temporal.year ?? inputCoordinates.temporal.year} CE`}
          </div>
          <div className="text-chrono-text">
            {String(currentScene?.coordinates.temporal.hour ?? inputCoordinates.temporal.hour).padStart(2, '0')}:
            {String(currentScene?.coordinates.temporal.minute ?? inputCoordinates.temporal.minute).padStart(2, '0')} LOCAL
          </div>
        </div>
      </div>

      {/* Image Generation Controls */}
      {currentScene && !isRendering && (
        <div className="absolute top-16 left-4 space-y-2 pointer-events-auto">
          {/* Generate Image Button */}
          <button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage || !isApiConfigured}
            className="flex items-center gap-2 px-3 py-2 bg-chrono-panel/90 border border-chrono-border rounded
                       text-chrono-text font-mono text-xs uppercase tracking-wider
                       hover:border-chrono-blue hover:bg-chrono-blue/10 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isApiConfigured ? 'API key not configured' : 'Generate AI image'}
          >
            {isGeneratingImage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-chrono-yellow" />
                <span>Generate View</span>
              </>
            )}
          </button>

          {/* Toggle Image/Placeholder */}
          {generatedImage && (
            <button
              onClick={() => setShowImage(!showImage)}
              className="flex items-center gap-2 px-3 py-2 bg-chrono-panel/90 border border-chrono-border rounded
                         text-chrono-text font-mono text-xs uppercase tracking-wider
                         hover:border-chrono-blue hover:bg-chrono-blue/10 transition-all"
            >
              <Image className="w-4 h-4" />
              <span>{showImage ? 'Show Grid' : 'Show Image'}</span>
            </button>
          )}

          {/* API not configured warning */}
          {!isApiConfigured && (
            <div className="flex items-center gap-2 px-3 py-2 bg-chrono-orange/10 border border-chrono-orange/30 rounded text-xs">
              <AlertCircle className="w-4 h-4 text-chrono-orange" />
              <span className="text-chrono-orange font-mono">API key needed</span>
            </div>
          )}

          {/* Image generation error */}
          {imageError && (
            <div className="flex items-start gap-2 px-3 py-2 bg-chrono-red/10 border border-chrono-red/30 rounded text-xs max-w-xs">
              <AlertCircle className="w-4 h-4 text-chrono-red flex-shrink-0 mt-0.5" />
              <span className="text-chrono-red font-mono">{imageError}</span>
            </div>
          )}
        </div>
      )}

      {/* Render progress overlay */}
      {isRendering && (
        <div className="absolute inset-0 bg-chrono-black/50 flex flex-col items-center justify-center z-10">
          <div className="text-center space-y-4">
            <div className="font-mono text-chrono-blue text-lg animate-pulse">
              CALIBRATING TEMPORAL SENSORS
            </div>

            {/* Progress bar */}
            <div className="w-64 h-2 bg-chrono-dark rounded-full overflow-hidden border border-chrono-border">
              <div
                className="h-full bg-gradient-to-r from-chrono-blue to-chrono-green transition-all duration-100"
                style={{ width: `${renderProgress}%` }}
              />
            </div>

            <div className="font-mono text-sm text-chrono-text-dim">
              {renderProgress < 20 && 'Calibrating temporal sensors...'}
              {renderProgress >= 20 && renderProgress < 40 && 'Locking spatial coordinates...'}
              {renderProgress >= 40 && renderProgress < 60 && 'Synchronizing timeline...'}
              {renderProgress >= 60 && renderProgress < 80 && 'Rendering atmospheric data...'}
              {renderProgress >= 80 && renderProgress < 100 && 'Finalizing scene...'}
              {renderProgress >= 100 && 'Complete'}
            </div>

            <div className="font-mono text-2xl text-chrono-blue">
              {renderProgress}%
            </div>
          </div>
        </div>
      )}

      {/* Image generation overlay */}
      {isGeneratingImage && (
        <div className="absolute inset-0 bg-chrono-black/70 flex flex-col items-center justify-center z-10">
          <div className="text-center space-y-4">
            <Sparkles className="w-12 h-12 text-chrono-yellow animate-pulse mx-auto" />
            <div className="font-mono text-chrono-yellow text-lg animate-pulse">
              GENERATING HISTORICAL VIEW
            </div>
            <div className="font-mono text-sm text-chrono-text-dim">
              AI is reconstructing the scene...
            </div>
            <Loader2 className="w-8 h-8 text-chrono-blue animate-spin mx-auto" />
          </div>
        </div>
      )}

      {/* Location name overlay */}
      {currentScene && !isRendering && !isGeneratingImage && !generatedImage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-32">
          <div className="font-mono text-xl text-chrono-text glow-blue animate-pulse">
            {currentScene.locationName}
          </div>
          <div className="font-mono text-xs text-chrono-text-dim mt-2 max-w-xs">
            {currentScene.description}
          </div>
        </div>
      )}

      {/* No scene placeholder */}
      {!currentScene && !isRendering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="font-mono text-chrono-text-dim text-sm uppercase tracking-wider">
              Awaiting Coordinates
            </div>
            <div className="font-mono text-xs text-chrono-text-dim/50">
              Select a waypoint or enter custom coordinates
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
