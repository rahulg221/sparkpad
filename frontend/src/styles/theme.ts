export const theme = {
  colors: {
    // Main colors
    primary: '#4A90E2',    // Soft blue
    primaryHover: '#357ABD',
    accent: '#82B1FF',     // Light blue accent
    accentHover: '#5E9BFF',
    error: '#FF6B6B',      // Soft red
    disabled: '#E0E0E0',   // Light gray

    // Text colors
    textPrimary: '#2C3E50',    // Dark blue-gray
    textLight: '#546E7A',      // Medium blue-gray
    
    // Background colors
    bgDark: '#FFF9F0',        // Warm cream
    bgLight: '#FFFFFF',        // Pure white
    bgElevated: '#FFFFFF',     // White for elevated elements
    
    // Border and line colors
    border: '#E6EEF7',        // Light blue-gray
    
    // Additional accent colors
    success: '#66BB6A',       // Soft green
    warning: '#FFCA28',       // Soft yellow
    info: '#64B5F6',          // Light blue
  },
  spacing: {
    sm: '8px',
    md: '10px',
    lg: '20px',
    xl: '50px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
  },
  fonts: {
    primary: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif`,
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '0.9375rem', // 15px
    md: '1rem',        // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
  },
};

export type Theme = typeof theme; 