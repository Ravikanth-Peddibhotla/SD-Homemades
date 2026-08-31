/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#351b17',
    tint: '#6d2925',

    // Core surfaces
    background: '#f5eee3',
    foreground: '#351b17',

    // Cards / elevated surfaces
    card: '#fffaf2',
    cardForeground: '#351b17',

    // Primary action color (buttons, links, active states)
    primary: '#6d2925',
    primaryForeground: '#fffaf2',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#dd9b3d',
    secondaryForeground: '#351b17',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#e7d8c5',
    mutedForeground: '#806b5b',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#dfe3cf',
    accentForeground: '#50664b',

    // Destructive actions (delete, error states)
    destructive: '#a9472f',
    destructiveForeground: '#fffaf2',

    // Borders and input outlines
    border: '#e7d8c5',
    input: '#e7d8c5',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 14,
  dark: {
    text: '#f5eee3', tint: '#dd9b3d', background: '#351b17', foreground: '#f5eee3',
    card: '#4a2822', cardForeground: '#f5eee3', primary: '#dd9b3d', primaryForeground: '#351b17',
    secondary: '#52332c', secondaryForeground: '#f5eee3', muted: '#52332c', mutedForeground: '#d7c6b4',
    accent: '#50664b', accentForeground: '#dfe3cf', destructive: '#d0644b', destructiveForeground: '#351b17',
    border: '#624039', input: '#624039',
  },
};

export default colors;
