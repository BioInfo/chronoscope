# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Chronoscope** is a Temporal Rendering Engine - an interactive React application that allows users to "travel" through spacetime by specifying spatial (latitude/longitude) and temporal (date/time) coordinates. The app renders simulated historical scenes and can optionally generate photorealistic historical images using Google's Gemini 3 Pro Image API.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (opens automatically on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

The app uses Vite environment variables. Gemini API key configuration is optional:

1. Copy `.env.example` to `.env`
2. Add your Gemini API key: `VITE_GEMINI_API_KEY=your_key_here`
3. Get a key at: https://aistudio.google.com/apikey

**Note:** The app works without an API key - users can store keys in the Settings UI via localStorage. The image generation feature requires a valid key.

## Architecture Overview

### Core Concept: 4D Navigation System

The app is built around **SpacetimeCoordinates** - combining 3D spatial coordinates (latitude/longitude/altitude) with temporal coordinates (year/month/day/hour/minute). Users input coordinates and the app "renders" a simulated historical scene.

### State Management: Context + Reducer Pattern

**ChronoscopeContext** (`src/context/ChronoscopeContext.tsx`) uses React's `useReducer` for centralized state management:

- **Input coordinates**: User's current spacetime selection
- **Scene data**: Rendered scene with environmental, anthropological, and safety data
- **Image generation**: Integration with Gemini API for photorealistic images
- **Render state**: Progress tracking for simulated rendering process
- **Viewport settings**: Compass heading, altitude, zoom controls

All state updates flow through typed actions (`ChronoscopeAction`) to the reducer.

### Three-Panel Layout

**Desktop:**
- **Left Panel**: ControlPlane (coordinate input) + Waypoints (curated historical moments)
- **Center**: Viewport (scene display with generated data or AI image)
- **Right Panel**: DataStream (detailed scene metrics - environment, anthropology, safety)

**Mobile:** Tab-based navigation between Controls, Viewport, and Data

### Type System (`src/types/index.ts`)

Comprehensive TypeScript types define the entire domain:
- **SpacetimeCoordinates**: Combined spatial + temporal positioning
- **SceneData**: Complete scene with environment, anthropology, safety metrics
- **TechnologyEra**: 11 historical eras from Stone Age to Space Age
- **HazardLevel**: Safety classification (low/medium/high/critical)
- **Waypoint**: Curated historical moments with pre-computed scene data

### Scene Generation (`src/utils/sceneGenerator.ts`)

Pure functions that simulate historical data based on coordinates:
- `generateScene()`: Creates SceneData from SpacetimeCoordinates
- `simulateRender()`: Animates render progress with realistic delays
- Era classification, population estimation, weather simulation, civilization mapping

All scene generation is deterministic based on input coordinates.

### Gemini Integration (`src/services/geminiService.ts`)

Optional AI image generation using Google Gemini 3 Pro Image:
- **API key management**: Stored in localStorage, configured via Settings UI
- **Prompt engineering**: Sophisticated prompts with era-specific details, weather atmosphere, lighting, and historical accuracy requirements
- **Response handling**: Extracts base64 image data from Gemini API response

Key function: `generateHistoricalImage()` - takes SceneData and returns photorealistic historical image.

### Curated Waypoints (`src/data/waypoints.ts`)

8 pre-configured historical moments with complete SceneData:
- Apollo 11 Landing (1969), First Flight at Kitty Hawk (1903), Berlin Wall Falls (1989)
- Woodstock Festival (1969), Independence Day (1776), Great Pyramid Construction (2560 BC)
- MLK's "I Have a Dream" Speech (1963), First Circumnavigation of Earth (1522)

Each waypoint includes coordinates, preview data, category, and icon for quick navigation.

## Key Implementation Patterns

### Coordinate Validation

Use `validateSpatialCoordinates()` and `validateTemporalCoordinates()` from `src/utils/validation.ts` before rendering. The reducer automatically validates in `renderScene()`.

### Jumping to Waypoints

`jumpToWaypoint()` has optimized UX - uses pre-computed `previewData` for instant rendering vs. full generation for custom coordinates.

### Image Generation Flow

1. User renders a scene (generates SceneData)
2. User clicks "Generate Image"
3. App checks for API key (Settings or localStorage)
4. Builds detailed prompt from SceneData
5. Calls Gemini API with `responseModalities: ['IMAGE']`
6. Displays returned base64 image in Viewport

### Error Handling

Errors are stored in state and displayed contextually:
- `error`: General rendering/validation errors
- `imageError`: Gemini API errors (configuration, API failures)

Use `clearError()` to dismiss.

## Component Relationships

- **Header**: Settings modal for API key configuration, global controls
- **ControlPlane**: Coordinate input forms, triggers `renderScene()`
- **Viewport**: Displays current scene data or generated image with visual styling
- **DataStream**: Formatted display of SceneData metrics
- **Waypoints**: Grid of curated moments, triggers `jumpToWaypoint()`

All components consume `useChronoscope()` hook for state and actions.

## Styling

Tailwind CSS with custom design tokens:
- `chrono-black`, `chrono-dark`: Dark theme backgrounds
- `chrono-blue`, `chrono-purple`: Accent colors
- `chrono-green`, `chrono-yellow`, `chrono-red`: Status indicators
- Responsive breakpoints: Mobile-first, `lg:` for desktop layout

Sci-fi aesthetic with monospace fonts, glowing accents, and border styling.

## Important Notes

- **BC/AD years**: Temporal coordinates support negative years for BC dates
- **Simulated data**: Scene generation is algorithmic, not backed by real historical database
- **Render simulation**: Progress animation is cosmetic - scene generation is instant
- **API key security**: Keys stored in localStorage only, never committed to repo
- **Extraterrestrial locations**: Moon/space coordinates use "Vacuum" weather and "Space Age" technology era
