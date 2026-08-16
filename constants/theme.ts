export const colors = {
  background: '#FFFFFF',
  surface: '#F7F7FB',
  surfaceAlt: '#EFEFF7',
  border: '#E5E5EF',
  text: '#14141F',
  textSecondary: '#6E6E82',
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primaryText: '#FFFFFF',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
  star: '#F59E0B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  price: { fontSize: 16, fontWeight: '700' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
} as const;