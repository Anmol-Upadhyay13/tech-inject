export const typography = {
  fonts: {
    display: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace',
  },

  sizes: {
    '2xs': '0.6875rem', // 11px
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '0.9375rem',  // 15px - optimal B2B read density
    md: '1rem',         // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeights: {
    none: '1',
    tight: '1.2',
    snug: '1.35',
    normal: '1.5',
    relaxed: '1.625',
  },

  letterSpacings: {
    tighter: '-0.03em',
    tight: '-0.015em',
    normal: '0em',
    wide: '0.025em',
  },
} as const;

export type TypographyToken = typeof typography;
