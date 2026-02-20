import { useEffect, useRef, useState } from 'react';
import { Theme, Font, THEME_OPTIONS, FONT_OPTIONS } from '../types';

interface SettingsPanelProps {
  currentTheme: Theme;
  currentFont: Font;
  onThemeChange: (theme: Theme) => void;
  onFontChange: (font: Font) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({
  currentTheme,
  currentFont,
  onThemeChange,
  onFontChange,
  isOpen,
  onClose,
}: SettingsPanelProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);

  const currentThemeName = THEME_OPTIONS.find(t => t.id === currentTheme)?.name || '';
  const currentFontName = FONT_OPTIONS.find(f => f.id === currentFont)?.name || '';

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 팝업 열릴 때 드롭다운 초기화
      setIsThemeOpen(false);
      setIsFontOpen(false);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme);
    setIsThemeOpen(false);
  };

  const handleFontSelect = (font: Font) => {
    onFontChange(font);
    setIsFontOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal" ref={modalRef}>
        <div className="settings-modal-header">
          <h3>설정</h3>
          <button className="settings-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="settings-modal-content">
          {/* 테마 선택 드롭다운 */}
          <div className="settings-dropdown-container">
            <label className="settings-label">테마</label>
            <div className={`settings-dropdown ${isThemeOpen ? 'open' : ''}`}>
              <button
                className="settings-dropdown-trigger"
                onClick={() => {
                  setIsThemeOpen(!isThemeOpen);
                  setIsFontOpen(false);
                }}
              >
                <span className="theme-color-preview" data-theme-preview={currentTheme} />
                <span>{currentThemeName}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {isThemeOpen && (
                <div className="settings-dropdown-menu">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      className={`settings-dropdown-item ${currentTheme === theme.id ? 'active' : ''}`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <span className="theme-color-preview" data-theme-preview={theme.id} />
                      <span>{theme.name}</span>
                      {currentTheme === theme.id && <span className="item-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 폰트 선택 드롭다운 */}
          <div className="settings-dropdown-container">
            <label className="settings-label">폰트</label>
            <div className={`settings-dropdown ${isFontOpen ? 'open' : ''}`}>
              <button
                className="settings-dropdown-trigger"
                onClick={() => {
                  setIsFontOpen(!isFontOpen);
                  setIsThemeOpen(false);
                }}
              >
                <span style={{ fontFamily: FONT_OPTIONS.find(f => f.id === currentFont)?.family }}>
                  {currentFontName}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {isFontOpen && (
                <div className="settings-dropdown-menu">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.id}
                      className={`settings-dropdown-item ${currentFont === font.id ? 'active' : ''}`}
                      onClick={() => handleFontSelect(font.id)}
                      style={{ fontFamily: font.family }}
                    >
                      <span>{font.name}</span>
                      {currentFont === font.id && <span className="item-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
