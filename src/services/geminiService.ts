import type { SpacetimeCoordinates, SceneData } from '../types';
import { formatYear } from '../utils/validation';

// Gemini 3 Pro Image (Nano Banana Pro) - Google's state-of-the-art image generation model
const GEMINI_MODEL_ID = 'gemini-3-pro-image-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// LocalStorage key for API key
const API_KEY_STORAGE_KEY = 'chronoscope_gemini_api_key';

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
 * Get the stored API key from localStorage
 */
export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Save the API key to localStorage
 */
export function saveApiKey(apiKey: string): void {
  try {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save API key:', e);
  }
}

/**
 * Remove the API key from localStorage
 */
export function clearApiKey(): void {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear API key:', e);
  }
}

/**
 * Check if Gemini API is configured (has stored API key)
 */
export function isGeminiConfigured(): boolean {
  const apiKey = getStoredApiKey();
  return Boolean(apiKey && apiKey.length > 0);
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

  // Build a rich, historically accurate prompt optimized for Gemini 3 Pro Image
  const promptParts: string[] = [
    `Generate a photorealistic historical scene from ${year}.`,
    `Location: ${sceneData.locationName}.`,
    `Time of day: ${timeOfDay} during ${season}.`,
    `Weather: ${environment.weather.toLowerCase()}, temperature ${environment.temperature}°C.`,
    `Historical era: ${anthropology.technologyLevel} period.`,
    `Civilization: ${anthropology.civilization}.`,
  ];

  // Add era-specific details
  const eraDetails = getEraSpecificDetails(anthropology.technologyLevel);
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
    promptParts.push(`Atmosphere: tense, dramatic, depicting ${safety.hazardType.toLowerCase()}.`);
  }

  // Add notable event context if available
  if (anthropology.notableEvents.length > 0) {
    promptParts.push(`Historical context: ${anthropology.notableEvents.join(', ')}.`);
  }

  // Style instructions optimized for Gemini 3 Pro Image's capabilities
  promptParts.push(
    'Style: cinematic quality, historically accurate, highly detailed, atmospheric lighting.',
    'Perspective: ground-level first-person view as if the viewer is standing there witnessing the moment.',
    'Requirements: No text overlays, no watermarks, no anachronistic modern elements.',
    'Focus on: architectural accuracy for the period, period-appropriate clothing and hairstyles, authentic environmental details, correct lighting for the time of day.'
  );

  return promptParts.join(' ');
}

/**
 * Get time of day description from hour
 */
function getTimeOfDayDescription(hour: number): string {
  if (hour >= 5 && hour < 7) return 'dawn, early morning golden hour with soft warm light';
  if (hour >= 7 && hour < 10) return 'morning with clear directional sunlight';
  if (hour >= 10 && hour < 12) return 'late morning with bright overhead light';
  if (hour >= 12 && hour < 14) return 'midday with sun at zenith, harsh shadows';
  if (hour >= 14 && hour < 17) return 'afternoon with warm angled sunlight';
  if (hour >= 17 && hour < 20) return 'dusk, golden hour with dramatic orange and pink lighting';
  if (hour >= 20 && hour < 22) return 'evening twilight with deep blue ambient light';
  return 'night scene, illuminated by moonlight and period-appropriate artificial lighting';
}

/**
 * Get season description
 */
function getSeasonDescription(month: number, isNorthernHemisphere: boolean): string {
  const seasons = isNorthernHemisphere
    ? { spring: [3, 4, 5], summer: [6, 7, 8], autumn: [9, 10, 11], winter: [12, 1, 2] }
    : { autumn: [3, 4, 5], winter: [6, 7, 8], spring: [9, 10, 11], summer: [12, 1, 2] };

  if (seasons.spring.includes(month)) return 'spring with fresh green foliage and blooming flowers';
  if (seasons.summer.includes(month)) return 'summer with lush vegetation and warm atmosphere';
  if (seasons.autumn.includes(month)) return 'autumn with golden and red foliage';
  return 'winter with bare trees and cold atmosphere';
}

/**
 * Get era-specific visual details
 */
