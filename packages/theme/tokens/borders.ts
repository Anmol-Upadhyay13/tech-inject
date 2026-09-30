export const borders = {
  none: '0px',
  hairline: '1px solid #E2E8F0', // slate-200
  hairlineDark: '1px solid #334155', // slate-700
  strong: '1.5px solid #CBD5E1', // slate-300
  focus: '2px solid #4F46E5', // brand-600
  error: '1px solid #FECACA', // semantic error
} as const;

export type BordersToken = typeof borders;
