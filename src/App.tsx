import { useState, useCallback, useEffect } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { ChronoscopeProvider, useChronoscope } from './context/ChronoscopeContext';
import {
  Header,
  ControlPlane,
  Viewport,
  DataStream,
  Waypoints,
} from './components';
import { getCoordinatesFromUrl, updateUrlWithCoordinates } from './utils/urlManager';

interface ChronoscopeAppProps {
  onApiKeyChange: () => void;
}

function ChronoscopeApp({ onApiKeyChange }: ChronoscopeAppProps) {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<'controls' | 'viewport' | 'data'>('viewport');
  const { state, setCoordinates, renderScene } = useChronoscope();

  // Read URL coordinates on mount and auto-render
  useEffect(() => {
    const urlCoords = getCoordinatesFromUrl();
    if (urlCoords) {
      setCoordinates(urlCoords);
      // Small delay to ensure state is set before rendering
      setTimeout(() => {
        renderScene();
      }, 100);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL when scene is rendered
  useEffect(() => {
    if (state.currentScene) {
      updateUrlWithCoordinates(state.currentScene.coordinates);
    }
  }, [state.currentScene]);

  return (
    <div className="min-h-screen bg-chrono-black flex flex-col">
      <Header onApiKeyChange={onApiKeyChange} />

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left Panel - Controls & Waypoints */}
        <div
          className={`
            flex flex-col border-r border-chrono-border bg-chrono-dark/30
            transition-all duration-300 ease-out
            ${leftPanelOpen ? 'w-80' : 'w-12'}
          `}
        >
          {/* Panel Toggle */}
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="p-3 text-chrono-text-dim hover:text-chrono-blue transition-colors border-b border-chrono-border"
          >
            {leftPanelOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeftOpen className="w-5 h-5" />
            )}
          </button>

          {/* Panel Content */}
          {leftPanelOpen && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <ControlPlane />
              <Waypoints />
            </div>
          )}
        </div>

        {/* Main Viewport */}
        <div className="flex-1 p-4 overflow-hidden">
          <Viewport />
        </div>

        {/* Right Panel - Data Stream */}
        <div
          className={`
            flex flex-col border-l border-chrono-border bg-chrono-dark/30
            transition-all duration-300 ease-out
            ${rightPanelOpen ? 'w-80' : 'w-12'}
          `}
        >
          {/* Panel Toggle */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="p-3 text-chrono-text-dim hover:text-chrono-blue transition-colors border-b border-chrono-border"
          >
            {rightPanelOpen ? (
              <PanelRightClose className="w-5 h-5" />
            ) : (
              <PanelRightOpen className="w-5 h-5" />
            )}
          </button>

          {/* Panel Content */}
          {rightPanelOpen && (
            <div className="flex-1 overflow-y-auto p-4">
              <DataStream />
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-chrono-border bg-chrono-dark/50">
          <button
            onClick={() => setMobileTab('controls')}
            className={`flex-1 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
              mobileTab === 'controls'
                ? 'text-chrono-blue border-b-2 border-chrono-blue'
                : 'text-chrono-text-dim'
            }`}
          >
            Controls
          </button>
          <button
            onClick={() => setMobileTab('viewport')}
            className={`flex-1 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
              mobileTab === 'viewport'
                ? 'text-chrono-blue border-b-2 border-chrono-blue'
                : 'text-chrono-text-dim'
            }`}
          >
            Viewport
          </button>
          <button
            onClick={() => setMobileTab('data')}
            className={`flex-1 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
              mobileTab === 'data'
                ? 'text-chrono-blue border-b-2 border-chrono-blue'
                : 'text-chrono-text-dim'
            }`}
          >
            Data
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {mobileTab === 'controls' && (
            <div className="space-y-4">
              <ControlPlane />
              <Waypoints />
            </div>
          )}
          {mobileTab === 'viewport' && <Viewport />}
          {mobileTab === 'data' && <DataStream />}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-chrono-border bg-chrono-dark/30 px-4 py-2">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-chrono-text-dim">
              CHRONOSCOPE v1.0.0
            </span>
            <span className="hidden sm:inline font-mono text-xs text-chrono-text-dim">
              |
            </span>
            <span className="hidden sm:inline font-mono text-xs text-chrono-text-dim">
              TEMPORAL RENDERING ENGINE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chrono-green animate-pulse" />
            <span className="font-mono text-xs text-chrono-text-dim">
              SYS OK
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  // Use a key to force re-render of the provider when API key changes
  const [providerKey, setProviderKey] = useState(0);

  const handleApiKeyChange = useCallback(() => {
    // Increment key to force ChronoscopeProvider to re-mount and recalculate isApiConfigured
    setProviderKey(k => k + 1);
  }, []);

  return (
    <ChronoscopeProvider key={providerKey}>
      <ChronoscopeApp onApiKeyChange={handleApiKeyChange} />
    </ChronoscopeProvider>
  );
}

export default App;
