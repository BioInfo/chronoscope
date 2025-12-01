// Core coordinate types for 4D navigation
export interface SpatialCoordinates {
  latitude: number;
  longitude: number;
}

export interface TemporalCoordinates {
  year: number; // Supports negative values for BC
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
}

export interface SpacetimeCoordinates {
  spatial: SpatialCoordinates;
  temporal: TemporalCoordinates;
}

// Hazard level system
export type HazardLevel = 'low' | 'medium' | 'high' | 'critical';

// Technology eras
export type TechnologyEra =
  | 'Stone Age'
  | 'Bronze Age'
  | 'Iron Age'
  | 'Classical'
  | 'Medieval'
  | 'Renaissance'
  | 'Industrial'
  | 'Electric'
  | 'Atomic'
  | 'Digital'
  | 'Space Age'
  | 'Vacuum'; // For extraterrestrial locations

// Weather conditions
export type WeatherCondition =
  | 'Clear'
  | 'Cloudy'
  | 'Rainy'
  | 'Stormy'
  | 'Snowy'
  | 'Foggy'
  | 'Hot'
  | 'Volcanic Ash'
  | 'Nuclear Fallout'
  | 'Vacuum'
  | 'Windy';

// Environmental data
export interface EnvironmentalData {
  weather: WeatherCondition;
  temperature: number; // Celsius
  humidity: number; // Percentage
  visibility: 'Clear' | 'Reduced' | 'Poor' | 'None';
}

// Anthropological data
export interface AnthropologicalData {
  populationDensity: number; // People per km²
  technologyLevel: TechnologyEra;
  civilization: string;
  notableEvents: string[];
}

// Safety metrics
export interface SafetyMetrics {
  hazardLevel: HazardLevel;
  hazardType: string;
  survivalProbability: number; // 0-100 percentage
  warnings: string[];
}

// Complete scene data for a rendered moment
export interface SceneData {
  coordinates: SpacetimeCoordinates;
  environment: EnvironmentalData;
  anthropology: AnthropologicalData;
  safety: SafetyMetrics;
  locationName: string;
  description: string;
}

// Curated waypoint (preset)
export interface Waypoint {
  id: string;
  name: string;
  coordinates: SpacetimeCoordinates;
  previewData: SceneData;
  icon: string; // Lucide icon name
  category: 'conflict' | 'discovery' | 'disaster' | 'achievement' | 'culture';
}

// Application state
export interface ChronoscopeState {
  // Current input values
  inputCoordinates: SpacetimeCoordinates;

  // Rendered scene (null until first render)
  currentScene: SceneData | null;

  // Generated image
  generatedImage: string | null; // Base64 data URL
  isGeneratingImage: boolean;
  imageError: string | null;

  // UI state
  isRendering: boolean;
  renderProgress: number; // 0-100

  // Viewport settings
  viewport: {
    compassHeading: number; // 0-359 degrees
    altitude: number; // meters
    zoom: number; // 1-10
  };

  // Error state
  error: string | null;
}

// Action types for reducer
export type ChronoscopeAction =
  | { type: 'SET_SPATIAL_COORDINATES'; payload: SpatialCoordinates }
  | { type: 'SET_TEMPORAL_COORDINATES'; payload: TemporalCoordinates }
  | { type: 'SET_COORDINATES'; payload: SpacetimeCoordinates }
  | { type: 'START_RENDER' }
  | { type: 'UPDATE_RENDER_PROGRESS'; payload: number }
  | { type: 'COMPLETE_RENDER'; payload: SceneData }
  | { type: 'START_IMAGE_GENERATION' }
  | { type: 'COMPLETE_IMAGE_GENERATION'; payload: string }
  | { type: 'IMAGE_GENERATION_ERROR'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_VIEWPORT'; payload: Partial<ChronoscopeState['viewport']> }
  | { type: 'RESET' };

// Utility type for date validation
export interface DateValidation {
  isValid: boolean;
  error?: string;
}

// Temporal Journal types
export interface JournalEntry {
  id: string;
  coordinates: SpacetimeCoordinates;
  locationName: string;
  timestamp: number; // Unix timestamp when visited
  hasGeneratedImage: boolean;
  thumbnail?: string; // Small base64 preview
}

export interface TemporalJournal {
  entries: JournalEntry[];
  maxEntries: number;
}

// Image Gallery types (stored in IndexedDB)
export interface GalleryImage {
  id: string;
  imageData: string; // base64 data URL
  coordinates: SpacetimeCoordinates;
  locationName: string;
  description: string;
  timestamp: number; // Unix timestamp when saved
}

// Chat/Temporal Assistant types
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
