export const focus = {
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/30 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
  inputRing: 'focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20',
  errorRing: 'focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
} as const;

export type FocusToken = typeof focus;
