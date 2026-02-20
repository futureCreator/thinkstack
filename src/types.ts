export interface StackItem {
  id: number;
  text: string;
  createdAt: number; // Date.now() 타임스탬프
}

// 테마 타입 정의
export type Theme = 'ayu' | 'one-dark' | 'dracula' | 'tokyonight' | 'zenburn' | 'monokai';

export interface ThemeInfo {
  id: Theme;
  name: string;
}

export const THEME_OPTIONS: ThemeInfo[] = [
  { id: 'ayu', name: 'Ayu' },
  { id: 'one-dark', name: 'One Dark' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'tokyonight', name: 'Tokyo Night' },
  { id: 'zenburn', name: 'Zenburn' },
  { id: 'monokai', name: 'Monokai' },
];

export const DEFAULT_THEME: Theme = 'tokyonight';
