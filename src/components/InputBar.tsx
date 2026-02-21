import { useState } from 'react';
import { Pin, Settings } from 'lucide-react';
import { Theme, Font } from '../types';
import { SettingsPanel } from './SettingsPanel';

interface InputBarProps {
  input: string;
  setInput: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  pinned: boolean;
  togglePin: () => void;
  onFocus: () => void;
  currentTheme: Theme;
  currentFont: Font;
  onThemeChange: (theme: Theme) => void;
  onFontChange: (font: Font) => void;
}

export function InputBar({
  input,
  setInput,
  onKeyDown,
  inputRef,
  pinned,
  togglePin,
  onFocus,
  currentTheme,
  currentFont,
  onThemeChange,
  onFontChange,
}: InputBarProps) {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  return (
    <div className="input-bar">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Type and press Enter..."
      />
      <button
        className={`pin-btn ${pinned ? "active" : ""}`}
        onClick={togglePin}
        title={pinned ? "Unpin (Ctrl+Shift+P)" : "Pin to top (Ctrl+Shift+P)"}
      >
        <Pin size={18} />
      </button>
      <button
        className={`settings-btn ${settingsPanelOpen ? "active" : ""}`}
        onClick={() => setSettingsPanelOpen(!settingsPanelOpen)}
        title="Settings"
      >
        <Settings size={18} />
      </button>
      <SettingsPanel
        currentTheme={currentTheme}
        currentFont={currentFont}
        onThemeChange={onThemeChange}
        onFontChange={onFontChange}
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
      />
    </div>
  );
}
