export const heights = {
  // Strict standard control heights in the Sales CRM system
  control: {
    xs: '1.75rem',  // 28px
    sm: '2rem',     // 32px
    md: '2.375rem', // 38px (Standard B2B button / input)
    lg: '2.75rem',  // 44px
    xl: '3.25rem',  // 52px
  },
  avatar: {
    xs: '1.25rem',  // 20px
    sm: '1.75rem',  // 28px
    md: '2.25rem',  // 36px
    lg: '2.75rem',  // 44px
    xl: '3.5rem',   // 56px
  },
  header: '3.75rem', // 60px
  sidebarWidth: '16.5rem', // 264px
} as const;

export type HeightsToken = typeof heights;
