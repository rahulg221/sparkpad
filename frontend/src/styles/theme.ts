export const darkTheme = {
  colors: {
    // Backgrounds (inverted)
    bgPure: '#000000',
    bgDark: '#0a0a0a',           // Pure black app background
    bgElevated: ' #121212',
    bgLight: '#1a1a1a',          // Dark gray for inputs, blocks

    // Text colors (inverted from light mode)
    textPrimary: '#ffffff',      // Bright white for high contrast
    textLight: '#d1d1d1',        // Soft gray for secondary text
    textSecondary: 'rgb(0, 0, 0)',

    // Primary color
    primary: ' rgb(255, 193, 7)',            // For buttons/icons on dark background
    primaryHover: 'rgb(252, 200, 45)',
    primaryLight: 'rgba(255, 255, 255, 0.1)',

    // Accent (Red/Orange highlights)
    accent: 'rgb(255, 193, 7)',                     // Bright red for emphasis
    accentHover: 'rgba(255, 193, 7, 0.5)',                // Slightly lighter red hover

    // Inverted dot color (was black on white)
    dotColor: 'rgba(255, 255, 255, 0.1)',

    // Semantic folder palette (flipped to work on dark)
    colorOne: 'rgb(255, 193, 7)',         // Stays bright for highlights
    colorTwo: 'rgb(14, 14, 14)',         // Notepad background
    colorThree: 'rgba(255, 255, 255, 0.2)',         // Dots and lines on notepad
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
    sm: '0.8rem',    // 14px
    base: '0.85rem', // 15px
    md: '0.85rem',        // 15px
    lg: '0.9rem',    // 16px
    xl: '1.1rem',     // 20px
    xxl: '1.2rem',     
  },
};

export const lightTheme = {
  colors: {
  // Backgrounds
  bgPure: '#ffffff',
  bgDark: '#ffffff',                     // White app background
  bgElevated: 'rgba(255, 193, 7, 0.1)',     // Subtle card background
  bgLight: '#f5f5f5',                    // Light gray for inputs, code blocks

  // Text colors
  textPrimary: '#0a0a0a',                // High-contrast black text
  textLight: '#444444',                  // Dark gray for secondary text
  textSecondary: 'rgb(255, 255, 255)',              // Replaces dark theme white secondary

  // Primary (dark UI elements on light background)
  primary: ' rgb(0, 0, 0)',            // For buttons/icons on dark background
  primaryHover: 'rgb(252, 200, 45)',
  primaryLight: 'rgba(255, 255, 255, 0.1)',

  // Accent (red/orange highlights)
  accent: 'rgb(252, 200, 45)',                     // Bright red for emphasis
  accentHover: 'rgba(252, 200, 45, 0.5)',                // Slightly lighter red hover

  // Dot color (reversed for light bg)
  dotColor: 'rgba(0, 0, 0, 0.3)',

  // Semantic folder palette (light versions of the dark theme)
  colorOne: 'rgb(0, 0, 0)',                   // Highlight color
  colorTwo: 'rgb(169, 169, 169)',         // Notepad background
  colorThree: 'rgba(0, 0, 0, 0.2)',         // Dots and lines on notepad
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
    sm: '0.8rem',    // 14px
    base: '0.85rem', // 15px
    md: '0.85rem',        // 15px
    lg: '0.9rem',    // 16px
    xl: '1.1rem',     // 20px
    xxl: '1.2rem',  
  },
};

export type ThemeType = typeof darkTheme;
