# PLAN.md

## Goal
Add 5 built-in Korean fonts to ThinkStack and integrate font selection into the settings popup alongside theme selection. The selected font should persist via localStorage and apply immediately across the entire application.

## Scope Definition
This change affects:
- **Type definitions**: New font-related types and constants
- **Storage layer**: New utility module for font persistence (mirroring existing theme storage pattern)
- **UI components**: Renaming and extending ThemeSelector to SettingsPanel with dual-section popup
- **State management**: App.tsx needs font state initialization and propagation
- **Styling**: Font-face declarations and CSS custom properties for dynamic font application

## Files to Change

### New Files
- **src/utils/fontStorage.ts** - Font persistence utility following the pattern of themeStorage.ts

### Modified Files
- **src/types.ts** - Add `Font` type, `FontInfo` interface, `FONT_OPTIONS` array, and `DEFAULT_FONT` constant
- **src/components/ThemeSelector.tsx** → **src/components/SettingsPanel.tsx** - Rename file and refactor to include both theme and font selection sections
- **src/components/InputBar.tsx** - Add font props and settings panel trigger integration
- **src/App.tsx** - Add font state management, initialization from localStorage, and CSS variable application
- **src/styles.css** - Add @font-face declarations for all 5 fonts and CSS variable for font-family

### Dependencies
- `SettingsPanel.tsx` will import from `../types` (FONT_OPTIONS, Font type) and `../utils/fontStorage`
- `App.tsx` will import font utilities and pass font state/callbacks to `InputBar`
- `InputBar.tsx` will import `SettingsPanel` instead of `ThemeSelector`
- `styles.css` font-face declarations depend on CDN availability

## Implementation Steps

1. **Update src/types.ts**
   - Add `Font` type: `'sarasa-mono' | 'pretendard' | 'bukkuk-myeongjo' | 'kopub-dotum' | 'memoment-kkukkak'`
   - Add `FontInfo` interface with `id: Font`, `name: string`, `family: string` (CSS font-family value)
   - Add `FONT_OPTIONS: FontInfo[]` array with all 5 fonts including Korean display names
   - Add `DEFAULT_FONT: Font = 'sarasa-mono'` constant

2. **Create src/utils/fontStorage.ts**
   - Define `FONT_STORAGE_KEY = 'thinkstack-font'`
   - Implement `isValidFont(value: string): value is Font` type guard using `FONT_OPTIONS`
   - Implement `getSavedFont(): Font | null` - read from localStorage with validation
   - Implement `saveFont(font: Font): void` - write to localStorage with try-catch
   - Implement `getInitialFont(): Font` - return saved font or DEFAULT_FONT

3. **Create src/components/SettingsPanel.tsx (rename from ThemeSelector.tsx)**
   - Rename component from `ThemeSelector` to `SettingsPanel`
   - Add `font: Font` and `onFontChange: (font: Font) => void` to props interface
   - Reorganize popup UI into two sections: "테마 선택" and "폰트 선택"
   - Add font selection list with:
     - Each option rendered in its own font-family for preview
     - Check mark (✓) indicator for currently selected font
     - onClick handler calling `onFontChange`
   - Maintain existing theme selection functionality unchanged

4. **Update src/components/InputBar.tsx**
   - Add `font: Font` and `onFontChange: (font: Font) => void` to props interface
   - Pass `font` and `onFontChange` props to `SettingsPanel` component
   - Update import from `ThemeSelector` to `SettingsPanel`
   - No changes to existing pin button or input functionality

5. **Update src/App.tsx**
   - Import `getInitialFont` and `saveFont` from `./utils/fontStorage`
   - Import `Font` type from `./types`
   - Add `const [font, setFont] = useState<Font>(getInitialFont)` state hook
   - Create `handleFontChange` callback that:
     - Calls `setFont(newFont)`
     - Calls `saveFont(newFont)`
     - Sets CSS variable `--font-family` on document root or body
   - Add `useEffect` on mount to apply initial font to CSS variable
   - Pass `font` and `onFontChange={handleFontChange}` to `InputBar` component

6. **Update src/styles.css**
   - Add 5 `@font-face` declarations:
     ```css
     @font-face {
       font-family: 'Sarasa Mono K';
       src: url('https://cdn.jsdelivr.net/gh/be5invis/Sarasa-Gothic@latest/fonts/ttf/SarasaMonoK-Regular.ttf') format('truetype');
       font-display: swap;
     }
     /* Similar for other fonts with appropriate formats (woff2/css) */
     ```
   - For Pretendard, use the CSS import approach since it provides a full stylesheet
   - Add CSS variable: `--font-family: 'Sarasa Mono K', monospace;` in `:root`
   - Update body/app selector to use `font-family: var(--font-family);`
   - Add font-preview classes for each font option in the settings panel

7. **Handle Pretendard special case**
   - Pretendard CDN provides a CSS file, not a font file directly
   - Add `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.css');` at top of styles.css
   - Use `'Pretendard'` as the font-family name (defined in their CSS)

## Edge Cases
- **Font loading failure**: CDN unavailable → fallback to system fonts via CSS font stack
- **Invalid localStorage value**: Corrupted or outdated value → `isValidFont` returns false, default font used
- **localStorage unavailable**: Private browsing mode → `saveFont` silently fails, `getSavedFont` returns null
- **Rapid font switching**: Multiple quick changes → each change triggers immediate CSS variable update and localStorage write
- **Font not yet loaded**: Browser may show fallback font briefly → `font-display: swap` ensures text remains visible
- **Existing users without font preference**: `getInitialFont` returns default → no breaking change for existing installations

### Risk Assessment
- **[Risk Level: Medium]** CDN availability - Fonts are loaded from jsdelivr CDN; if unavailable, fonts won't load. Mitigation: CSS fallback font stack.
- **[Risk Level: Low]** File rename impact - Renaming ThemeSelector.tsx to SettingsPanel.tsx requires updating all imports. Simple find-replace operation.
- **[Risk Level: Low]** localStorage quota - Font preference is a small string value; no storage quota concerns.
- **[Risk Level: Medium]** Font loading performance - Loading 5 fonts may impact initial load time. Mitigation: `font-display: swap` and only loading selected font initially; other fonts load when user opens settings.

## Testing Considerations

### Unit Tests
- `fontStorage.ts`: Test `isValidFont` with valid and invalid strings
- `fontStorage.ts`: Test `getInitialFont` returns default when localStorage is empty
- `types.ts`: Verify FONT_OPTIONS contains all 5 fonts with correct structure

### Integration Tests
- Font selection flow: Select font → verify CSS variable updated → verify localStorage saved
- App restart persistence: Set font → restart app → verify font restored
- Settings panel: Both theme and font sections work independently

### Manual Testing Scenarios
1. Open settings popup, verify both "테마 선택" and "폰트 선택" sections display correctly
2. Select each font and verify:
   - Check mark (✓) moves to selected font
   - App text immediately updates to use new font
   - Each font name is rendered in its own font for preview
3. Restart app and verify selected font persists
4. Clear localStorage and verify app uses default font (Sarasa Mono K)
5. Test with network disconnected - verify fallback fonts work
6. Verify settings popup closes after font selection (if that's expected behavior based on theme selector)