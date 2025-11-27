import { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, Check, AlertTriangle, Trash2 } from 'lucide-react';
import { getStoredApiKey, saveApiKey, clearApiKey, isGeminiConfigured } from '../services/geminiService';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyChange?: () => void;
}

export function Settings({ isOpen, onClose, onApiKeyChange }: SettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'cleared'>('idle');

  // Load current state on mount
  useEffect(() => {
    if (isOpen) {
      const storedKey = getStoredApiKey();
      setApiKey(storedKey || '');
      setIsConfigured(isGeminiConfigured());
      setSaveStatus('idle');
    }
  }, [isOpen]);

  const handleSave = () => {
    saveApiKey(apiKey);
    setIsConfigured(isGeminiConfigured());
    setSaveStatus('saved');
    onApiKeyChange?.();

    // Reset status after 2 seconds
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setIsConfigured(false);
    setSaveStatus('cleared');
    onApiKeyChange?.();

    // Reset status after 2 seconds
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chrono-black/80 backdrop-blur-sm">
      <div className="panel-chrono max-w-lg w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chrono-border pb-4">
          <h2 className="font-mono text-lg text-chrono-blue uppercase tracking-wider">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-chrono-text-dim hover:text-chrono-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-chrono-blue" />
            <h3 className="font-mono text-sm text-chrono-text uppercase tracking-wider">
              Gemini API Key
            </h3>
          </div>

          <p className="text-sm text-chrono-text-dim">
            Enter your Google Gemini API key to enable AI-powered photorealistic historical image generation.
            Your key is stored locally in your browser.
          </p>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <>
                <div className="w-2 h-2 rounded-full bg-chrono-green" />
                <span className="font-mono text-xs text-chrono-green uppercase">
                  API Key Configured
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-chrono-amber" />
                <span className="font-mono text-xs text-chrono-amber uppercase">
                  Not Configured
                </span>
              </>
            )}
          </div>

          {/* API Key input */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-chrono-text-dim uppercase tracking-wider">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full bg-chrono-dark border border-chrono-border rounded px-3 py-2 pr-10 font-mono text-sm text-chrono-text placeholder:text-chrono-text-dim/50 focus:outline-none focus:border-chrono-blue transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-chrono-text-dim hover:text-chrono-text transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-chrono-blue/20 border border-chrono-blue text-chrono-blue rounded font-mono text-sm uppercase tracking-wider hover:bg-chrono-blue/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saveStatus === 'saved' ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Save Key
                </>
              )}
            </button>

            {isConfigured && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 bg-chrono-red/20 border border-chrono-red text-chrono-red rounded font-mono text-sm uppercase tracking-wider hover:bg-chrono-red/30 transition-colors"
              >
                {saveStatus === 'cleared' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Cleared
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Clear Key
                  </>
                )}
              </button>
            )}
          </div>

          {/* Help text */}
          <div className="bg-chrono-dark/50 rounded p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-chrono-amber flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs text-chrono-text-dim">
                <p>
                  <strong className="text-chrono-text">How to get an API key:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Visit the Google AI Studio</li>
                  <li>Sign in with your Google account</li>
                  <li>Navigate to API keys section</li>
                  <li>Create a new API key</li>
                  <li>Copy and paste it here</li>
                </ol>
                <p className="text-chrono-amber">
                  Your API key is stored only in your browser's local storage and is never sent to any server except Google's Gemini API.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-chrono-border">
          <span className="font-mono text-xs text-chrono-text-dim">
            Model: Gemini 3 Pro Image
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-chrono-panel border border-chrono-border rounded font-mono text-sm uppercase tracking-wider text-chrono-text-dim hover:text-chrono-text hover:border-chrono-text-dim transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
