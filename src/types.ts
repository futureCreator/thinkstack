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

// 폰트 타입 정의
export type Font = 'sarasa-mono' | 'pretendard' | 'bukkuk-myeongjo' | 'kopub-dotum' | 'gangwon-edu';

export interface FontInfo {
  id: Font;
  name: string;
  family: string;
  cdn: string;
}

export const FONT_OPTIONS: FontInfo[] = [
  {
    id: 'sarasa-mono',
    name: 'Sarasa Mono K',
    family: '"Sarasa Mono K", "Consolas", monospace',
    cdn: 'https://cdn.jsdelivr.net/gh/be5invis/Sarasa-Gothic@latest/fonts/ttf/SarasaMonoK-Regular.ttf'
  },
  {
    id: 'pretendard',
    name: '프리텐다드',
    family: '"Pretendard", "Malgun Gothic", sans-serif',
    cdn: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.css'
  },
  {
    id: 'bukkuk-myeongjo',
    name: '부크크명조체',
    family: '"Bukkuk Myeongjo", "Times New Roman", serif',
    cdn: 'https://cdn.jsdelivr.net/gh/fontmeme/bukkuk-font@main/BukkukMyeongjo.woff2'
  },
  {
    id: 'kopub-dotum',
    name: 'KoPub돋움체',
    family: '"KoPub Dotum", "Malgun Gothic", sans-serif',
    cdn: 'https://cdn.jsdelivr.net/gh/fontmeme/kopub-font@main/KoPubDotum.woff2'
  },
  {
    id: 'gangwon-edu',
    name: '강원교육모두체',
    family: '"Gangwon Edu", "Malgun Gothic", cursive',
    cdn: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEdu_OTFBoldA.woff'
  },
];

export const DEFAULT_FONT: Font = 'sarasa-mono';
