import type { SpacetimeCoordinates, SceneData } from '../types';
import { formatYear } from '../utils/validation';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Generate a detailed prompt for historical image generation
 */
export function generateHistoricalPrompt(
  coordinates: SpacetimeCoordinates,
  sceneData: SceneData
): string {
  const { spatial, temporal } = coordinates;
  const { environment, anthropology, safety } = sceneData;

  const year = formatYear(temporal.year);
  const timeOfDay = getTimeOfDayDescription(temporal.hour);
  const season = getSeasonDescription(temporal.month, spatial.latitude >= 0);

  // Build a rich, historically accurate prompt
  const promptParts: string[] = [
    `Photorealistic historical scene from ${year}.`,
    `Location: ${sceneData.locationName}.`,
    `Time: ${timeOfDay} during ${season}.`,
    `Weather conditions: ${environment.weather.toLowerCase()}, ${environment.temperature}°C.`,
    `Era: ${anthropology.technologyLevel} period.`,
    `Civilization: ${anthropology.civilization}.`,
  ];

  // Add era-specific details
  const eraDetails = getEraSpecificDetails(anthropology.technologyLevel, temporal.year);
  if (eraDetails) {
    promptParts.push(eraDetails);
  }

  // Add weather-specific atmosphere
  const weatherAtmosphere = getWeatherAtmosphere(environment.weather);
  if (weatherAtmosphere) {
    promptParts.push(weatherAtmosphere);
  }

  // Add hazard-specific elements if relevant
  if (safety.hazardLevel === 'critical' || safety.hazardLevel === 'high') {
    promptParts.push(`Atmosphere: tense, dramatic, ${safety.hazardType.toLowerCase()}.`);
  }

  // Add notable event context if available
  if (anthropology.notableEvents.length > 0) {
    promptParts.push(`Historical context: ${anthropology.notableEvents.join(', ')}.`);
  }

  // Style instructions
  promptParts.push(
    'Style: cinematic, historically accurate, detailed, atmospheric lighting.',
    'Perspective: ground-level first-person view as if standing there.',
    'Do not include any text, watermarks, or modern elements.',
    'Focus on architectural accuracy, period-appropriate clothing, and environmental details.'
  );

  return promptParts.join(' ');
}

/**
 * Get time of day description from hour
 */
function getTimeOfDayDescription(hour: number): string {
  if (hour >= 5 && hour < 7) return 'dawn, early morning golden hour';
  if (hour >= 7 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 12) return 'late morning';
  if (hour >= 12 && hour < 14) return 'midday, sun at zenith';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'dusk, golden hour';
  if (hour >= 20 && hour < 22) return 'evening twilight';
  return 'night, under stars or moonlight';
}

/**
 * Get season description
 */
function getSeasonDescription(month: number, isNorthernHemisphere: boolean): string {
  const seasons = isNorthernHemisphere
    ? { spring: [3, 4, 5], summer: [6, 7, 8], autumn: [9, 10, 11], winter: [12, 1, 2] }
    : { autumn: [3, 4, 5], winter: [6, 7, 8], spring: [9, 10, 11], summer: [12, 1, 2] };

  if (seasons.spring.includes(month)) return 'spring';
  if (seasons.summer.includes(month)) return 'summer';
  if (seasons.autumn.includes(month)) return 'autumn';
  return 'winter';
}

/**
 * Get era-specific visual details
 */
function getEraSpecificDetails(era: string, _year?: number): string | null {
  const details: Record<string, string> = {
    'Stone Age': 'Primitive shelters, animal skins, stone tools, cave paintings, hunter-gatherer camp.',
    'Bronze Age': 'Early bronze weapons and tools, simple mud-brick structures, early agriculture.',
    'Iron Age': 'Iron tools and weapons, hill forts, Celtic/tribal settlements.',
    'Classical': 'Roman/Greek architecture, marble columns, togas, amphitheaters, aqueducts.',
    'Medieval': 'Stone castles, timber-frame buildings, knights, peasants, cathedral spires.',
    'Renaissance': 'Ornate architecture, cobblestone streets, period clothing, early printing.',
    'Industrial': 'Brick factories, steam engines, coal smoke, gaslight, Victorian clothing.',
    'Electric': 'Early automobiles, electric lights, art deco architecture, telephone poles.',
    'Atomic': 'Mid-century modern architecture, vintage cars, neon signs, suburban homes.',
    'Digital': 'Modern architecture, personal electronics, contemporary clothing.',
    'Space Age': 'Futuristic elements, space technology, advanced infrastructure.',
    'Vacuum': 'Lunar or space environment, no atmosphere, stark shadows, Earth in sky.',
  };

  return details[era] || null;
}

/**
 * Get weather-specific atmosphere details
 */
function getWeatherAtmosphere(weather: string): string | null {
  const atmospheres: Record<string, string> = {
    'Clear': 'Crystal clear sky, sharp shadows, vibrant colors.',
    'Cloudy': 'Overcast sky, diffused light, muted tones.',
    'Rainy': 'Rain falling, wet surfaces reflecting light, people with umbrellas.',
    'Stormy': 'Dark threatening clouds, lightning in distance, dramatic atmosphere.',
    'Snowy': 'Snow covering everything, muted sounds, cold blue tones.',
    'Foggy': 'Thick fog obscuring distance, mysterious atmosphere, muted visibility.',
    'Windy': 'Trees bending, clothes and flags flapping, dust in air.',
    'Volcanic Ash': 'Ash falling like snow, orange-tinted sky, apocalyptic atmosphere.',
    'Nuclear Fallout': 'Dust-filled air, destroyed structures, eerie silence.',
    'Vacuum': 'No atmosphere, stark contrast between light and shadow, lunar surface.',
  };

  return atmospheres[weather] || null;
}

/**
 * Call Gemini API to generate an image
 */
export async function generateHistoricalImage(
  coordinates: SpacetimeCoordinates,
  sceneData: SceneData
): Promise<{ success: boolean; imageData?: string; error?: string }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.',
    };
  }

  const prompt = generateHistoricalPrompt(coordinates, sceneData);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || `API error: ${response.status}`,
      };
    }

    const data: GeminiResponse = await response.json();

    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) {
      return {
        success: false,
        error: 'No content in API response',
      };
    }

    // Find the image part
    const imagePart = parts.find((part) => part.inlineData);
    if (!imagePart?.inlineData) {
      return {
        success: false,
        error: 'No image generated in response',
      };
    }

    // Return base64 image data
    return {
      success: true,
      imageData: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.length > 0);
}
