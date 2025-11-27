import { useState, useEffect } from 'react';
import {
  Clock,
  Settings,
  Info,
  X,
  Github,
} from 'lucide-react';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showInfo, setShowInfo] = useState(false);

  // Update real-world time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="bg-chrono-panel/90 backdrop-blur-sm border-b border-chrono-border px-4 py-3">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-chrono-blue animate-pulse-slow" />
              <div className="absolute inset-2 rounded-full border border-chrono-green opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-5 h-5 text-chrono-blue" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-mono text-lg font-bold tracking-wider">
                <span className="text-chrono-blue">THE</span>{' '}
                <span className="text-chrono-text">CHRONOSCOPE</span>
              </h1>
              <p className="font-mono text-xs text-chrono-text-dim tracking-widest uppercase">
                Temporal Rendering Engine
              </p>
            </div>
          </div>

          {/* Real-world time and actions */}
          <div className="flex items-center gap-6">
            {/* Current time */}
            <div className="hidden md:flex items-center gap-2 text-chrono-text-dim">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">
                {currentTime.toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span className="font-mono text-xs">LOCAL</span>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-chrono-border" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(true)}
                className="p-2 text-chrono-text-dim hover:text-chrono-blue transition-colors"
                title="About"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-chrono-text-dim hover:text-chrono-blue transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-chrono-green animate-pulse" />
              <span className="font-mono text-xs text-chrono-green uppercase tracking-wider hidden sm:inline">
                Online
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chrono-black/80 backdrop-blur-sm">
          <div className="panel-chrono max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-chrono-border pb-4">
              <h2 className="font-mono text-lg text-chrono-blue uppercase tracking-wider">
                About The Chronoscope
              </h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 text-chrono-text-dim hover:text-chrono-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-chrono-text">
              <p>
                <span className="text-chrono-blue font-semibold">The Chronoscope</span> is a
                conceptual temporal navigation interface—think of it as "Google Earth for History."
              </p>

              <p>
                This prototype demonstrates a 4D coordinate system for navigating through
                spacetime, treating history as a set of navigable coordinates rather than
                abstract narratives.
              </p>

              <div className="bg-chrono-dark/50 rounded p-4 space-y-2">
                <h3 className="font-mono text-xs text-chrono-text-dim uppercase tracking-wider">
                  Features
                </h3>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    <span className="text-chrono-green">▸</span>
                    Input precise spatial and temporal coordinates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-chrono-green">▸</span>
                    View environmental and anthropological data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-chrono-green">▸</span>
                    Hazard assessment for temporal jumps
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-chrono-green">▸</span>
                    Pre-configured waypoints to famous moments
                  </li>
                </ul>
              </div>

              <p className="text-chrono-text-dim text-xs">
                All data shown is simulated for demonstration purposes. The atmospheric
                visualizations represent a "buffering" state for future integration with
                real historical datasets and imagery.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-chrono-border">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-chrono-text-dim hover:text-chrono-blue transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="font-mono text-xs">Source Code</span>
              </a>
              <span className="font-mono text-xs text-chrono-text-dim">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
