export const radii = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '6px',       // Standard inputs & buttons in CRM
  lg: '8px',       // Standard cards & modals
  xl: '12px',      // Outer containers
  '2xl': '16px',
  full: '9999px',  // Circular buttons & badges
} as const;

export type RadiiToken = typeof radii;
