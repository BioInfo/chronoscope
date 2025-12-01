import type { SceneData, SpacetimeCoordinates } from '../types';
import { getStoredApiKey } from './geminiService';
import { formatYear } from '../utils/validation';
import { CURATED_WAYPOINTS } from '../data/waypoints';
import { encodeCoordinates } from '../utils/urlManager';

// Gemini 2.0 Flash - Fast, cheap, multimodal chat model
const GEMINI_MODEL_ID = 'gemini-2.0-flash-exp';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

interface GeminiChatResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Generate a coordinate link for use in chat messages
 */
export function generateCoordinateLink(coords: SpacetimeCoordinates, label: string): string {
  const queryString = encodeCoordinates(coords);
  return `[${label}](/?${queryString})`;
}

/**
 * Get available waypoints formatted for the AI context
 */
function getWaypointsContext(): string {
  return CURATED_WAYPOINTS.map(wp => {
    const year = formatYear(wp.coordinates.temporal.year);
    const link = generateCoordinateLink(wp.coordinates, wp.name);
    return `- ${link}: ${wp.previewData.locationName}, ${year}`;
  }).join('\n');
}

/**
 * Build context prompt from scene data for the temporal assistant
 */
export function buildContextPrompt(sceneData: SceneData): string {
  const { coordinates, environment, anthropology, safety, locationName, description } = sceneData;
  const year = formatYear(coordinates.temporal.year);
  const waypointsContext = getWaypointsContext();

  return `You are a Temporal Assistant for The Chronoscope, a spacetime exploration app that allows users to "travel" through history.

Current Location: ${locationName}
Coordinates: ${coordinates.spatial.latitude.toFixed(4)}°N, ${coordinates.spatial.longitude.toFixed(4)}°E
Time: ${year}, ${coordinates.temporal.month}/${coordinates.temporal.day} at ${coordinates.temporal.hour.toString().padStart(2, '0')}:${coordinates.temporal.minute.toString().padStart(2, '0')}

Scene Description: ${description}

Environmental Data:
- Weather: ${environment.weather}
- Temperature: ${environment.temperature}°C
- Humidity: ${environment.humidity}%
- Visibility: ${environment.visibility}

Anthropological Data:
- Era: ${anthropology.technologyLevel}
- Civilization: ${anthropology.civilization}
- Population Density: ${anthropology.populationDensity.toLocaleString()}/km²
- Notable Events: ${anthropology.notableEvents.length > 0 ? anthropology.notableEvents.join(', ') : 'None recorded'}

Safety Information:
- Hazard Level: ${safety.hazardLevel.toUpperCase()}
- Hazard Type: ${safety.hazardType}
- Survival Probability: ${safety.survivalProbability}%
- Warnings: ${safety.warnings.length > 0 ? safety.warnings.join('; ') : 'None'}

Pre-configured Waypoints (curated historical moments):
${waypointsContext}

Your role as the Temporal Assistant:
1. Answer questions about this specific moment in history with accuracy and insight
2. Provide historical context, interesting facts, and cultural details about the time period
3. Explain the scene data and what life was like at this location and time
4. **GENERATE DYNAMIC WAYPOINTS** - Create clickable links to ANY historical moment using real coordinates
5. Guide users on how to use app features (waypoints, image generation)
6. Stay in character as a knowledgeable guide through spacetime

=== CRITICAL: GENERATING DYNAMIC WAYPOINT LINKS ===

You can create clickable links to ANY historical moment. The link format is:
[Human-Readable Name, Year](/?lat=LATITUDE&lng=LONGITUDE&year=YEAR&month=MONTH&day=DAY&hour=HOUR&minute=MINUTE)

LINK TEXT FORMAT - VERY IMPORTANT:
- NEVER show raw coordinates in the link text
- Use format: [Location/Event Name, Year] or [Event at Location, Year]
- Examples of GOOD link text:
  - [Constantinople, 1453]
  - [Runnymede, England, 1215]
  - [Boston Harbor, 1773]
  - [Rome, 44 BC]
  - [Athens, 438 BC]
  - [London, 1599]
  - [Berlin, 1905]
  - [Mainz, Germany, 1455]
  - [Beijing, 1275]
  - [Alexandria, 48 BC]

COORDINATE RULES:
- Use REAL geographic coordinates (you know these from training)
- For BC years, use negative numbers (year=-44 for 44 BC)
- Always include all 7 URL parameters: lat, lng, year, month, day, hour, minute
- Default to hour=12, minute=0 if exact time unknown

EXAMPLE WAYPOINTS WITH PROPER FORMAT:
- [Constantinople, 1453](/?lat=41.0082&lng=28.9784&year=1453&month=5&day=29&hour=12&minute=0) - Fall of the Byzantine Empire
- [Runnymede, England, 1215](/?lat=51.4314&lng=-0.5649&year=1215&month=6&day=15&hour=10&minute=0) - Magna Carta signing
- [Boston Harbor, 1773](/?lat=42.3520&lng=-71.0510&year=1773&month=12&day=16&hour=21&minute=0) - Tea Party protest
- [Rome, 44 BC](/?lat=41.8954&lng=12.4767&year=-44&month=3&day=15&hour=11&minute=0) - Caesar's assassination
- [Athens, 438 BC](/?lat=37.9715&lng=23.7267&year=-438&month=6&day=1&hour=12&minute=0) - Parthenon completion
- [London, 1599](/?lat=51.5081&lng=-0.0972&year=1599&month=9&day=21&hour=14&minute=0) - Globe Theatre opens
- [Berlin, 1905](/?lat=52.5200&lng=13.4050&year=1905&month=6&day=30&hour=10&minute=0) - Einstein's relativity
- [Mainz, Germany, 1455](/?lat=49.9929&lng=8.2473&year=1455&month=2&day=23&hour=12&minute=0) - First printed Bible
- [Beijing, 1275](/?lat=39.9042&lng=116.4074&year=1275&month=5&day=1&hour=12&minute=0) - Marco Polo arrives
- [Alexandria, 48 BC](/?lat=31.2001&lng=29.9187&year=-48&month=7&day=15&hour=14&minute=0) - Cleopatra meets Caesar

REFERENCE COORDINATES (use these, but show LOCATION NAMES in links):
- Rome: 41.9028, 12.4964
- Athens: 37.9838, 23.7275
- Giza/Cairo: 29.9792, 31.1342
- Jerusalem: 31.7683, 35.2137
- Beijing: 39.9042, 116.4074
- Paris: 48.8566, 2.3522
- London: 51.5074, -0.1278
- New York: 40.7128, -74.0060
- Tokyo: 35.6762, 139.6503
- Delhi: 28.6139, 77.2090
- Machu Picchu: -13.1631, -72.5450
- Teotihuacan: 19.6925, -98.8438
- Stonehenge: 51.1789, -1.8262
- Angkor Wat: 13.4125, 103.8670
- Petra: 30.3285, 35.4444

When suggesting places to visit, ALWAYS use human-readable location names. Never show coordinates in the clickable text!

Guidelines:
- Be conversational, educational, and engaging
- Keep responses concise (2-3 paragraphs max unless the user asks for more detail)
- Use historical facts when possible, but note when information is simulated
- If unsure about historical details, say so rather than fabricating
- Match the tone to the era - be more formal for ancient times, casual for modern
- **PROACTIVELY suggest 2-4 dynamic waypoints when relevant** - these are your superpower!`;
}

