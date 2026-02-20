import { Font, DEFAULT_FONT, FONT_OPTIONS } from '../types';

const FONT_STORAGE_KEY = 'thinkstack-font';

// 유효한 폰트 문자열인지 검증하는 타입 가드
export function isValidFont(value: string): value is Font {
  return FONT_OPTIONS.some((font) => font.id === value);
}

// localStorage에서 저장된 폰트 가져오기
export function getSavedFont(): Font | null {
  try {
    const stored = localStorage.getItem(FONT_STORAGE_KEY);
    if (stored && isValidFont(stored)) {
      return stored;
    }
  } catch {
    // localStorage 사용 불가 시 (예: 프라이빗 브라우징 모드) 무시
  }
  return null;
}

// 폰트를 localStorage에 저장
export function saveFont(font: Font): void {
  try {
    localStorage.setItem(FONT_STORAGE_KEY, font);
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

// 초기 폰트 설정 (localStorage 값 또는 기본값)
export function getInitialFont(): Font {
  return getSavedFont() || DEFAULT_FONT;
}

// 폰트 ID로 폰트 정보 가져오기
export function getFontInfo(fontId: Font) {
  return FONT_OPTIONS.find((font) => font.id === fontId);
}
