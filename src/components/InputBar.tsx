import { useState } from 'react';
import { Theme } from '../types';
import { ThemeSelector } from './ThemeSelector';

interface InputBarProps {
  input: string;
  setInput: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  pinned: boolean;
  togglePin: () => void;
  onFocus: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
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
  onThemeChange,
}: InputBarProps) {
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);

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
        className={`settings-btn ${themeSelectorOpen ? "active" : ""}`}
        onClick={() => setThemeSelectorOpen(!themeSelectorOpen)}
        title="테마 설정"
      >
        ⚙️
      </button>
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        isOpen={themeSelectorOpen}
        onClose={() => setThemeSelectorOpen(false)}
      />
      <button
        className={`pin-btn ${pinned ? "active" : ""}`}
        onClick={togglePin}
        title={pinned ? "Unpin (Ctrl+Shift+P)" : "Pin to top (Ctrl+Shift+P)"}
      >
        📌
      </button>
    </div>
  );
}
