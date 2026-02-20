import { useEffect, useRef } from 'react';
import { Theme, THEME_OPTIONS } from '../types';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSelector({
  currentTheme,
  onThemeChange,
  isOpen,
  onClose,
}: ThemeSelectorProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="theme-selector-dropdown" ref={dropdownRef}>
      <div className="theme-selector-header">테마 선택</div>
      <div className="theme-options">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.id}
            className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => {
              onThemeChange(theme.id);
              onClose();
            }}
          >
            <span className="theme-color-preview" data-theme-preview={theme.id} />
            <span className="theme-name">{theme.name}</span>
            {currentTheme === theme.id && <span className="theme-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
