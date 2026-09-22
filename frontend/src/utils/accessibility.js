export const ACCESSIBILITY_STORAGE_KEY = 'fade_boba_accessibility';

export const DEFAULT_ACCESSIBILITY_SETTINGS = {
  contrast: 'standard',
  textSize: 'normal',
};

export const CONTRAST_OPTIONS = [
  { value: 'standard', label: 'Standard Contrast' },
  { value: 'high', label: 'High Contrast' },
];

export const TEXT_SIZE_OPTIONS = [
  { value: 'normal', label: 'Normal Text' },
  { value: 'large', label: 'Large Text' },
  { value: 'x-large', label: 'Extra Large Text' },
];

function sanitizeContrast(value) {
  return CONTRAST_OPTIONS.some((option) => option.value === value) ? value : 'standard';
}

function sanitizeTextSize(value) {
  return TEXT_SIZE_OPTIONS.some((option) => option.value === value) ? value : 'normal';
}

export function sanitizeAccessibilitySettings(settings = {}) {
  return {
    contrast: sanitizeContrast(settings.contrast),
    textSize: sanitizeTextSize(settings.textSize),
  };
}

export function readAccessibilitySettings() {
  if (typeof window === 'undefined') {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }

    return sanitizeAccessibilitySettings(JSON.parse(raw));
  } catch (error) {
    console.error('Failed to read accessibility settings:', error);
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
}

export function persistAccessibilitySettings(settings) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify(sanitizeAccessibilitySettings(settings))
    );
  } catch (error) {
    console.error('Failed to save accessibility settings:', error);
  }
}

export function applyAccessibilitySettings(settings) {
  if (typeof document === 'undefined') {
    return;
  }

  const next = sanitizeAccessibilitySettings(settings);
  const root = document.documentElement;

  root.dataset.contrast = next.contrast;
  root.dataset.textSize = next.textSize;
}

export function updateAccessibilitySettings(settings) {
  const next = sanitizeAccessibilitySettings(settings);
  persistAccessibilitySettings(next);
  applyAccessibilitySettings(next);
  return next;
}

export function getContrastAnnouncement(value) {
  return value === 'high' ? 'High contrast mode enabled.' : 'Standard contrast mode enabled.';
}

export function getTextSizeAnnouncement(value) {
  if (value === 'large') return 'Large text mode enabled.';
  if (value === 'x-large') return 'Extra large text mode enabled.';
  return 'Normal text size enabled.';
}