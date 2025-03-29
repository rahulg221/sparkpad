export const theme = {
  colors: {
    // Backgrounds
    bgDark: '#0a0a0a',
    bgElevated: '#121212',
    bgLight: '#1c1c1c',

    // Text
    textPrimary: '#ffffff',
    textLight: '#aab1bc',

    // Primary — Coral core
    primary: '#ff6b6b',                 // Coral
    primaryHover: '#ff8585',            // Lighter coral hover
    primaryLight: 'rgba(255, 107, 107, 0.15)',

    // Accent (optional)
    accent: '#ffc107',                  // Golden neural glow
    accentHover: '#ffe082',

    // Utility / Semantic
    border: '#2a2a2a',
    error: '#ef5350',
    success: '#66bb6a',
    warning: '#fbc02d',
    info: '#81d4fa',
    disabled: '#3a3a3a'
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
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    xxl: '3rem',     // 48px
  },
};

export type Theme = typeof theme; 

/*
 // Backgrounds
    bgDark: '#ffffff',         // App background: pure white
    bgElevated: '#f5f5f5',     // Light gray for cards, modals
    bgLight: '#ebebeb',        // Lighter gray for inputs, code blocks

    // Text
    textPrimary: '#0a0a0a',     // Rich black for high contrast
    textLight: '#555555',       // Medium gray for secondary text

    // Primary (Black UI elements)
    primary: '#0a0a0a',         // For primary buttons/text
    primaryHover: '#1a1a1a',    // Slightly lighter black on hover
    primaryLight: 'rgba(10, 10, 10, 0.1)',

    // Accent (Orange highlights)
    accent: '#ff9e4a',          // Warm orange for CTAs, icons, tags
    accentHover: '#ffb366',     // Hovered/active orange

    // Utility / Semantic
    border: '#d4d4d4',          // Light gray borders
    error: '#e57373',           // Muted red for errors
    success: '#81c784',         // Green for success states
    warning: '#fbc02d',         // Vibrant yellow for warnings
    info: '#64b5f6',            // Blue for info tags or badges
    disabled: '#c0c0c0'         // Desaturated gray for disabled elements

bgDark: '#0a0a0a',      // Almost black background
    bgElevated: '#1a1625',     // Dark purple for cards, modals
    bgLight: '#241c35',        // Slightly lighter purple for inputs, code blocks

    // Text colors (light + readable)
    textPrimary: '#f3e5fd',    // Very light purple-white (for high contrast)
    textLight: '#b5adc6',      // Muted lavender-gray (for secondary text)

    // Accent colors (calm purples)
    primary: '#b388ff',         // Light purple (main interactive elements)
    primaryHover: '#c9a9ff',    // Brighter purple for hover/active states
    primaryLight: 'rgba(179, 136, 255, 0.15)',  // Transparent background fill

    accent: '#9575cd',          // Mid purple for icons, outlines, tags
    accentHover: '#b39ddb',     // Hovered accent purple

    // Utility colors
    border: '#2d2440',          // Deep purple border lines
    error: '#ef9a9a',           // Keeping red for errors
    success: '#a5d6a7',         // Keeping green for success
    warning: '#ffecb3',         // Keeping yellow for warnings
    info: '#b39ddb',           // Light purple for info boxes
    disabled: '#4a4255'         // Muted gray-purple for disabled elements

// Base colors
    bgDark: '#0a0a0a',      // Almost black background
    bgElevated: '#141414',  // Slightly lighter black for elevated elements
    bgLight: '#1a1a1a',     // Dark gray for input backgrounds
    
    // Text colors
    textPrimary: '#ffffff',  // Pure white text
    textLight: '#b3b3b3',   // Lighter gray text
    
    // Accent colors
    primary: '#9b6dff',     // Softer high-tech purple
    primaryHover: '#b38dff', // Lighter soft purple for hover
    primaryLight: 'rgba(155, 109, 255, 0.1)', // Very transparent purple
    accent: '#7a5cff',      // Deeper soft purple for special highlights
    accentHover: '#9b6dff', // Base purple for accent hovers
    
    // Utility colors
    border: '#2a2a2a',      // Dark gray borders
    error: '#ff4d4d',       // Red for errors
    success: '#00e676',     // Green for success states

    // Additional accent colors
    warning: '#FFCA28',       // Soft yellow
    info: '#64B5F6',          // Light blue
    disabled: '#E0E0E0',   // Light gray
*/

/*
// Base colors (dark backgrounds)
    bgDark: '#0d0d0f',         // Near-black background (main app shell)
    bgElevated: '#16181d',     // Dark gray for cards, modals
    bgLight: '#1f2127',        // Slightly lighter for inputs, code blocks

    // Text colors (light + readable)
    textPrimary: '#e3f2fd',    // Very light blue-white (for high contrast)
    textLight: '#b0bec5',      // Muted steel blue-gray (for secondary text)

    // Accent colors (calm light blues)
    primary: '#90caf9',         // Light sky blue (main interactive elements)
    primaryHover: '#b3e5fc',    // Brighter blue for hover/active states
    primaryLight: 'rgba(144, 202, 249, 0.15)',  // Transparent background fill

    accent: '#64b5f6',          // Mid blue for icons, outlines, tags
    accentHover: '#81d4fa',     // Hovered accent blue

    // Utility colors
    border: '#2e3440',          // Deep gray border lines
    error: '#ef9a9a',           // Muted rose red for errors
    success: '#a5d6a7',         // Pastel green for success states
    warning: '#ffecb3',         // Pale yellow
    info: '#81d4fa',            // Reused light blue for info boxes
    disabled: '#4e5a65'         // Muted gray-blue for disabled elements
    */

    /* 
    // Base colors (light cream backgrounds)
    bgDark: '#fdfaf6',         // Soft warm cream (main background)
    bgElevated: '#f7f3ee',     // Slightly darker cream for cards/modals
    bgLight: '#f1ece6',        // Light beige-cream for inputs/code blocks

    // Text colors (calm but readable)
    textPrimary: '#2c3e50',     // Dark muted blue-gray
    textLight: '#7f8c8d',       // Subtle warm gray for secondary text

    // Accent colors (slightly more saturated blues)
    primary: '#5bb0ff',         // Brighter baby blue for interactive elements
    primaryHover: '#82c8ff',    // Light sky blue for hover/active
    primaryLight: 'rgba(91, 176, 255, 0.15)',  // Transparent blue highlight

    accent: '#489fdc',          // Soft aqua-blue for icons/tags/outlines
    accentHover: '#7bc3f2',     // Pastel but clear hover tone

    // Utility colors
    border: '#e0dcd5',          // Light warm gray border
    error: '#f7b0a0',           // Soft coral-pink for errors
    success: '#bde4c6',         // Gentle mint green for success
    warning: '#ffe5b4',         // Warm apricot-cream warning tone
    info: '#d0ebff',            // Clear sky-blue for info boxes
    disabled: '#ccc7be'         // Muted beige-gray for disabled elements
    */