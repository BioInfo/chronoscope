import type { Waypoint } from '../types';

export const CURATED_WAYPOINTS: Waypoint[] = [
  {
    id: 'apollo-11-1969',
    name: 'Apollo 11 Landing',
    icon: 'Rocket',
    category: 'achievement',
    coordinates: {
      spatial: {
        latitude: 0.6744,
        longitude: 23.4322,
      },
      temporal: {
        year: 1969,
        month: 7,
        day: 20,
        hour: 20,
        minute: 17,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 0.6744, longitude: 23.4322 },
        temporal: { year: 1969, month: 7, day: 20, hour: 20, minute: 17 },
      },
      locationName: 'Sea of Tranquility, The Moon',
      description: 'The moment humanity first set foot on another celestial body. Eagle has landed.',
      environment: {
        weather: 'Vacuum',
        temperature: 127,
        humidity: 0,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 0,
        technologyLevel: 'Space Age',
        civilization: 'NASA Apollo Program',
        notableEvents: ['First Moon Landing', 'Armstrong and Aldrin EVA', 'Giant Leap for Mankind'],
      },
      safety: {
        hazardLevel: 'high',
        hazardType: 'Vacuum Environment',
        survivalProbability: 0,
        warnings: [
          'NO ATMOSPHERE',
          'EXTREME TEMPERATURE VARIANCE',
          'RADIATION EXPOSURE',
          'REQUIRES LIFE SUPPORT',
        ],
      },
    },
  },
  {
    id: 'kitty-hawk-1903',
    name: 'First Flight',
    icon: 'Plane',
    category: 'achievement',
    coordinates: {
      spatial: {
        latitude: 36.0176,
        longitude: -75.6716,
      },
      temporal: {
        year: 1903,
        month: 12,
        day: 17,
        hour: 10,
        minute: 35,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 36.0176, longitude: -75.6716 },
        temporal: { year: 1903, month: 12, day: 17, hour: 10, minute: 35 },
      },
      locationName: 'Kitty Hawk, North Carolina, USA',
      description: 'The Wright Brothers achieve the first sustained powered flight in human history. 12 seconds that changed the world.',
      environment: {
        weather: 'Windy',
        temperature: 4,
        humidity: 65,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 15,
        technologyLevel: 'Industrial',
        civilization: 'United States of America',
        notableEvents: ['First Powered Flight', 'Wright Flyer I', 'Birth of Aviation'],
      },
      safety: {
        hazardLevel: 'low',
        hazardType: 'Cold Weather',
        survivalProbability: 95,
        warnings: [
          'WIND SPEED: 27 MPH',
          'COLD CONDITIONS',
          'REMOTE LOCATION',
        ],
      },
    },
  },
  {
    id: 'berlin-wall-1989',
    name: 'Berlin Wall Falls',
    icon: 'Building',
    category: 'achievement',
    coordinates: {
      spatial: {
        latitude: 52.5163,
        longitude: 13.3777,
      },
      temporal: {
        year: 1989,
        month: 11,
        day: 9,
        hour: 22,
        minute: 0,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 52.5163, longitude: 13.3777 },
        temporal: { year: 1989, month: 11, day: 9, hour: 22, minute: 0 },
      },
      locationName: 'Brandenburg Gate, Berlin, Germany',
      description: 'The Berlin Wall falls as East Germans flood through checkpoints. The Cold War is ending.',
      environment: {
        weather: 'Cloudy',
        temperature: 8,
        humidity: 75,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 50000,
        technologyLevel: 'Digital',
        civilization: 'East/West Germany',
        notableEvents: ['Fall of Berlin Wall', 'End of Cold War', 'German Reunification'],
      },
      safety: {
        hazardLevel: 'medium',
        hazardType: 'Crowd Density',
        survivalProbability: 98,
        warnings: [
          'LARGE CROWD GATHERING',
          'POLITICAL INSTABILITY',
          'HISTORIC MOMENT IN PROGRESS',
        ],
      },
    },
  },
  {
    id: 'woodstock-1969',
    name: 'Woodstock Festival',
    icon: 'Music',
    category: 'culture',
    coordinates: {
      spatial: {
        latitude: 41.7033,
        longitude: -74.8766,
      },
      temporal: {
        year: 1969,
        month: 8,
        day: 16,
        hour: 17,
        minute: 0,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 41.7033, longitude: -74.8766 },
        temporal: { year: 1969, month: 8, day: 16, hour: 17, minute: 0 },
      },
      locationName: 'Bethel, New York, USA',
      description: 'Three days of peace and music. 400,000 people gather for the defining moment of the counterculture movement.',
      environment: {
        weather: 'Cloudy',
        temperature: 24,
        humidity: 70,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 400000,
        technologyLevel: 'Electric',
        civilization: 'United States of America',
        notableEvents: ['Woodstock Music Festival', 'Counterculture Movement', 'Summer of 69'],
      },
      safety: {
        hazardLevel: 'low',
        hazardType: 'Crowd Event',
        survivalProbability: 99,
        warnings: [
          'LARGE GATHERING',
          'LIMITED FACILITIES',
          'PEACEFUL ATMOSPHERE',
        ],
      },
    },
  },
  {
    id: 'declaration-1776',
    name: 'Independence Day',
    icon: 'Scroll',
    category: 'achievement',
    coordinates: {
      spatial: {
        latitude: 39.9489,
        longitude: -75.1500,
      },
      temporal: {
        year: 1776,
        month: 7,
        day: 4,
        hour: 14,
        minute: 0,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 39.9489, longitude: -75.1500 },
        temporal: { year: 1776, month: 7, day: 4, hour: 14, minute: 0 },
      },
      locationName: 'Independence Hall, Philadelphia, USA',
      description: 'The Continental Congress adopts the Declaration of Independence. A new nation is born, founded on revolutionary ideals of liberty.',
      environment: {
        weather: 'Hot',
        temperature: 32,
        humidity: 70,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 2500,
        technologyLevel: 'Renaissance',
        civilization: 'British Colonies / United States',
        notableEvents: ['Declaration of Independence', 'Birth of American Democracy', 'Revolutionary War'],
      },
      safety: {
        hazardLevel: 'medium',
        hazardType: 'Political Upheaval',
        survivalProbability: 92,
        warnings: [
          'REVOLUTIONARY WAR ONGOING',
          'BRITISH FORCES NEARBY',
          'HISTORIC MOMENT',
        ],
      },
    },
  },
  {
    id: 'great-pyramid-2560bce',
    name: 'Great Pyramid',
    icon: 'Pyramid',
    category: 'achievement',
    coordinates: {
      spatial: {
        latitude: 29.9792,
        longitude: 31.1342,
      },
      temporal: {
        year: -2560,
        month: 6,
        day: 21,
        hour: 12,
        minute: 0,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 29.9792, longitude: 31.1342 },
        temporal: { year: -2560, month: 6, day: 21, hour: 12, minute: 0 },
      },
      locationName: 'Giza Plateau, Ancient Egypt',
      description: 'The Great Pyramid of Giza nears completion. 100,000 workers have labored for 20 years to build humanity\'s greatest monument.',
      environment: {
        weather: 'Hot',
        temperature: 38,
        humidity: 25,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 5000,
        technologyLevel: 'Bronze Age',
        civilization: 'Ancient Egypt - Old Kingdom',
        notableEvents: ['Great Pyramid Construction', 'Reign of Pharaoh Khufu', 'Golden Age of Pyramids'],
      },
      safety: {
        hazardLevel: 'medium',
        hazardType: 'Construction Site',
        survivalProbability: 85,
        warnings: [
          'EXTREME HEAT',
          'HEAVY CONSTRUCTION',
          'DEHYDRATION RISK',
          'ANCIENT MEDICINE ONLY',
        ],
      },
    },
  },
  {
    id: 'mlk-dream-1963',
    name: 'I Have a Dream',
    icon: 'Megaphone',
    category: 'achievement',
    coordinates: {
      spatial: {
        latitude: 38.8893,
        longitude: -77.0502,
      },
      temporal: {
        year: 1963,
        month: 8,
        day: 28,
        hour: 15,
        minute: 0,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 38.8893, longitude: -77.0502 },
        temporal: { year: 1963, month: 8, day: 28, hour: 15, minute: 0 },
      },
      locationName: 'Lincoln Memorial, Washington D.C., USA',
      description: 'Dr. Martin Luther King Jr. delivers his iconic "I Have a Dream" speech to 250,000 people at the March on Washington.',
      environment: {
        weather: 'Hot',
        temperature: 28,
        humidity: 60,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 250000,
        technologyLevel: 'Atomic',
        civilization: 'United States of America',
        notableEvents: ['March on Washington', 'I Have a Dream Speech', 'Civil Rights Movement'],
      },
      safety: {
        hazardLevel: 'low',
        hazardType: 'Large Gathering',
        survivalProbability: 99,
        warnings: [
          'MASSIVE PEACEFUL CROWD',
          'HOT CONDITIONS',
          'HISTORIC MOMENT',
        ],
      },
    },
  },
  {
    id: 'magellan-1522',
    name: 'Earth Circled',
    icon: 'Compass',
    category: 'achievement',
    coordinates: {
      spatial: {
        latitude: 36.5298,
        longitude: -6.2927,
      },
      temporal: {
        year: 1522,
        month: 9,
        day: 6,
        hour: 10,
        minute: 0,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 36.5298, longitude: -6.2927 },
        temporal: { year: 1522, month: 9, day: 6, hour: 10, minute: 0 },
      },
      locationName: 'Sanlúcar de Barrameda, Spain',
      description: 'The Victoria returns to Spain, completing the first circumnavigation of Earth. Of 270 men who departed, only 18 survive.',
      environment: {
        weather: 'Clear',
        temperature: 26,
        humidity: 65,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 800,
        technologyLevel: 'Renaissance',
        civilization: 'Spanish Empire',
        notableEvents: ['First Circumnavigation', 'Magellan Expedition Returns', 'Age of Exploration'],
      },
      safety: {
        hazardLevel: 'low',
        hazardType: 'Port City',
        survivalProbability: 90,
        warnings: [
          'DISEASE RISK',
          'LIMITED SANITATION',
          'HISTORIC MOMENT',
        ],
      },
    },
  },
];

export const getWaypointById = (id: string): Waypoint | undefined => {
  return CURATED_WAYPOINTS.find((waypoint) => waypoint.id === id);
};

export const getWaypointsByCategory = (category: Waypoint['category']): Waypoint[] => {
  return CURATED_WAYPOINTS.filter((waypoint) => waypoint.category === category);
};
