export const colors = {
  background: '#FFFFFF',
  surface: '#F3F4F6',
  border: '#E5E7EB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  primary: '#0F172A',
  primaryDark: '#020617',
  primaryText: '#FFFFFF',
  accent: '#F59E0B',
  accentText: '#1F2937',
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