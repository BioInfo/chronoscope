import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type {
  ChronoscopeState,
  ChronoscopeAction,
  SpacetimeCoordinates,
  SpatialCoordinates,
  TemporalCoordinates,
  SceneData,
} from '../types';
import { generateScene, simulateRender } from '../utils/sceneGenerator';
import { validateSpatialCoordinates, validateTemporalCoordinates } from '../utils/validation';
import { generateHistoricalImage, isGeminiConfigured } from '../services/geminiService';

// Default coordinates: London, present day
const DEFAULT_COORDINATES: SpacetimeCoordinates = {
  spatial: {
    latitude: 51.5074,
    longitude: -0.1278,
  },
  temporal: {
    year: 2024,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
  },
};

const INITIAL_STATE: ChronoscopeState = {
  inputCoordinates: DEFAULT_COORDINATES,
  currentScene: null,
  generatedImage: null,
  isGeneratingImage: false,
  imageError: null,
  isRendering: false,
  renderProgress: 0,
  viewport: {
    compassHeading: 0,
    altitude: 100,
    zoom: 5,
  },
  error: null,
};

function chronoscopeReducer(state: ChronoscopeState, action: ChronoscopeAction): ChronoscopeState {
  switch (action.type) {
    case 'SET_SPATIAL_COORDINATES':
      return {
        ...state,
        inputCoordinates: {
          ...state.inputCoordinates,
          spatial: action.payload,
        },
        error: null,
      };

    case 'SET_TEMPORAL_COORDINATES':
      return {
        ...state,
        inputCoordinates: {
          ...state.inputCoordinates,
          temporal: action.payload,
        },
        error: null,
      };

    case 'SET_COORDINATES':
      return {
        ...state,
        inputCoordinates: action.payload,
        error: null,
      };

    case 'START_RENDER':
      return {
        ...state,
        isRendering: true,
        renderProgress: 0,
        error: null,
        generatedImage: null,
        imageError: null,
      };

    case 'UPDATE_RENDER_PROGRESS':
      return {
        ...state,
        renderProgress: action.payload,
      };

    case 'COMPLETE_RENDER':
      return {
        ...state,
        isRendering: false,
        renderProgress: 100,
        currentScene: action.payload,
      };

    case 'START_IMAGE_GENERATION':
      return {
        ...state,
        isGeneratingImage: true,
        imageError: null,
      };

    case 'COMPLETE_IMAGE_GENERATION':
      return {
        ...state,
        isGeneratingImage: false,
        generatedImage: action.payload,
      };

    case 'IMAGE_GENERATION_ERROR':
      return {
        ...state,
        isGeneratingImage: false,
        imageError: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        isRendering: false,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        imageError: null,
      };

    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: {
          ...state.viewport,
          ...action.payload,
        },
      };

    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// Context type with actions
interface ChronoscopeContextType {
  state: ChronoscopeState;
  setSpatialCoordinates: (coords: SpatialCoordinates) => void;
  setTemporalCoordinates: (coords: TemporalCoordinates) => void;
  setCoordinates: (coords: SpacetimeCoordinates) => void;
  renderScene: () => void;
  jumpToWaypoint: (coords: SpacetimeCoordinates, previewData?: SceneData) => void;
  generateImage: () => Promise<void>;
  setViewport: (viewport: Partial<ChronoscopeState['viewport']>) => void;
  clearError: () => void;
  reset: () => void;
  isApiConfigured: boolean;
}

const ChronoscopeContext = createContext<ChronoscopeContextType | null>(null);

export function ChronoscopeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chronoscopeReducer, INITIAL_STATE);

  const setSpatialCoordinates = useCallback((coords: SpatialCoordinates) => {
    dispatch({ type: 'SET_SPATIAL_COORDINATES', payload: coords });
  }, []);

  const setTemporalCoordinates = useCallback((coords: TemporalCoordinates) => {
    dispatch({ type: 'SET_TEMPORAL_COORDINATES', payload: coords });
  }, []);

  const setCoordinates = useCallback((coords: SpacetimeCoordinates) => {
    dispatch({ type: 'SET_COORDINATES', payload: coords });
  }, []);

  const renderScene = useCallback(() => {
    // Validate coordinates first
    const spatialValidation = validateSpatialCoordinates(state.inputCoordinates.spatial);
    if (!spatialValidation.isValid) {
      dispatch({ type: 'SET_ERROR', payload: spatialValidation.error! });
      return;
    }

    const temporalValidation = validateTemporalCoordinates(state.inputCoordinates.temporal);
    if (!temporalValidation.isValid) {
      dispatch({ type: 'SET_ERROR', payload: temporalValidation.error! });
      return;
    }

    dispatch({ type: 'START_RENDER' });

    // Simulate the render process with progress updates
    simulateRender(
      (progress) => {
        dispatch({ type: 'UPDATE_RENDER_PROGRESS', payload: progress });
      },
      () => {
        const scene = generateScene(state.inputCoordinates);
        dispatch({ type: 'COMPLETE_RENDER', payload: scene });
      }
    );
  }, [state.inputCoordinates]);

  const jumpToWaypoint = useCallback((coords: SpacetimeCoordinates, previewData?: SceneData) => {
    dispatch({ type: 'SET_COORDINATES', payload: coords });

    // If we have preview data, use it immediately for a snappy experience
    if (previewData) {
      dispatch({ type: 'START_RENDER' });
      // Quick render simulation for waypoints
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        dispatch({ type: 'UPDATE_RENDER_PROGRESS', payload: progress });
        if (progress >= 100) {
          clearInterval(interval);
          dispatch({ type: 'COMPLETE_RENDER', payload: previewData });
        }
      }, 30);
    } else {
      // Full render for custom coordinates
      dispatch({ type: 'START_RENDER' });
      simulateRender(
        (progress) => {
          dispatch({ type: 'UPDATE_RENDER_PROGRESS', payload: progress });
        },
        () => {
          const scene = generateScene(coords);
          dispatch({ type: 'COMPLETE_RENDER', payload: scene });
        }
      );
    }
  }, []);

  const generateImage = useCallback(async () => {
    if (!state.currentScene) {
      dispatch({ type: 'IMAGE_GENERATION_ERROR', payload: 'No scene data available. Render a scene first.' });
      return;
    }

    if (!isGeminiConfigured()) {
      dispatch({
        type: 'IMAGE_GENERATION_ERROR',
        payload: 'Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.',
      });
      return;
    }

    dispatch({ type: 'START_IMAGE_GENERATION' });

    const result = await generateHistoricalImage(
      state.currentScene.coordinates,
      state.currentScene
    );

    if (result.success && result.imageData) {
      dispatch({ type: 'COMPLETE_IMAGE_GENERATION', payload: result.imageData });
    } else {
      dispatch({ type: 'IMAGE_GENERATION_ERROR', payload: result.error || 'Unknown error' });
    }
  }, [state.currentScene]);

  const setViewport = useCallback((viewport: Partial<ChronoscopeState['viewport']>) => {
    dispatch({ type: 'SET_VIEWPORT', payload: viewport });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value: ChronoscopeContextType = {
    state,
    setSpatialCoordinates,
    setTemporalCoordinates,
    setCoordinates,
    renderScene,
    jumpToWaypoint,
    generateImage,
    setViewport,
    clearError,
    reset,
    isApiConfigured: isGeminiConfigured(),
  };

  return (
    <ChronoscopeContext.Provider value={value}>
      {children}
    </ChronoscopeContext.Provider>
  );
}

export function useChronoscope(): ChronoscopeContextType {
  const context = useContext(ChronoscopeContext);
  if (!context) {
    throw new Error('useChronoscope must be used within a ChronoscopeProvider');
  }
  return context;
}

export { DEFAULT_COORDINATES };
