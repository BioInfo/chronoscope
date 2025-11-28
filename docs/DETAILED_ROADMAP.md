# The Chronoscope - Detailed Product Roadmap

**Last Updated**: 2025-11-28
**Vision**: Transform The Chronoscope from a temporal teleportation tool into a comprehensive spacetime exploration platform

---

## Executive Summary

**Current State**: Clean 4D navigation interface with AI-powered historical visualization and curated waypoints

**Core Challenge**: Enhance temporal exploration without feature bloat

**Strategic Direction**: Focus on three pillars:
1. **Temporal Navigation** - Move through time, not just jump to moments
2. **Discovery & Context** - Help users find and understand interesting moments
3. **Persistence & Sharing** - Save discoveries and share with others

---

## Phase 1: Essential UX Foundations
**Timeline**: 1-2 days
**Goal**: Make current experience sticky and shareable
**Priority**: 🔥 CRITICAL

### 1.1 URL-Based Coordinate Sharing
**Effort**: 2 hours | **Value**: ⭐⭐⭐⭐⭐

**Feature**: Encode spacetime coordinates in URL parameters for instant sharing

**URL Format**:
```
https://chronoscope-amber.vercel.app/?lat=32.7788&lng=-96.8084&year=1963&month=11&day=22&hour=12&minute=30
```

**Implementation**:
- Read URL params on app mount
- Update URL when coordinates change (replaceState)
- Add "Copy Link" button in header
- Toast notification on copy

**Technical Details**:
```typescript
// src/utils/urlManager.ts
export const encodeCoordinates = (coords: SpacetimeCoordinates): string => {
  const params = new URLSearchParams();
  params.set('lat', coords.spatial.latitude.toString());
  params.set('lng', coords.spatial.longitude.toString());
  params.set('year', coords.temporal.year.toString());
  params.set('month', coords.temporal.month.toString());
  params.set('day', coords.temporal.day.toString());
  params.set('hour', coords.temporal.hour.toString());
  params.set('minute', coords.temporal.minute.toString());
  return params.toString();
};

export const decodeCoordinates = (search: string): SpacetimeCoordinates | null => {
  const params = new URLSearchParams(search);
  if (!params.has('lat')) return null;

  return {
    spatial: {
      latitude: parseFloat(params.get('lat')!),
      longitude: parseFloat(params.get('lng')!),
    },
    temporal: {
      year: parseInt(params.get('year')!),
      month: parseInt(params.get('month')!),
      day: parseInt(params.get('day')!),
      hour: parseInt(params.get('hour')!),
      minute: parseInt(params.get('minute')!),
    },
  };
};
```

**UI Changes**:
- Add "Share" button with copy icon in header
- Show toast: "✓ Link copied to clipboard"

**Success Metrics**:
- % of sessions with shared URLs
- Inbound traffic from shared links

---

### 1.2 Temporal Journal (Visit History)
**Effort**: 4 hours | **Value**: ⭐⭐⭐⭐⭐

**Feature**: localStorage-based history of visited coordinates with quick return

**UI Location**: New collapsible panel below Waypoints in left sidebar

**Data Structure**:
```typescript
interface TemporalJournalEntry {
  id: string;
  coordinates: SpacetimeCoordinates;
  locationName: string;
  timestamp: number;
  hasGeneratedImage: boolean;
  thumbnail?: string; // base64 preview
}

interface TemporalJournal {
  entries: TemporalJournalEntry[];
  maxEntries: number; // 50
}
```

**Features**:
- Save coordinates when user clicks "Render Scene"
- Display last 50 visits (oldest removed automatically)
- Click entry to jump to those coordinates
- Show preview thumbnail if image was generated
- Export as JSON file
- Import from JSON file
- Clear all history button

**UI Design**:
```
┌─ TEMPORAL JOURNAL ──────────────┐
│ 📜 Recent Visits (Last 50)      │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ JFK Assassination           │ │
│ │ Dallas, Texas, USA          │ │
│ │ 11/22/1963 12:30 PM         │ │
│ │ [📸 View]                   │ │
│ └─────────────────────────────┘ │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Apollo 11 Landing           │ │
│ │ Sea of Tranquility, Moon    │ │
│ │ 07/20/1969 20:17            │ │
│ │ [📸 View]                   │ │
│ └─────────────────────────────┘ │
│                                  │
│ [Export] [Import] [Clear All]   │
└──────────────────────────────────┘
```

