export const colors = {
  background: '#FFFFFF',
  surface: '#F5F5F7',
  border: '#E2E2E8',
  text: '#0B0B1A',
  textSecondary: '#6B6B7B',
  primary: '#4F46E5',
  primaryText: '#FFFFFF',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  price: { fontSize: 16, fontWeight: '700' as const },
} as const;