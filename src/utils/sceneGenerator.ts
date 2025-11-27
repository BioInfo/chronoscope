import type {
  SpacetimeCoordinates,
  SceneData,
  EnvironmentalData,
  AnthropologicalData,
  SafetyMetrics,
  HazardLevel,
  TechnologyEra,
  WeatherCondition,
} from '../types';

/**
 * Determine technology era based on year
 */
const getTechnologyEra = (year: number): TechnologyEra => {
  if (year < -3000) return 'Stone Age';
  if (year < -1200) return 'Bronze Age';
  if (year < 500) return 'Iron Age';
  if (year < 476) return 'Classical';
  if (year < 1400) return 'Medieval';
  if (year < 1760) return 'Renaissance';
  if (year < 1870) return 'Industrial';
  if (year < 1945) return 'Electric';
  if (year < 1970) return 'Atomic';
  if (year < 2000) return 'Digital';
  return 'Space Age';
};

/**
 * Estimate population density based on year and location
 */
const estimatePopulationDensity = (year: number, lat: number, lng: number): number => {
  // Base population that increases over time
  let basePop = 1;

  if (year < -5000) basePop = 0.1;
  else if (year < 0) basePop = 2;
  else if (year < 500) basePop = 10;
  else if (year < 1500) basePop = 20;
  else if (year < 1800) basePop = 50;
  else if (year < 1900) basePop = 100;
  else if (year < 1950) basePop = 200;
  else if (year < 2000) basePop = 400;
  else basePop = 500;

  // Adjust for latitude (more population in temperate zones)
  const latModifier = Math.max(0.1, 1 - Math.abs(lat) / 90);

  // Longitude affects population based on continental positioning
  // Areas near major landmasses (continents) tend to have higher population
  const lngModifier = Math.abs(lng) < 150 ? 1.2 : 0.8;

  // Coastal regions tend to have higher population
  const coastalModifier = 1 + Math.random() * 0.5;

  return Math.round(basePop * latModifier * lngModifier * coastalModifier);
};

/**
 * Generate weather based on location, season, and time
 */
const generateWeather = (
  lat: number,
  month: number,
  hour: number
): { weather: WeatherCondition; temperature: number; humidity: number } => {
  // Determine hemisphere and season
  const isNorthernHemisphere = lat >= 0;
  const isSummer = isNorthernHemisphere
    ? (month >= 5 && month <= 8)
    : (month >= 11 || month <= 2);
  const isWinter = !isSummer && (
    isNorthernHemisphere
      ? (month >= 11 || month <= 2)
      : (month >= 5 && month <= 8)
  );

  // Base temperature on latitude and season
  let baseTemp = 25 - Math.abs(lat) * 0.5;
  if (isSummer) baseTemp += 10;
  if (isWinter) baseTemp -= 15;

  // Day/night variation
  const isDaytime = hour >= 6 && hour <= 18;
  if (!isDaytime) baseTemp -= 8;

  // Add some randomness
  const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 10);

  // Weather conditions based on various factors
  const weatherRoll = Math.random();
  let weather: WeatherCondition;
  let humidity: number;

  if (weatherRoll < 0.4) {
    weather = 'Clear';
    humidity = 30 + Math.random() * 30;
  } else if (weatherRoll < 0.6) {
    weather = 'Cloudy';
    humidity = 50 + Math.random() * 30;
  } else if (weatherRoll < 0.75) {
    weather = 'Rainy';
    humidity = 70 + Math.random() * 25;
  } else if (weatherRoll < 0.85) {
    weather = 'Windy';
    humidity = 40 + Math.random() * 30;
  } else if (temperature < 0) {
    weather = 'Snowy';
    humidity = 60 + Math.random() * 30;
  } else if (weatherRoll < 0.95) {
    weather = 'Foggy';
    humidity = 80 + Math.random() * 15;
  } else {
    weather = 'Stormy';
    humidity = 85 + Math.random() * 15;
  }

  return { weather, temperature, humidity: Math.round(humidity) };
};

/**
 * Generate a civilization name based on location and year
 */
const getCivilization = (lat: number, lng: number, year: number): string => {
  // This is a simplified model - in production, this would query a historical database

  // Europe
  if (lat >= 35 && lat <= 70 && lng >= -10 && lng <= 40) {
    if (year < -500) return 'Celtic Tribes';
    if (year < 476) return 'Roman Empire';
    if (year < 800) return 'Germanic Kingdoms';
    if (year < 1453) return 'Medieval Christendom';
    if (year < 1800) return 'European Powers';
    return 'European Union Area';
  }

  // Middle East
  if (lat >= 15 && lat <= 40 && lng >= 25 && lng <= 60) {
    if (year < -2000) return 'Mesopotamian Civilizations';
    if (year < -500) return 'Persian Empire';
    if (year < 650) return 'Byzantine/Sassanid Empires';
    if (year < 1300) return 'Islamic Caliphates';
    if (year < 1918) return 'Ottoman Empire';
    return 'Modern Middle East';
  }

  // East Asia
  if (lat >= 20 && lat <= 50 && lng >= 100 && lng <= 145) {
    if (year < -200) return 'Warring States Period';
    if (year < 220) return 'Han Dynasty';
    if (year < 1644) return 'Imperial China';
    if (year < 1912) return 'Qing Dynasty';
    return 'Modern East Asia';
  }

  // Americas
  if (lng >= -170 && lng <= -30) {
    if (year < 1492) return 'Pre-Columbian Civilizations';
    if (year < 1776) return 'Colonial Americas';
    if (year < 1900) return 'New World Republics';
    return 'The Americas';
  }

  // Default
  if (year < 0) return 'Ancient Peoples';
  if (year < 500) return 'Classical Era Civilization';
  if (year < 1500) return 'Medieval Society';
  return 'Modern Civilization';
};

