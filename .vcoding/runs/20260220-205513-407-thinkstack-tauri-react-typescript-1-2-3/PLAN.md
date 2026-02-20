# PLAN.md

## Goal

Add a theme switching feature to ThinkStack that allows users to select from 6 dark-mode-only themes (ayu, one-dark, dracula, tokyonight, zenburn, monokai) via a settings button placed next to the existing pin button. The selected theme should persist across app restarts using localStorage, and theme switching should be implemented via CSS variables and the `data-theme` attribute on the root element.

## Scope Definition

This change affects the following subsystems:

- **UI Layer**: InputBar component (new settings button), new ThemeSelector component (dropdown/popup)
- **State Management**: New theme persistence mechanism via localStorage
- **Styling**: Global CSS with theme-specific CSS variable definitions
- **Type System**: New theme-related type definitions

The change is primarily frontend-focused with no Tauri backend modifications required.

## Files to Change

- **src/types.ts** — Add `Theme` type and `THEME_OPTIONS` constant for type safety
- **src/utils/themeStorage.ts** — New file: theme save/load utilities using localStorage
- **src/components/ThemeSelector.tsx** — New file: theme selection dropdown/popup component
- **src/components/InputBar.tsx** — Add settings (gear) button next to pin button, integrate ThemeSelector
- **src/App.tsx** — Add theme state management, apply `data-theme` attribute to root element
- **src/styles.css** — Define CSS variables for all 6 themes and base dark theme styles

### Dependencies

- **InputBar.tsx ↔ ThemeSelector.tsx**: InputBar will render ThemeSelector and control its visibility
- **App.tsx → themeStorage.ts**: App will use theme storage utilities for persistence
- **styles.css ↔ data-theme**: All components depend on CSS variables that change based on `data-theme` attribute
- The existing `useStore.ts` uses Tauri's LazyStore for persistence; the new theme storage will use plain `localStorage` as specified in the requirements (simpler, no need for Tauri plugin for this single value)

## Implementation Steps

### Step 1: Define Theme Types

In `src/types.ts`:
1. Add a union type `Theme = 'ayu' | 'one-dark' | 'dracula' | 'tokyonight' | 'zenburn' | 'monokai'`
2. Add a constant `THEME_OPTIONS: Theme[]` containing all available themes
3. Add an interface `ThemeInfo` with properties: `id: Theme`, `name: string` (for display names like "One Dark", "Tokyo Night")

### Step 2: Create Theme Storage Utility

Create `src/utils/themeStorage.ts`:
1. Define `THEME_STORAGE_KEY = 'thinkstack-theme'` constant
2. Implement `getSavedTheme(): Theme | null` — reads from localStorage, returns null if not found or invalid
3. Implement `saveTheme(theme: Theme): void` — writes to localStorage
4. Implement `isValidTheme(value: string): value is Theme` — type guard to validate stored values
5. Define `DEFAULT_THEME: Theme = 'one-dark'` as fallback

### Step 3: Define Theme CSS Variables

In `src/styles.css`:
1. Define base CSS variable structure for theming:
   - `--bg-primary`: Main background color
   - `--bg-secondary`: Secondary/card background
   - `--bg-tertiary`: Input field background
   - `--text-primary`: Main text color
   - `text-secondary`: Muted text color
   - `--border-color`: Border color
   - `--accent-color`: Accent/highlight color
   - `--hover-color`: Hover state background
   - `--danger-color`: Delete button color

2. Create 6 theme blocks using `[data-theme="theme-name"]` selectors:
   - `[data-theme="ayu"]`: Ayu dark theme colors
   - `[data-theme="one-dark"]`: One Dark theme colors
   - `[data-theme="dracula"]`: Dracula theme colors
   - `[data-theme="tokyonight"]`: Tokyo Night theme colors
   - `[data-theme="zenburn"]`: Zenburn theme colors
   - `[data-theme="monokai"]`: Monokai theme colors

3. Update existing hardcoded colors in the stylesheet to use CSS variables

### Step 4: Create ThemeSelector Component

