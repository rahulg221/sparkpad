export const darkTheme = {
  colors: {
    // Backgrounds (inverted)
    bgDark: '#0a0a0a',           // Pure black app background
    bgElevated: 'rgba(255, 255, 255, 0.1)',
    bgLight: '#1a1a1a',          // Dark gray for inputs, blocks

    // Text colors (inverted from light mode)
    textPrimary: '#ffffff',      // Bright white for high contrast
    textLight: '#d1d1d1',        // Soft gray for secondary text
    textSecondary: '#ffffff',

    // Primary (white UI elements)
    primary: '#ffffff',          // For buttons/icons on dark background
    primaryHover: '#e5e5e5',     // Slightly muted white hover
    primaryLight: 'rgba(255, 255, 255, 0.1)',

    // Accent (Red/Orange highlights)
    accent: '#ff4444',           // Bright red for emphasis
    accentHover: '#ff6666',      // Slightly lighter red hover

    // Inverted dot color (was black on white)
    dotColor: 'rgba(255, 255, 255, 0.2)',

    // Semantic folder palette (flipped to work on dark)
    colorOne: '#FFD966',         // Stays bright for highlights
    colorTwo: '#2b2b2b',           // Dark grey folder tab
    colorThree: '#3a3a3a',         // Slightly lighter dark grey for folder body
    colorFour: '#2a2a2a',        // Neutral dark base

    // Utility / Semantic
    border: '#444444',           // Dark gray borders
    error: '#ef9a9a',            // Soft pinkish-red error
    success: '#81c784',          // Green for success (kept same)
    warning: '#fbc02d',          // Vibrant yellow for warnings (kept same)
    info: '#64b5f6',             // Light blue (kept same)
    disabled: '#4a4a4a'          // Muted charcoal gray for disabled elements
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '10px',
    lg: '15px',
    xl: '24px',
    xxl: '48px',
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
    md: '0.9375rem',        // 15px
    lg: '1rem',    // 16px
    xl: '1.25rem',     // 20px
    xxl: '3rem',     // 48px
  },
};

export const lightTheme = {
  colors: {
  // Backgrounds
  bgDark: '#ffffff',                     // White app background
  bgElevated: 'rgba(0, 0, 0, 0.04)',     // Subtle card background
  bgLight: '#f5f5f5',                    // Light gray for inputs, code blocks

  // Text colors
  textPrimary: '#0a0a0a',                // High-contrast black text
  textLight: '#444444',                  // Dark gray for secondary text
  textSecondary: '#0a0a0a',              // Replaces dark theme white secondary

  // Primary (dark UI elements on light background)
  primary: '#0a0a0a',                    // Black for buttons/icons
  primaryHover: '#1a1a1a',               // Slightly darker on hover
  primaryLight: 'rgba(0, 0, 0, 0.05)',   // Transparent black background

  // Accent (red/orange highlights)
  accent: '#ff4444',                     // Bright red for emphasis
  accentHover: '#ff6666',                // Slightly lighter red hover

  // Dot color (reversed for light bg)
  dotColor: 'rgba(0, 0, 0, 0.15)',

  // Semantic folder palette (light versions of the dark theme)
  colorOne: '#FFD966',                   // Highlight color
  colorTwo: '#2b2b2b',           // Dark grey folder tab
  colorThree: '#3a3a3a',         // Slightly lighter dark grey for folder body
  colorFour: '#fafafa',

  // Utility / Semantic
  border: '#444444',           // Dark gray borders
  error: '#ef9a9a',            // Soft pinkish-red error
  success: '#81c784',          // Green for success (kept same)
  warning: '#fbc02d',          // Vibrant yellow for warnings (kept same)
  info: '#64b5f6',             // Light blue (kept same)
  disabled: '#4a4a4a'          // Muted charcoal gray for disabled elements
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '10px',
    lg: '15px',
    xl: '24px',
    xxl: '48px',
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
    lg: '1rem',    // 16px
    xl: '1.25rem',     // 20px
    xxl: '3rem',     // 48px
  },
};
