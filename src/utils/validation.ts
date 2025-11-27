import type { TemporalCoordinates, SpatialCoordinates, DateValidation } from '../types';

/**
 * Check if a year is a leap year
 */
export const isLeapYear = (year: number): boolean => {
  // Works for BC years too (using astronomical year numbering)
  const adjustedYear = year <= 0 ? year - 1 : year;
  return (adjustedYear % 4 === 0 && adjustedYear % 100 !== 0) || (adjustedYear % 400 === 0);
};

/**
 * Get the number of days in a given month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 2 && isLeapYear(year)) {
    return 29;
  }

  return daysPerMonth[month - 1] || 31;
};

/**
 * Validate temporal coordinates
 */
export const validateTemporalCoordinates = (temporal: TemporalCoordinates): DateValidation => {
  const { year, month, day, hour, minute } = temporal;

  // Month validation
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 1 and 12' };
  }

  // Day validation
  const maxDays = getDaysInMonth(year, month);
  if (day < 1 || day > maxDays) {
    return { isValid: false, error: `Day must be between 1 and ${maxDays} for this month` };
  }

  // Hour validation
  if (hour < 0 || hour > 23) {
    return { isValid: false, error: 'Hour must be between 0 and 23' };
  }

  // Minute validation
  if (minute < 0 || minute > 59) {
    return { isValid: false, error: 'Minute must be between 0 and 59' };
  }

  return { isValid: true };
};

/**
 * Validate spatial coordinates
 */
export const validateSpatialCoordinates = (spatial: SpatialCoordinates): DateValidation => {
  const { latitude, longitude } = spatial;

  if (latitude < -90 || latitude > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (longitude < -180 || longitude > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and 180' };
  }

  return { isValid: true };
};

/**
 * Format a year for display (handling BC years)
 */
export const formatYear = (year: number): string => {
  if (year <= 0) {
    return `${Math.abs(year - 1)} BC`;
  }
  return `${year} AD`;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};

/**
 * Format time in 24-hour format
 */
export const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Format full date
 */
export const formatDate = (temporal: TemporalCoordinates): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return `${months[temporal.month - 1]} ${temporal.day}, ${formatYear(temporal.year)}`;
};

/**
 * Parse a number input, allowing for negative values
 */
export const parseNumericInput = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