Create `src/components/ThemeSelector.tsx`:
1. Define props interface: `{ currentTheme: Theme; onThemeChange: (theme: Theme) => void; isOpen: boolean; onClose: () => void }`
2. Render a dropdown/popup with theme list (use absolute positioning relative to settings button)
3. Each theme option should show the theme name and be clickable
4. Highlight currently selected theme visually
5. Implement click-outside-to-close behavior
6. Apply consistent styling with the app's dark aesthetic

### Step 5: Modify InputBar Component

In `src/components/InputBar.tsx`:
1. Add props: `currentTheme: Theme`, `onThemeChange: (theme: Theme) => void`
2. Add state: `themeSelectorOpen: boolean`
3. Add a settings (gear icon) button next to the pin button with consistent styling
4. Settings button click toggles `themeSelectorOpen` state
5. Render `ThemeSelector` component with appropriate positioning
6. Pass `currentTheme` and `onThemeChange` props to ThemeSelector

### Step 6: Integrate Theme in App.tsx

In `src/App.tsx`:
1. Import theme storage utilities and types
2. Add state: `theme: Theme` initialized from `getSavedTheme()` or `DEFAULT_THEME`
3. Add `useEffect` to apply theme on mount:
   - Set `data-theme` attribute on `document.documentElement` (or `document.body`)
4. Create `handleThemeChange(theme: Theme)` function:
   - Update theme state
   - Call `saveTheme(theme)`
   - Update `data-theme` attribute on root element
5. Pass `theme` and `onThemeChange` props to InputBar component

### Step 7: Update Global Styles

In `src/styles.css`:
1. Ensure `:root` or base styles set dark mode as default
2. Replace all hardcoded color values with CSS variable references
3. Verify all UI elements (input, buttons, items, age badges, scrollbars) use theme variables

## Edge Cases

- **Invalid localStorage value**: If localStorage contains an invalid theme string, fall back to `DEFAULT_THEME` instead of crashing
- **Missing localStorage**: Handle cases where localStorage is unavailable (e.g., private browsing modes) gracefully
- **Theme selector positioning**: Ensure dropdown doesn't overflow viewport or get clipped
- **Initial render flash**: Apply theme before React hydration to prevent flash of unstyled content (consider adding inline script in `index.html` or setting attribute early)
- **Keyboard accessibility**: Theme selector should be navigable via keyboard (Escape to close, Tab/Arrow keys)
- **Button styling consistency**: Settings button should match the visual style of the pin button

### Risk Assessment

- **[Risk Level: Low]** CSS variable naming inconsistency — Mitigation: Define a clear variable naming convention upfront and document it in the CSS file
- **[Risk Level: Low]** Theme flash on startup — Mitigation: Initialize theme from localStorage synchronously in a `<script>` block in `index.html` before React loads, or accept brief flash as acceptable tradeoff for simplicity
- **[Risk Level: Medium]** Click-outside detection for ThemeSelector — Mitigation: Use a standard pattern (ref + event listener or existing library pattern) to detect clicks outside the dropdown
- **[Risk Level: Low]** Backward compatibility with existing items — Mitigation: Theme changes are purely visual and don't affect data structure; no migration needed

## Testing Considerations

### Unit Tests Needed

- **themeStorage.ts**:
  - Test `getSavedTheme()` returns null for empty/invalid storage
  - Test `getSavedTheme()` returns correct theme for valid storage
  - Test `saveTheme()` writes to localStorage correctly
  - Test `isValidTheme()` validates all theme names correctly

### Integration Tests Needed

- Theme persistence: Select a theme, reload app, verify theme is restored
- Theme switching: Click through all themes, verify CSS variables change correctly

### Manual Testing Scenarios

1. **Theme selection flow**: Click settings button → theme dropdown appears → select each theme → verify visual changes
2. **Theme persistence**: Select a theme → close and reopen app → verify theme is preserved
3. **Dropdown interaction**: Click outside dropdown → verify it closes
4. **Settings button styling**: Verify settings button looks consistent with pin button
5. **All themes visual check**: Manually verify each theme's color scheme looks correct (contrast, readability)
6. **Existing functionality**: Verify item add/delete/pin still works after theme feature is added
7. **Edge case**: Clear localStorage manually → verify app defaults to `DEFAULT_THEME` without errors
8. **Edge case**: Manually set invalid theme value in localStorage → verify app falls back gracefully