**localStorage Implementation**:
```typescript
// src/utils/temporalJournal.ts
const JOURNAL_KEY = 'chronoscope_journal';

export const addJournalEntry = (entry: Omit<TemporalJournalEntry, 'id' | 'timestamp'>) => {
  const journal = getJournal();
  const newEntry: TemporalJournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  journal.entries.unshift(newEntry);
  if (journal.entries.length > journal.maxEntries) {
    journal.entries = journal.entries.slice(0, journal.maxEntries);
  }

  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
};
```

**Success Metrics**:
- Average entries per user
- % of users who return to previous coordinates
- Export/import usage

---

### 1.3 Image Gallery & Export
**Effort**: 6 hours | **Value**: ⭐⭐⭐⭐

**Feature**: Save generated images to IndexedDB with metadata, browse gallery, download images

**Storage**: IndexedDB (supports ~50-100 images before browser prompts)

**Data Structure**:
```typescript
interface SavedImage {
  id: string;
  imageData: string; // base64 data URL
  coordinates: SpacetimeCoordinates;
  sceneData: SceneData;
  timestamp: number;
  prompt: string;
}
```

**Features**:
- Auto-save images when generated
- Gallery view in modal (grid layout)
- Click to view full size
- Download as PNG with metadata in filename
- Delete individual images
- Clear all gallery
- Show storage usage

**UI Location**:
- "Gallery" button in header (shows count badge)
- Modal overlay with grid

**Gallery Modal Design**:
```
┌─ IMAGE GALLERY ─────────────────────────────────────┐
│                                           [✕ Close] │
│                                                      │
│  Storage: 45.2 MB / ~100 MB                         │
│                                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ IMG1 │  │ IMG2 │  │ IMG3 │  │ IMG4 │           │
│  │      │  │      │  │      │  │      │           │
│  └──────┘  └──────┘  └──────┘  └──────┘           │
│  Dallas    Pompeii   Moon      Berlin              │
│  1963      79 AD     1969      1989                │
│  [View] [Download] [Delete]                         │
│                                                      │
│  [Clear All Gallery]                                │
└──────────────────────────────────────────────────────┘
```

**IndexedDB Implementation**:
```typescript
// src/utils/imageGallery.ts
import { openDB, DBSchema } from 'idb';

interface ImageGalleryDB extends DBSchema {
  images: {
    key: string;
    value: SavedImage;
    indexes: { 'by-date': number };
  };
}

const dbPromise = openDB<ImageGalleryDB>('chronoscope-gallery', 1, {
  upgrade(db) {
    const store = db.createObjectStore('images', { keyPath: 'id' });
    store.createIndex('by-date', 'timestamp');
  },
});

export const saveImage = async (image: Omit<SavedImage, 'id' | 'timestamp'>) => {
  const db = await dbPromise;
  const newImage: SavedImage = {
    ...image,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  await db.add('images', newImage);
  return newImage;
};
```

**Success Metrics**:
- Images saved per user
- Download rate
- Gallery revisit rate

---

## Phase 2: Temporal Navigation
**Timeline**: 3-5 days
**Goal**: Add true temporal movement capabilities
**Priority**: 🔥 HIGH

### 2.1 Temporal Slider (Time-Lapse Mode)
**Effort**: 2 days | **Value**: ⭐⭐⭐⭐⭐

**Feature**: Stay at one location, slide through time to watch history unfold

**This is the KILLER FEATURE** - transforms app from teleportation to true temporal navigation

**UI Location**: New tab in Viewport area (replaces current scene view)

**Interface Design**:
```
┌─ TEMPORAL SLIDER ───────────────────────────────────┐
│                                                      │
│  📍 Location: Dealey Plaza, Dallas, Texas           │
│  🔒 Lock coordinates: 32.7788°N, -96.8084°W        │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │         [Generated Image Here]                 │ │
│  │                                                 │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  1950 ━━━━━━━━━●━━━━━━━━━━ 1975                   │
│       ← 1 year  [Play ▶] 1 year →                  │
│                                                      │
│  Step size: [1 year ▼] [5 years] [10 years]        │
│  Quality: [Quick (1K)] [Standard (2K)]              │
│                                                      │
│  📊 Progress: 12/25 frames generated                │
│  💾 Cache: 8 frames stored                          │
│                                                      │
│  [Generate Time-Lapse] [Save as GIF] [Clear Cache] │
└──────────────────────────────────────────────────────┘
```

**Implementation Strategy**:

