export interface StackItem {
  id: number;
  text: string;
  createdAt: number; // Date.now() 타임스탬프
}

// 테마 타입 정의
export type Theme = 'ayu' | 'one-dark' | 'dracula' | 'tokyonight' | 'zenburn' | 'monokai' | 'solarized-osaka' | 'dolch';

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
  { id: 'solarized-osaka', name: 'Solarized Osaka' },
  { id: 'dolch', name: 'Dolch' },
];

export const DEFAULT_THEME: Theme = 'tokyonight';

// 폰트 타입 정의
export type Font = 'sarasa-mono' | 'pretendard' | 'bukkuk-myeongjo' | 'kopub-dotum';

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
];

export const DEFAULT_FONT: Font = 'sarasa-mono';

// 탭 타입 정의
export type TabId = 'work' | 'ideas' | 'today' | 'personal';

export interface TabInfo {
  id: TabId;
  name: string;
  icon: string;
}

export const TAB_OPTIONS: TabInfo[] = [
  { id: 'work', name: 'Work', icon: 'Briefcase' },
  { id: 'ideas', name: 'Ideas', icon: 'Lightbulb' },
  { id: 'today', name: 'Today', icon: 'CheckSquare' },
  { id: 'personal', name: 'Personal', icon: 'Home' },
];

export const DEFAULT_TAB: TabId = 'work';

// 기본 아이콘 목록 (탭 아이콘 선택용)
export const DEFAULT_TAB_ICONS: Record<TabId, string> = {
  work: 'Briefcase',
  ideas: 'Lightbulb',
  today: 'CheckSquare',
  personal: 'Home',
};

// 사용 가능한 아이콘 목록 (Lucide 아이콘 이름)
export const AVAILABLE_ICONS = [
  'Briefcase', 'Lightbulb', 'CheckSquare', 'Home', 'FileText', 'BarChart3', 'Calendar', 'Star', 'Flame', 'Heart',
  'BookOpen', 'Music', 'Palette', 'Zap', 'Rocket', 'Target', 'Dumbbell', 'Brain', 'Laptop', 'Smartphone',
  'Coffee', 'Clover', 'Sparkles', 'Gem', 'Bell', 'Pin', 'Tag', 'Wand2', 'PartyPopper', 'Rainbow',
  'Cat', 'Dog', 'Fish', 'Bird', 'Coffee', 'Moon', 'Sun', 'Cloud', 'Anchor', 'Plane',
];
