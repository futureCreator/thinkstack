import { Theme, DEFAULT_THEME, THEME_OPTIONS } from '../types';

const THEME_STORAGE_KEY = 'thinkstack-theme';

// 유효한 테마 문자열인지 검증하는 타입 가드
export function isValidTheme(value: string): value is Theme {
  return THEME_OPTIONS.some((theme) => theme.id === value);
}

// localStorage에서 저장된 테마 가져오기
export function getSavedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isValidTheme(stored)) {
      return stored;
    }
  } catch {
    // localStorage 사용 불가 시 (예: 프라이빗 브라우징 모드) 무시
  }
  return null;
}

// 테마를 localStorage에 저장
export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

// 초기 테마 설정 (localStorage 값 또는 기본값)
export function getInitialTheme(): Theme {
  return getSavedTheme() || DEFAULT_THEME;
}