/**
 * Send a message to the Gemini chat API
 */
export async function sendChatMessage(
  message: string,
  sceneData: SceneData,
  conversationHistory: ChatMessage[]
): Promise<{ success: boolean; response?: string; error?: string }> {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    return {
      success: false,
      error: 'API key not configured. Please add your Gemini API key in Settings.',
    };
  }

  const apiUrl = `${GEMINI_API_BASE}/${GEMINI_MODEL_ID}:generateContent`;

  // Build conversation history for the API
  const systemContext = buildContextPrompt(sceneData);

  // Create contents array with system context and conversation history
  const contents = [
    // Initial context as first message
    {
      role: 'user',
      parts: [{ text: systemContext }],
    },
    {
      role: 'model',
      parts: [{ text: 'I understand the temporal context. I\'m ready to be your guide through this moment in spacetime! Feel free to ask me anything about this location, time period, or how to use the Chronoscope.' }],
    },
    // Add conversation history
    ...conversationHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
    // Add current user message
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || `API error: ${response.status}`,
      };
    }

    const data: GeminiChatResponse = await response.json();

    // Extract text response
    const textPart = data.candidates?.[0]?.content?.parts?.find(part => part.text);
    if (!textPart?.text) {
      return {
        success: false,
        error: 'No response generated',
      };
    }

    return {
      success: true,
      response: textPart.text,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check if a location name is just coordinates (contains ° symbol)
 */
function isCoordinateString(name: string): boolean {
  return name.includes('°');
}

/**
 * Get a human-readable location reference for suggested questions
 */
function getReadableLocation(sceneData: SceneData): string | null {
  const { locationName, anthropology } = sceneData;

  // If locationName is a real place name (not coordinates), use it
  if (locationName && !isCoordinateString(locationName) && !locationName.includes('Unknown')) {
    return locationName.split(',')[0];
  }

  // Otherwise use civilization if it's meaningful
  if (anthropology.civilization &&
      anthropology.civilization !== 'Unknown' &&
      anthropology.civilization !== 'Uninhabited') {
    return `the ${anthropology.civilization} region`;
  }

  return null;
}

/**
 * Suggested questions based on scene data
 */
export function getSuggestedQuestions(sceneData: SceneData): string[] {
  const { anthropology, safety, coordinates } = sceneData;
  const suggestions: string[] = [];

  // Always prioritize dynamic waypoint discovery
  suggestions.push('Show me 5 amazing moments in history I can visit');

  // Era-specific questions
  if (anthropology.technologyLevel !== 'Digital' && anthropology.technologyLevel !== 'Space Age') {
    suggestions.push(`What was daily life like during the ${anthropology.technologyLevel} era?`);
  }

  // Location-specific exploration - only if we have a readable location
  const readableLocation = getReadableLocation(sceneData);
  if (readableLocation) {
    suggestions.push(`What other historical events happened near ${readableLocation}?`);
  }

  // Event-specific
  if (anthropology.notableEvents.length > 0) {
    suggestions.push(`Tell me about ${anthropology.notableEvents[0]} and link me to related events`);
  }

  // Safety-related
  if (safety.hazardLevel === 'high' || safety.hazardLevel === 'critical') {
    suggestions.push('Why is this dangerous? Show me safer alternatives');
  }

  // Time period exploration with waypoints
  const year = coordinates.temporal.year;
  if (year < 0) {
    suggestions.push('Take me to the greatest ancient wonders');
  } else if (year < 1500) {
    suggestions.push('Show me pivotal medieval moments to explore');
  } else if (year < 1900) {
    suggestions.push('Link me to the key events that shaped the modern world');
  } else {
    suggestions.push('Take me to the most iconic moments of the 20th century');
  }

  // Category exploration
  suggestions.push('Surprise me with obscure but fascinating historical moments');

  return suggestions.slice(0, 4); // Return max 4 suggestions
}