```typescript
// src/components/TemporalSlider.tsx
interface TimeLapseConfig {
  location: SpatialCoordinates;
  startYear: number;
  endYear: number;
  stepYears: number;
  quality: '1K' | '2K';
}

interface TimeLapseFrame {
  year: number;
  sceneData: SceneData;
  imageData?: string;
  status: 'pending' | 'generating' | 'complete' | 'error';
}

const generateTimeLapse = async (
  config: TimeLapseConfig,
  onProgress: (frame: number, total: number) => void
) => {
  const frames: TimeLapseFrame[] = [];
  const totalFrames = Math.ceil((config.endYear - config.startYear) / config.stepYears);

  for (let i = 0; i < totalFrames; i++) {
    const year = config.startYear + (i * config.stepYears);

    const frame: TimeLapseFrame = {
      year,
      status: 'generating',
    };
    frames.push(frame);

    try {
      // Generate scene data
      const scene = generateScene({
        spatial: config.location,
        temporal: { year, month: 6, day: 15, hour: 12, minute: 0 },
      });

      // Generate image if API key configured
      if (isGeminiConfigured()) {
        const result = await generateHistoricalImage(scene.coordinates, scene);
        frame.imageData = result.imageData;
      }

      frame.sceneData = scene;
      frame.status = 'complete';

      // Cache frame
      await cacheTimeLapseFrame(config.location, year, frame);

      onProgress(i + 1, totalFrames);
    } catch (error) {
      frame.status = 'error';
    }
  }

  return frames;
};
```

**Caching Strategy**:
```typescript
// Cache in IndexedDB for performance
interface TimeLapseCache extends DBSchema {
  frames: {
    key: string; // `${lat}_${lng}_${year}`
    value: TimeLapseFrame;
    indexes: { 'by-location': string };
  };
}

// Check cache before generating
const getCachedFrame = async (lat: number, lng: number, year: number) => {
  const db = await openDB<TimeLapseCache>('chronoscope-timelapse', 1);
  const key = `${lat.toFixed(4)}_${lng.toFixed(4)}_${year}`;
  return await db.get('frames', key);
};
```

**Cost Optimization**:
- Use 1K resolution for initial scrubbing
- Only generate 2K on explicit "high quality" request
- Cache aggressively (frames rarely change)
- Allow cancellation mid-generation
- Show cost estimate before generating (e.g., "This will generate 25 images")

**Features**:
- Scrub slider to preview different years
- Play/pause animation
- Adjustable playback speed
- Export as GIF/MP4
- Save individual frames
- Preload adjacent frames for smooth scrubbing

**Success Metrics**:
- Time-lapses generated per user
- Average frames per time-lapse
- Cache hit rate
- API cost per time-lapse

---

### 2.2 Gemini Flash Chatbot Integration
**Effort**: 1 day | **Value**: ⭐⭐⭐⭐⭐

**Feature**: Conversational AI assistant using Gemini 2.0 Flash for quick Q&A about scenes, locations, and app features

**UI Location**: Right sidebar, below Data Stream (collapsible panel)

**Interface Design**:
```
┌─ TEMPORAL ASSISTANT ────────────────┐
│ 💬 Chat with Gemini                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ User: What was the weather     │ │
│ │ like in Dallas that day?       │ │
│ │                                 │ │
│ │ Assistant: Based on historical │ │
│ │ records, November 22, 1963 was │ │
│ │ a clear day in Dallas with...  │ │
│ │                                 │ │
│ │ User: Were there any warnings? │ │
│ │                                 │ │
│ │ Assistant: Security concerns...│ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Type your question...]      [Send]│
│                                     │
│ Quick Actions:                      │
│ • "Tell me about this moment"      │
│ • "What happened next?"            │
│ • "Show me similar events"         │
└─────────────────────────────────────┘
```

**Context Integration**:
- Automatically include current scene data in chat context
- Reference coordinates, era, civilization
- Access to generated image (vision capabilities)
- Remember conversation within session

**Implementation**:
```typescript
// src/services/chatService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.0-flash-exp'; // Fast, cheap, multimodal

interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
}

export class TemporalAssistant {
  private genAI: GoogleGenerativeAI;
  private chat: any;
  private history: ChatMessage[] = [];

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async startSession(sceneData: SceneData, imageData?: string) {
    const model = this.genAI.getGenerativeModel({ model: MODEL_NAME });

    // Build context from scene data
    const contextPrompt = this.buildContextPrompt(sceneData);

    const chatHistory: ChatMessage[] = [
      {
        role: 'user',
        parts: [{ text: contextPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand the temporal context. I\'m ready to answer questions about this moment in history!' }],
      },
    ];

    // If image available, include it
    if (imageData) {
      chatHistory[0].parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: imageData.split(',')[1], // Remove data URL prefix
        },
      });
    }

    this.chat = model.startChat({ history: chatHistory });
    this.history = chatHistory;
  }

  private buildContextPrompt(sceneData: SceneData): string {
    return `You are a temporal assistant for The Chronoscope, a spacetime exploration app.

