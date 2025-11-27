import type { Waypoint } from '../types';

export const CURATED_WAYPOINTS: Waypoint[] = [
  {
    id: 'hiroshima-1945',
    name: 'Hiroshima',
    icon: 'Radiation',
    category: 'disaster',
    coordinates: {
      spatial: {
        latitude: 34.3853,
        longitude: 132.4553,
      },
      temporal: {
        year: 1945,
        month: 8,
        day: 6,
        hour: 8,
        minute: 15,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 34.3853, longitude: 132.4553 },
        temporal: { year: 1945, month: 8, day: 6, hour: 8, minute: 15 },
      },
      locationName: 'Hiroshima, Japan',
      description: 'Ground zero of the first atomic bomb used in warfare. The city of Hiroshima moments before the detonation of "Little Boy".',
      environment: {
        weather: 'Clear',
        temperature: 27,
        humidity: 80,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 12000,
        technologyLevel: 'Electric',
        civilization: 'Imperial Japan',
        notableEvents: ['World War II', 'Atomic Bombing', 'End of Pacific War'],
      },
      safety: {
        hazardLevel: 'critical',
        hazardType: 'Nuclear Detonation',
        survivalProbability: 0,
        warnings: [
          'EXTREME RADIATION HAZARD',
          'THERMAL PULSE: 6000°C',
          'SHOCKWAVE IMMINENT',
          'IMMEDIATE EVACUATION IMPOSSIBLE',
        ],
      },
    },
  },
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
    id: 'pompeii-79',
    name: 'Pompeii',
    icon: 'Mountain',
    category: 'disaster',
    coordinates: {
      spatial: {
        latitude: 40.7489,
        longitude: 14.4848,
      },
      temporal: {
        year: 79,
        month: 8,
        day: 24,
        hour: 13,
        minute: 0,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 40.7489, longitude: 14.4848 },
        temporal: { year: 79, month: 8, day: 24, hour: 13, minute: 0 },
      },
      locationName: 'Pompeii, Roman Empire',
      description: 'The eruption of Mount Vesuvius begins. Within hours, this thriving Roman city will be buried under volcanic ash.',
      environment: {
        weather: 'Volcanic Ash',
        temperature: 45,
        humidity: 30,
        visibility: 'Poor',
      },
      anthropology: {
        populationDensity: 8500,
        technologyLevel: 'Classical',
        civilization: 'Roman Empire',
        notableEvents: ['Vesuvius Eruption', 'Destruction of Pompeii', 'Plinian Eruption'],
      },
      safety: {
        hazardLevel: 'critical',
        hazardType: 'Volcanic Eruption',
        survivalProbability: 5,
        warnings: [
          'PYROCLASTIC FLOW IMMINENT',
          'TOXIC GASES DETECTED',
          'STRUCTURAL COLLAPSE RISK',
          'EVACUATION RECOMMENDED',
        ],
      },
    },
  },
  {
    id: 'kitty-hawk-1903',
    name: 'Kitty Hawk',
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
    name: 'Fall of Berlin Wall',
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
    id: 'titanic-1912',
    name: 'RMS Titanic Sinking',
    icon: 'Ship',
    category: 'disaster',
    coordinates: {
      spatial: {
        latitude: 41.7262,
        longitude: -49.9478,
      },
      temporal: {
        year: 1912,
        month: 4,
        day: 15,
        hour: 2,
        minute: 20,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 41.7262, longitude: -49.9478 },
        temporal: { year: 1912, month: 4, day: 15, hour: 2, minute: 20 },
      },
      locationName: 'North Atlantic Ocean',
      description: 'The "unsinkable" RMS Titanic slips beneath the waves. Over 1,500 souls are lost to the freezing North Atlantic.',
      environment: {
        weather: 'Clear',
        temperature: -2,
        humidity: 85,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 0,
        technologyLevel: 'Industrial',
        civilization: 'British Empire',
        notableEvents: ['Titanic Sinking', 'Maritime Disaster', 'Birth of Modern Safety Regulations'],
      },
      safety: {
        hazardLevel: 'critical',
        hazardType: 'Maritime Disaster',
        survivalProbability: 32,
        warnings: [
          'WATER TEMPERATURE: -2°C',
          'HYPOTHERMIA IN 15 MINUTES',
          'LIMITED LIFEBOATS',
          'NO RESCUE FOR 2 HOURS',
        ],
      },
    },
  },
  {
    id: 'jfk-1963',
    name: 'JFK Assassination',
    icon: 'Crosshair',
    category: 'conflict',
    coordinates: {
      spatial: {
        latitude: 32.7788,
        longitude: -96.8084,
      },
      temporal: {
        year: 1963,
        month: 11,
        day: 22,
        hour: 12,
        minute: 30,
      },
    },
    previewData: {
      coordinates: {
        spatial: { latitude: 32.7788, longitude: -96.8084 },
        temporal: { year: 1963, month: 11, day: 22, hour: 12, minute: 30 },
      },
      locationName: 'Dealey Plaza, Dallas, Texas, USA',
      description: 'President John F. Kennedy\'s motorcade approaches the fatal turn. A moment that would traumatize a nation.',
      environment: {
        weather: 'Clear',
        temperature: 18,
        humidity: 55,
        visibility: 'Clear',
      },
      anthropology: {
        populationDensity: 5000,
        technologyLevel: 'Atomic',
        civilization: 'United States of America',
        notableEvents: ['JFK Assassination', 'End of Camelot', 'Warren Commission'],
      },
      safety: {
        hazardLevel: 'critical',
        hazardType: 'Active Threat Zone',
        survivalProbability: 85,
        warnings: [
          'ACTIVE SHOOTER ZONE',
          'MASS PANIC IMMINENT',
          'AVOID MOTORCADE ROUTE',
          'HISTORICAL TRAUMA EVENT',
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
