# 내장 폰트 기능 추가

# 내장 폰트 기능 추가

## 개요
ThinkStack에 5가지 내장 폰트를 추가하고, 설정 팝업에서 테마와 함께 폰트를 선택할 수 있도록 한다.

## 요구사항

### 지원 폰트
1. **Sarasa Mono K** - 모노스페이스 폰트 (기본값)
2. **프리텐다드 (Pretendard)** - 산세리프
3. **부크크명조체** - 세리프
4. **KoPub돋움체** - 산세리프
5. **메모먼트꾹꾹체** - 손글씨

### 기능 명세
- 설정 버튼(⚙️) 클릭 시 팝업에 "테마 선택"과 "폰트 선택"이 함께 표시
- 선택한 폰트는 localStorage에 저장되어 앱 재시작 후에도 유지
- 폰트 변경 시 앱 전체에 즉시 적용

### 파일 변경 계획
1. **src/types.ts** - Font 타입 및 FONT_OPTIONS 배열 추가
2. **src/utils/fontStorage.ts** - 폰트 저장/불러오기 유틸리티 (themeStorage.ts 참고)
3. **src/components/ThemeSelector.tsx** → **src/components/SettingsPanel.tsx**로 리네임 및 폰트 선택 UI 추가
4. **src/components/InputBar.tsx** - 폰트 관련 props 전달
5. **src/App.tsx** - 폰트 상태 관리 및 적용 로직 추가
6. **src/styles.css** - @font-face 선언 및 폰트 변수 적용

### CDN 폰트 URL
- Sarasa Mono K: https://cdn.jsdelivr.net/gh/be5invis/Sarasa-Gothic@latest/fonts/ttf/SarasaMonoK-Regular.ttf
- Pretendard: https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.css
- 부크크명조체: https://cdn.jsdelivr.net/gh/fontmeme/bukkuk-font@main/BukkukMyeongjo.woff2
- KoPub돋움체: https://cdn.jsdelivr.net/gh/fontmeme/kopub-font@main/KoPubDotum.woff2
- 메모먼트꾹꾹체: https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/MemomentKkukkak.woff2

### UI/UX
- 테마 선택과 폰트 선택은 같은 팝업 내에 섹션으로 구분
- 각 폰트는 폰트 이름을 해당 폰트 스타일로 미리보기 표시
- 현재 선택된 항목은 체크 표시(✓)로 표시

