export const theme = {
  colors: {
    // Base colors
    bgDark: '#0a0a0a',      // Almost black background
    bgElevated: '#141414',  // Slightly lighter black for elevated elements
    bgLight: '#1a1a1a',     // Dark gray for input backgrounds
    
    // Text colors
    textPrimary: '#ffffff',  // Pure white text
    textLight: '#b3b3b3',   // Lighter gray text
    
    // Accent colors
    primary: '#ff69b4',     // Soft pink
    primaryHover: '#ff8dc7', // Lighter pink for hover states
    primaryLight: 'rgba(255, 105, 180, 0.1)', // Very transparent pink for subtle highlights
    accent: '#ff1493',      // Deeper pink for special highlights
    accentHover: '#ff69b4', // Soft pink for accent hovers
    
    // Utility colors
    border: '#2a2a2a',      // Dark gray borders
    error: '#ff4d4d',       // Red for errors
    success: '#00ff9f',     // Neon green for success states

    // Additional accent colors
    warning: '#FFCA28',       // Soft yellow
    info: '#64B5F6',          // Light blue
    disabled: '#E0E0E0',   // Light gray
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