Current Location: ${sceneData.locationName}
Coordinates: ${sceneData.coordinates.spatial.latitude}°N, ${sceneData.coordinates.spatial.longitude}°E
Time: ${sceneData.coordinates.temporal.year}-${sceneData.coordinates.temporal.month}-${sceneData.coordinates.temporal.day} ${sceneData.coordinates.temporal.hour}:${sceneData.coordinates.temporal.minute}

Environmental Data:
- Weather: ${sceneData.environment.weather}
- Temperature: ${sceneData.environment.temperature}°C
- Humidity: ${sceneData.environment.humidity}%

Anthropological Data:
- Era: ${sceneData.anthropology.technologyLevel}
- Civilization: ${sceneData.anthropology.civilization}
- Population Density: ${sceneData.anthropology.populationDensity}/km²
- Notable Events: ${sceneData.anthropology.notableEvents.join(', ')}

Safety Information:
- Hazard Level: ${sceneData.safety.hazardLevel}
- Hazard Type: ${sceneData.safety.hazardType}
- Survival Probability: ${sceneData.safety.survivalProbability}%

Your role:
- Answer questions about this specific moment in history
- Provide historical context and interesting facts
- Explain the scene data and what it means
- Help users discover related moments or locations
- Guide users on how to use app features

Be conversational, educational, and engaging. Keep responses concise (2-3 paragraphs max).`;
  }

  async sendMessage(message: string): Promise<string> {
    const result = await this.chat.sendMessage(message);
    const response = result.response.text();

    this.history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: response }] }
    );

    return response;
  }

  getHistory(): ChatMessage[] {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}
```

**Features**:
- Context-aware responses (knows current scene)
- Vision analysis if image generated
- Suggested questions based on scene
- Conversation history (session-based)
- Quick action buttons
- Export conversation
- Feature discovery ("How do I use time-lapse mode?")

**Use Cases**:
1. **Historical Q&A**: "What was life like here in 1945?"
2. **Feature Help**: "How do I create a time-lapse?"
3. **Discovery**: "Show me other interesting moments nearby"
4. **Analysis**: "What do the hazard warnings mean?"
5. **Context**: "What happened before/after this event?"

**Cost**: Gemini 2.0 Flash is extremely cheap (~$0.0001 per message)

**Success Metrics**:
- Messages per session
- % of users who use chat
- Feature discovery through chat
- Engagement time

---

## Phase 3: Enhanced Discovery
**Timeline**: 2-3 days
**Goal**: Help users find interesting moments
**Priority**: 🟡 MEDIUM

### 3.1 Historical Event Integration
**Effort**: 2 days | **Value**: ⭐⭐⭐⭐

**Feature**: Real historical events from Wikipedia/Wikidata API

**UI**: Add section to Data Stream showing nearby events

**Implementation**: See full roadmap for details

---

### 3.2 Random Discovery Mode
**Effort**: 1 day | **Value**: ⭐⭐⭐

**Feature**: "Surprise Me" button with smart random generation

**Algorithm**: Weighted toward populated areas, significant years

---

## Phase 4: Advanced Features
**Timeline**: TBD
**Priority**: 🟢 LOW

### 4.1 Compare Mode (Split View)
**Effort**: 2-3 days | **Value**: ⭐⭐⭐⭐

**Feature**: Side-by-side comparison of same location, different times

---

### 4.2 Real Historical Data
**Effort**: Ongoing | **Value**: ⭐⭐⭐⭐

**Feature**: Replace simulated data with real historical records

---

## Success Metrics Dashboard

Track these KPIs:

**Engagement**:
- Sessions per user
- Average session duration
- Return visit rate
- Coordinates explored per session

**Feature Adoption**:
- URL shares created
- Journal entries saved
- Images downloaded
- Time-lapses generated
- Chat messages sent

**Technical**:
- API cost per user
- Image generation time p95
- Cache hit rate
- Error rate

**Business**:
- Daily active users
- Week 1 retention
- Viral coefficient (shared → new users)

---

## Risk Management

**Cost Risk**: Time-lapse could be expensive
**Mitigation**: Rate limiting, caching, freemium model

**Performance Risk**: Slow generation
**Mitigation**: Progress indicators, cancellation, preloading

**Quality Risk**: Historical accuracy
**Mitigation**: Clear disclaimers, community contributions, expert review

---

**End of Detailed Roadmap**
