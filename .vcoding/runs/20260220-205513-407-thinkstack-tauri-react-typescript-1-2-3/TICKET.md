# ThinkStack(Tauri+React+TypeScript 스택 메모 �...

ThinkStack(Tauri+React+TypeScript 스택 메모 앱)에 테마 기능을 추가해. 요구사항:
1. 고정핀 버튼 옆에 설정(톱니바퀴) 버튼 추가
2. 설정 버튼 클릭 시 테마 선택 팝업/드롭다운 표시
3. 지원 테마(전부 다크모드만): ayu, one-dark, dracula, tokyonight, zenburn, monokai
4. 선택한 테마는 localStorage에 저장하고 앱 재시작 시 복원
5. CSS 변수 또는 data-theme 속성을 사용한 테마 전환
6. 라이트/시스템 테마는 필요 없음 (다크만 지원)
7. 기존 항목 추가/삭제 기능은 유지

기존 코드 구조:
- src/App.tsx: 메인 컴포넌트 (입력창 + 아이템 리스트)
- src/components/: UI 컴포넌트
- src-tauri/: Tauri 백엔드

필요한 작업:
- 테마 설정 저장/불러오기 유틸리티
- 테마 선택 UI 컴포넌트
- 각 테마별 CSS 변수 정의
- App.tsx에 설정 버튼 및 테마 전환 통합
