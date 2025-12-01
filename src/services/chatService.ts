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

Available Waypoints (curated historical moments users can visit):
${waypointsContext}

Your role as the Temporal Assistant:
1. Answer questions about this specific moment in history with accuracy and insight
2. Provide historical context, interesting facts, and cultural details about the time period
3. Explain the scene data and what life was like at this location and time
4. Suggest related waypoints the user might enjoy - USE THE EXACT MARKDOWN LINK FORMAT from the waypoints list above
5. Guide users on how to use app features (waypoints, time-lapse, image generation)
6. Stay in character as a knowledgeable guide through spacetime

IMPORTANT - Clickable Links:
When suggesting waypoints, you MUST use the exact markdown link format provided above. For example:
- "You might enjoy visiting [Apollo 11 Landing](/?lat=0.6744&lng=23.4322&year=1969&month=7&day=20&hour=20&minute=17)"
- These links are clickable and will transport the user to that moment in history!

Guidelines:
- Be conversational, educational, and engaging
- Keep responses concise (2-3 paragraphs max unless the user asks for more detail)
- Use historical facts when possible, but note when information is simulated
- If unsure about historical details, say so rather than fabricating
- Match the tone to the era - be more formal for ancient times, casual for modern
- Proactively suggest 1-2 related waypoints when relevant, using the clickable link format`;
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
 * Suggested questions based on scene data
 */
export function getSuggestedQuestions(sceneData: SceneData): string[] {
  const { anthropology, safety, coordinates } = sceneData;
  const suggestions: string[] = [];

  // Era-specific questions
  suggestions.push(`What was daily life like during the ${anthropology.technologyLevel} era?`);

  // Location-specific
  if (anthropology.civilization !== 'Unknown') {
    suggestions.push(`Tell me about ${anthropology.civilization} civilization`);
  }

  // Event-specific
  if (anthropology.notableEvents.length > 0) {
    suggestions.push(`What happened at ${anthropology.notableEvents[0]}?`);
  }

  // Safety-related
  if (safety.hazardLevel === 'high' || safety.hazardLevel === 'critical') {
    suggestions.push('Why is this moment considered dangerous?');
  }

  // Time period suggestions
  const year = coordinates.temporal.year;
  if (year < 0) {
    suggestions.push('What technologies existed in this ancient period?');
  } else if (year < 1500) {
    suggestions.push('What were the major powers of this era?');
  } else if (year < 1900) {
    suggestions.push('What innovations changed life in this century?');
  } else {
    suggestions.push('How does this moment compare to today?');
  }

  // Navigation suggestions - encourage exploration of related historical moments
  suggestions.push('Take me to related moments in history I can explore');

  return suggestions.slice(0, 4); // Return max 4 suggestions
}