/**
 * Calculate hazard level based on random factors (simulated)
 */
const calculateHazard = (year: number): SafetyMetrics => {
  // Most times and places are relatively safe
  const hazardRoll = Math.random();

  let hazardLevel: HazardLevel;
  let hazardType: string;
  let survivalProbability: number;
  let warnings: string[] = [];

  if (hazardRoll > 0.9) {
    hazardLevel = 'critical';
    hazardType = 'Major Historical Event';
    survivalProbability = 50 + Math.random() * 30;
    warnings = ['SIGNIFICANT HISTORICAL EVENT', 'EXERCISE CAUTION', 'TEMPORAL INSTABILITY DETECTED'];
  } else if (hazardRoll > 0.75) {
    hazardLevel = 'high';
    hazardType = 'Regional Conflict';
    survivalProbability = 70 + Math.random() * 20;
    warnings = ['CONFLICT ZONE', 'LIMITED INFRASTRUCTURE'];
  } else if (hazardRoll > 0.5) {
    hazardLevel = 'medium';
    hazardType = 'Historical Uncertainty';
    survivalProbability = 85 + Math.random() * 10;
    warnings = ['LIMITED RECORDS AVAILABLE', 'PROCEED WITH CAUTION'];
  } else {
    hazardLevel = 'low';
    hazardType = 'Stable Conditions';
    survivalProbability = 95 + Math.random() * 5;
    warnings = ['CONDITIONS NOMINAL'];
  }

  // Ancient times are generally more hazardous
  if (year < 0) {
    survivalProbability = Math.max(30, survivalProbability - 20);
    warnings.push('ANCIENT ERA - LIMITED MEDICAL CARE');
  }

  return {
    hazardLevel,
    hazardType,
    survivalProbability: Math.round(survivalProbability),
    warnings,
  };
};

/**
 * Get location name from coordinates (simplified)
 */
const getLocationName = (lat: number, lng: number): string => {
  // This would normally use reverse geocoding
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
};

/**
 * Generate a complete scene from coordinates
 */
export const generateScene = (coordinates: SpacetimeCoordinates): SceneData => {
  const { spatial, temporal } = coordinates;
  const { latitude, longitude } = spatial;
  const { year, month, hour } = temporal;

  // Generate environmental data
  const weatherData = generateWeather(latitude, month, hour);
  const environment: EnvironmentalData = {
    weather: weatherData.weather,
    temperature: weatherData.temperature,
    humidity: weatherData.humidity,
    visibility: weatherData.weather === 'Foggy' ? 'Poor' :
                weatherData.weather === 'Stormy' ? 'Reduced' : 'Clear',
  };

  // Generate anthropological data
  const anthropology: AnthropologicalData = {
    populationDensity: estimatePopulationDensity(year, latitude, longitude),
    technologyLevel: getTechnologyEra(year),
    civilization: getCivilization(latitude, longitude, year),
    notableEvents: [], // Would be populated from a historical events database
  };

  // Generate safety metrics
  const safety = calculateHazard(year);

  // Generate description
  const description = `Rendering spacetime coordinates for ${getLocationName(latitude, longitude)} ` +
    `during the ${anthropology.technologyLevel} era. ` +
    `Local conditions: ${environment.weather.toLowerCase()}, ${environment.temperature}°C.`;

  return {
    coordinates,
    environment,
    anthropology,
    safety,
    locationName: getLocationName(latitude, longitude),
    description,
  };
};

/**
 * Simulate a render delay with progress updates
 */
export const simulateRender = (
  onProgress: (progress: number) => void,
  onComplete: () => void
): void => {
  let progress = 0;
  const steps = [
    { target: 15, label: 'Calibrating temporal sensors...' },
    { target: 35, label: 'Locking spatial coordinates...' },
    { target: 55, label: 'Synchronizing timeline...' },
    { target: 75, label: 'Rendering atmospheric data...' },
    { target: 90, label: 'Finalizing scene...' },
    { target: 100, label: 'Complete' },
  ];

  let stepIndex = 0;

  const interval = setInterval(() => {
    if (stepIndex >= steps.length) {
      clearInterval(interval);
      onComplete();
      return;
    }

    const currentStep = steps[stepIndex];
    progress = Math.min(progress + 2 + Math.random() * 3, currentStep.target);
    onProgress(Math.round(progress));

    if (progress >= currentStep.target) {
      stepIndex++;
    }
  }, 50);
};
