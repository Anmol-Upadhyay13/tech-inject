import { colors } from './colors.ts';
import { typography } from './typography.ts';
import { spacing } from './spacing.ts';
import { radii } from './radii.ts';
import { shadows } from './shadows.ts';
import { borders } from './borders.ts';
import { heights } from './heights.ts';
import { transitions } from './transitions.ts';
import { focus } from './focus.ts';

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  borders,
  heights,
  transitions,
  focus,
} as const;

export type ThemeTokens = typeof tokens;

export * from './colors.ts';
export * from './typography.ts';
export * from './spacing.ts';
export * from './radii.ts';
export * from './shadows.ts';
export * from './borders.ts';
export * from './heights.ts';
export * from './transitions.ts';
export * from './focus.ts';