function getEraSpecificDetails(era: string): string | null {
  const details: Record<string, string> = {
    'Stone Age': 'Visual elements: primitive shelters made of branches and animal hides, people wearing animal skins, stone tools, cave paintings visible, hunter-gatherer encampment.',
    'Bronze Age': 'Visual elements: early bronze weapons and tools, simple mud-brick or wattle-and-daub structures, evidence of early agriculture, basic pottery.',
    'Iron Age': 'Visual elements: iron tools and weapons, hill forts with wooden palisades, Celtic/tribal settlements, round houses with thatched roofs.',
    'Classical': 'Visual elements: Roman or Greek architecture with marble columns and pediments, people in togas and tunics, amphitheaters, aqueducts, paved roads.',
    'Medieval': 'Visual elements: stone castles and fortifications, timber-frame buildings, knights in armor, peasants in simple clothing, Gothic cathedral spires.',
    'Renaissance': 'Visual elements: ornate Italian architecture, cobblestone streets, elaborate period clothing with ruffs and doublets, early printing press era aesthetics.',
    'Industrial': 'Visual elements: red brick factories with smokestacks, steam engines and machinery, coal smoke in air, gaslight illumination, Victorian-era clothing.',
    'Electric': 'Visual elements: early automobiles (Model T era), electric street lights, art deco architectural elements, telephone poles with wires, 1920s-1930s fashion.',
    'Atomic': 'Visual elements: mid-century modern architecture, vintage 1950s cars with chrome details, neon signs, suburban homes, optimistic post-war aesthetic.',
    'Digital': 'Visual elements: modern glass and steel architecture, contemporary urban landscape, current fashion and technology visible.',
    'Space Age': 'Visual elements: futuristic architecture, advanced technology, space-age aesthetic with clean lines and innovative materials.',
    'Vacuum': 'Visual elements: lunar or space environment, no atmosphere, stark contrast between illuminated and shadowed areas, Earth visible in the black sky, space suits if humans present.',
  };

  return details[era] || null;
}

/**
 * Get weather-specific atmosphere details
 */
function getWeatherAtmosphere(weather: string): string | null {
  const atmospheres: Record<string, string> = {
    'Clear': 'Atmosphere: crystal clear sky, sharp defined shadows, vibrant saturated colors, excellent visibility to horizon.',
    'Cloudy': 'Atmosphere: overcast grey sky, soft diffused lighting with no harsh shadows, slightly muted color tones.',
    'Rainy': 'Atmosphere: rain visibly falling, wet reflective surfaces on ground and buildings, people with umbrellas or seeking shelter, grey muted lighting.',
    'Stormy': 'Atmosphere: dark threatening storm clouds, possible lightning in distance, dramatic chiaroscuro lighting, wind effects visible.',
    'Snowy': 'Atmosphere: snow covering all surfaces, pristine white landscape, muted sounds suggested by stillness, cold blue color cast.',
    'Foggy': 'Atmosphere: thick fog obscuring distant objects, mysterious ethereal quality, objects fade into white at distance, muted visibility.',
    'Windy': 'Atmosphere: trees bending in wind, clothes and flags flapping, dust or leaves in air, dynamic movement throughout scene.',
    'Volcanic Ash': 'Atmosphere: ash falling like grey snow, orange-tinted apocalyptic sky, reduced visibility, sense of impending doom.',
    'Nuclear Fallout': 'Atmosphere: dust and debris in air, damaged or destroyed structures, eerie silence and desolation, sickly yellow-grey lighting.',
    'Vacuum': 'Atmosphere: complete absence of atmosphere, stark unfiltered sunlight, pure black sky, extreme contrast between light and shadow.',
  };

  return atmospheres[weather] || null;
}

/**
 * Call Gemini 3 Pro Image API to generate a historical image
 */
export async function generateHistoricalImage(
  coordinates: SpacetimeCoordinates,
  sceneData: SceneData
): Promise<{ success: boolean; imageData?: string; error?: string }> {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    return {
      success: false,
      error: 'Gemini API key not configured. Please add your API key in Settings.',
    };
  }

  const prompt = generateHistoricalPrompt(coordinates, sceneData);
  const apiUrl = `${GEMINI_API_BASE}/${GEMINI_MODEL_ID}:generateContent`;

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
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
          responseModalities: ['IMAGE'],
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
