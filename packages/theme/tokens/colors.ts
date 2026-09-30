export const colors = {
  // Brand & Accent (Sales CRM aesthetic: Deep, authoritative slate-indigo)
  brand: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5', // Primary brand action
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },

  // Neutrals (High-contrast, crisp UI slate)
  slate: {
    50: '#F8FAFC',  // Canvas background
    100: '#F1F5F9', // Subtle card hover / segmented tab bg
    200: '#E2E8F0', // Hairline borders
    300: '#CBD5E1', // Heavy dividers
    400: '#94A3B8', // Placeholder text
    500: '#64748B', // Muted secondary text
    600: '#475569', // Body subtext
    700: '#334155', // High-contrast labels
    800: '#1E293B', // Dark surfaces / headers
    900: '#0F172A', // Primary typography
    950: '#020617', // Pure dark baseline
  },

  // Pure canvas & white
  white: '#FFFFFF',
  black: '#000000',

  // Semantic Status (Strict data signaling)
  semantic: {
    success: {
      light: '#ECFDF5',
      border: '#A7F3D0',
      text: '#065F46',
      solid: '#059669',
    },
    warning: {
      light: '#FFFBEB',
      border: '#FDE68A',
      text: '#92400E',
      solid: '#D97706',
    },
    error: {
      light: '#FEF2F2',
      border: '#FECACA',
      text: '#991B1B',
      solid: '#DC2626',
    },
    info: {
      light: '#EFF6FF',
      border: '#BFDBFE',
      text: '#1E40AF',
      solid: '#2563EB',
    },
    premium: {
      light: '#FAF5FF',
      border: '#E9D5FF',
      text: '#6B21A8',
      solid: '#7C3AED',
    },
  },
} as const;

export type ColorsToken = typeof colors;
