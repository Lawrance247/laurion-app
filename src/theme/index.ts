// src/theme/index.ts
export const Colors = {
  // Brand
  primary: '#0b1f3a',      // deep navy
  accent: '#1a9e5c',       // laurion green
  accentLight: '#22c97a',
  gold: '#f5a623',

  // Backgrounds
  bg: '#f4f6fb',
  bgCard: '#ffffff',
  bgSubtle: '#eef1f7',
  bgDark: '#0b1f3a',

  // Text
  text: '#1a2340',
  textSub: '#4a5568',
  muted: '#8a94a6',
  white: '#ffffff',

  // Status
  success: '#1a9e5c',
  error: '#e53e3e',
  warning: '#f5a623',
  info: '#3182ce',

  // Border
  border: '#dde3ef',

  // Subject colours
  math: '#3182ce',
  phy: '#805ad5',
  ls: '#1a9e5c',
  geo: '#dd6b20',
  acc: '#d53f8c',
};

export const Typography = {
  // Font families (uses system fonts — swap for custom after installing)
  heading: 'Georgia',      // serif authority
  body: 'System',
  mono: 'Courier New',

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 38,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#0b1f3a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0b1f3a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0b1f3a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const SUBJECTS: Record<string, { label: string; icon: string; color: string }> = {
  math: { label: 'Mathematics',      icon: '📊', color: Colors.math },
  phy:  { label: 'Physical Science', icon: '⚛️', color: Colors.phy  },
  ls:   { label: 'Life Science',     icon: '🌿', color: Colors.ls   },
  geo:  { label: 'Geography',        icon: '🌍', color: Colors.geo  },
  acc:  { label: 'Accounting',       icon: '📈', color: Colors.acc  },
};

export const GRADES = [8, 9, 10, 11, 12];
