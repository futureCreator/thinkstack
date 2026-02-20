## Project Context

### CLAUDE.md

```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**ThinkStack** — Tauri + React 기반 Windows 데스크톱 스택 메모 애플리케이션.
텍스트를 입력하면 스택(LIFO) 구조로 아이템이 쌓이는 간단한 메모 도구.

## 핵심 동작

- 창은 항상 최상위(always-on-top)로 표시
- 상단 입력창에 텍스트 입력 후 Enter → 하단 목록의 **맨 위에** 새 아이템 추가
- 각 아이템에는 순번(1부터)과 삭제(X) 버튼 표시
- 슬래시 명령어 지원:
  - `/delete {번호}` — 해당 번호의 아이템 삭제
  - `/pop` — 맨 위(최신) 아이템 삭제

## 기술 스택

- **프론트엔드**: React + TypeScript + Vite
- **백엔드/데스크톱**: Tauri (Rust)
- **대상 OS**: Windows

## 빌드 및 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Tauri 윈도우 + hot reload)
npm run tauri dev

# 프로덕션 빌드 (Windows 설치 파일 생성)
npm run tauri build

# 프론트엔드만 개발 서버 (브라우저에서 확인)
npm run dev

# 린트
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 아키텍처

```
src/              ← React 프론트엔드
  App.tsx         ← 메인 컴포넌트 (입력창 + 아이템 리스트)
  components/     ← UI 컴포넌트
src-tauri/        ← Tauri/Rust 백엔드
  src/main.rs     ← Tauri 진입점, 윈도우 설정 (always-on-top 등)
  tauri.conf.json ← Tauri 설정 (윈도우 크기, 제목, 권한 등)
```

### 데이터 흐름

1. 사용자가 입력창에 텍스트 입력 → Enter
2. 입력값이 `/`로 시작하면 명령어로 파싱 (`/delete`, `/pop`)
3. 일반 텍스트면 아이템 배열 맨 앞에 추가 (unshift)
4. 아이템 번호는 현재 배열 인덱스 기준으로 동적 할당 (1부터 시작)

## 코드 작성 규칙

- 모든 코드 주석과 문서는 **한국어**로 작성
- 커밋 메시지는 한국어 또는 영어 모두 허용
- GitHub 관련 작업(PR 생성, 이슈 조회 등)은 MCP 도구 대신 `gh` CLI를 우선 사용 (단, PR 수정은 `gh` 버그로 MCP 도구 사용)

```

### README.md

```
# ThinkStack

A minimal stack-based memo app for Windows, built with Tauri + React.

When juggling multiple tasks in parallel, your head gets cluttered. Trying to remember everything pulls focus away from the task at hand. ThinkStack lets you **offload those thoughts into a visual stack** instead of keeping them piled up in your mind. Dump it the moment it comes up, knock them out one by one, and clear your head.

Type text and press Enter — items stack up in LIFO order. Simple, always-on-top, and distraction-free.

## Features

- **Stack (LIFO) structure** — new items appear at the top
- **Always-on-top window** — stays visible over other apps (pin/unpin toggle)
- **Drag-and-drop reordering** — drag items to rearrange the stack
- **Inline editing** — double-click an item or use `/edit` command to edit in place
- **Item age display** — shows elapsed time since creation (e.g., "5min ago", "2hr ago")
- **Data persistence** — items are saved automatically and restored on restart
- **Keyboard shortcuts**:
  - `Ctrl+Shift+T` — focus the input field (global, works even when app is not focused)
  - `Ctrl+Shift+P` — toggle always-on-top pin
- **Slash commands**:
  - `/del {number}` — delete item by its number
  - `/edit {number}` — edit item by its number inline
  - `/pop` — remove the top (most recent) item
  - `/clear` — remove all items

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend/Desktop**: Tauri v2 (Rust)
- **Target OS**: Windows

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://www.rust-lang.org/tools/install)

### Development

```bash
npm install
npm run tauri:dev
```

### Production Build (Windows)

```bash
npm run tauri:build
```

Generates installer files in `src-tauri/target/release/bundle/`:
- `nsis/ThinkStack_*_x64-setup.exe`
- `msi/ThinkStack_*_x64_en-US.msi`

## Project Structure

```
src/              ← React frontend
  App.tsx         ← Main component (input + item list + drag-and-drop)
  types.ts        ← TypeScript interfaces
  styles.css      ← Global styles
  components/
    InputBar.tsx   ← Input field + pin button
    StackItem.tsx  ← Item renderer (drag handle, age badge, edit mode)
    EmptyState.tsx ← Empty state with command/shortcut guide
  hooks/
    useStore.ts    ← Tauri store hook (data persistence)
    useCommands.ts ← Slash command handler
  utils/
    timeAge.ts     ← Elapsed time formatter
src-tauri/        ← Tauri/Rust backend
  src/lib.rs      ← App setup, global shortcut registration
  src/main.rs     ← Tauri entry point
  tauri.conf.json ← Tauri settings (window size, title, permissions)
```

## License

ISC

```

### SPEC.md

```
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

```

### src/hooks/useCommands.ts

```
import type { StackItem } from "../types";

interface UseCommandsParams {
  items: StackItem[];
  deleteItem: (index: number) => void;
  startEditing: (id: number) => void;
  setItems: React.Dispatch<React.SetStateAction<StackItem[]>>;
}

export function useCommands({
  items,
  deleteItem,
  startEditing,
  setItems,
}: UseCommandsParams) {
  const handleCommand = (cmd: string) => {
    const parts = cmd.split(/\s+/);
    const command = parts[0].toLowerCase();

    if (command === "/del" && parts[1]) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num >= 1) {
        // 번호는 1부터 시작, 배열 인덱스는 0부터
        deleteItem(num - 1);
      }
    } else if (command === "/pop") {
      // 맨 위(첫 번째) 아이템 삭제
      deleteItem(0);
    } else if (command === "/edit" && parts[1]) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num >= 1 && num <= items.length) {
        startEditing(items[num - 1].id);
      }
    } else if (command === "/clear") {
      // 모든 아이템 삭제
      setItems([]);
    }
  };

  return { handleCommand };
}

```

### src/hooks/useStore.ts

```
import { useState, useRef, useEffect } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";
import type { StackItem } from "../types";

const store = new LazyStore("store.json");

export function useStore() {
  const [items, setItems] = useState<StackItem[]>([]);
  const nextIdRef = useRef(1);
  const isLoadedRef = useRef(false);

  // 앱 시작 시 저장된 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const savedItems = await store.get<StackItem[]>("items");
        const savedNextId = await store.get<number>("nextId");
        if (savedItems) {
          const now = Date.now();
          const migrated = savedItems.map((item) => ({
            ...item,
            createdAt: item.createdAt ?? now,
          }));
          setItems(migrated);
        }
        if (savedNextId) nextIdRef.current = savedNextId;
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      } finally {
        isLoadedRef.current = true;
      }
    })();
  }, []);

  // items 변경 시 자동 저장
  useEffect(() => {
    if (!isLoadedRef.current) return;

    (async () => {
      try {
        await store.set("items", items);
        await store.set("nextId", nextIdRef.current);
      } catch (e) {
        console.error("데이터 저장 실패:", e);
      }
    })();
  }, [items]);

  // 새 아이템을 맨 위에 추가
  const addItem = (text: string) => {
    setItems((prev) => [{ id: nextIdRef.current++, text, createdAt: Date.now() }, ...prev]);
  };

  return { items, setItems, addItem };
}

```

### src/types.ts

```
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

```

### src/utils/themeStorage.ts

```
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

```

### src/utils/timeAge.ts

```
// 경과 시간 포맷 유틸
export function formatAge(createdAt: number): string {
  const diff = Math.floor((Date.now() - createdAt) / 1000);
  if (diff < 60) return "방금";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  return `${Math.floor(diff / 2592000)}개월 전`;
}

```

### src/vite-env.d.ts

```
/// <reference types="vite/client" />

```

### src-tauri/build.rs

```
fn main() {
  tauri_build::build()
}

```

### src-tauri/src/lib.rs

```
use tauri::Manager;
use tauri::Emitter;

/// Windows에서 백그라운드 앱이 포그라운드로 전환할 수 있도록 하는 workaround.
/// Alt 키를 눌러 Windows의 포그라운드 잠금을 우회한 뒤 SetForegroundWindow를 호출한다.
#[cfg(windows)]
fn force_foreground(window: &tauri::WebviewWindow) {
  use std::ffi::c_void;

  extern "system" {
    fn SetForegroundWindow(hwnd: *mut c_void) -> i32;
    fn keybd_event(b_vk: u8, b_scan: u8, dw_flags: u32, dw_extra_info: usize);
  }

  const VK_MENU: u8 = 0x12;
  const KEYEVENTF_KEYUP: u32 = 0x0002;

  if let Ok(hwnd) = window.hwnd() {
    unsafe {
      keybd_event(VK_MENU, 0, 0, 0);
      SetForegroundWindow(hwnd.0);
      keybd_event(VK_MENU, 0, KEYEVENTF_KEYUP, 0);
    }
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::new().build())
    .setup(|app| {
      let window = app.get_webview_window("main").unwrap();
      window.set_always_on_top(true)?;

      // 글로벌 단축키 등록 (Ctrl+Shift+T)
      #[cfg(desktop)]
      {
        use tauri_plugin_global_shortcut::{
          Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
        };

        let shortcut = Shortcut::new(
          Some(Modifiers::CONTROL | Modifiers::SHIFT),
          Code::KeyT,
        );

        let win = window.clone();
        app.handle().plugin(
          tauri_plugin_global_shortcut::Builder::new()
            .with_handler(move |app, scut, event| {
              if scut == &shortcut && event.state() == ShortcutState::Pressed {
                let _ = win.unminimize();
                let _ = win.show();

                #[cfg(windows)]
                force_foreground(&win);

                let _ = win.set_focus();
                let _ = app.emit("global-shortcut-activated", ());
              }
            })
            .build(),
        )?;

        app.global_shortcut().register(shortcut)?;
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

```

### src-tauri/src/main.rs

```
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  app_lib::run();
}

```

### src-tauri/target/debug/build/selectors-59ff747c98e5f4d1/out/ascii_case_insensitive_html_attributes.rs

```
{ static SET: ::phf::Set<&'static str> = ::phf::Set { map: ::phf::Map {
    key: 732231254413039614,
    disps: ::phf::Slice::Static(&[
        (2, 10),
        (1, 0),
        (3, 12),
        (2, 12),
        (37, 1),
        (2, 4),
        (5, 5),
        (11, 9),
        (1, 0),
        (0, 22),
    ]),
    entries: ::phf::Slice::Static(&[
        ("nowrap", ()),
        ("noresize", ()),
        ("target", ()),
        ("alink", ()),
        ("media", ()),
        ("dir", ()),
        ("disabled", ()),
        ("rev", ()),
        ("align", ()),
        ("hreflang", ()),
        ("compact", ()),
        ("lang", ()),
        ("readonly", ()),
        ("selected", ()),
        ("color", ()),
        ("frame", ()),
        ("vlink", ()),
        ("link", ()),
        ("valign", ()),
        ("direction", ()),
        ("axis", ()),
        ("charset", ()),
        ("rel", ()),
        ("method", ()),
        ("language", ()),
        ("http-equiv", ()),
        ("shape", ()),
        ("bgcolor", ()),
        ("clear", ()),
        ("text", ()),
        ("noshade", ()),
        ("multiple", ()),
        ("checked", ()),
        ("accept", ()),
        ("nohref", ()),
        ("codetype", ()),
        ("scope", ()),
        ("valuetype", ()),
        ("type", ()),
        ("accept-charset", ()),
        ("face", ()),
        ("rules", ()),
        ("enctype", ()),
        ("scrolling", ()),
        ("defer", ()),
        ("declare", ()),
    ]),
} }; &SET }
```

### src-tauri/target/debug/build/selectors-c5d211e76450fb1e/out/ascii_case_insensitive_html_attributes.rs

```
{ static SET: ::phf::Set<&'static str> = ::phf::Set { map: ::phf::Map {
    key: 732231254413039614,
    disps: ::phf::Slice::Static(&[
        (2, 10),
        (1, 0),
        (3, 12),
        (2, 12),
        (37, 1),
        (2, 4),
        (5, 5),
        (11, 9),
        (1, 0),
        (0, 22),
    ]),
    entries: ::phf::Slice::Static(&[
        ("nowrap", ()),
        ("noresize", ()),
        ("target", ()),
        ("alink", ()),
        ("media", ()),
        ("dir", ()),
        ("disabled", ()),
        ("rev", ()),
        ("align", ()),
        ("hreflang", ()),
        ("compact", ()),
        ("lang", ()),
        ("readonly", ()),
        ("selected", ()),
        ("color", ()),
        ("frame", ()),
        ("vlink", ()),
        ("link", ()),
        ("valign", ()),
        ("direction", ()),
        ("axis", ()),
        ("charset", ()),
        ("rel", ()),
        ("method", ()),
        ("language", ()),
        ("http-equiv", ()),
        ("shape", ()),
        ("bgcolor", ()),
        ("clear", ()),
        ("text", ()),
        ("noshade", ()),
        ("multiple", ()),
        ("checked", ()),
        ("accept", ()),
        ("nohref", ()),
        ("codetype", ()),
        ("scope", ()),
        ("valuetype", ()),
        ("type", ()),
        ("accept-charset", ()),
        ("face", ()),
        ("rules", ()),
        ("enctype", ()),
        ("scrolling", ()),
        ("defer", ()),
        ("declare", ()),
    ]),
} }; &SET }
```

### src-tauri/target/debug/build/serde-210023597896b101/out/private.rs

```
#[doc(hidden)]
pub mod __private228 {
    #[doc(hidden)]
    pub use crate::private::*;
}
use serde_core::__private228 as serde_core_private;

```

### src-tauri/target/debug/build/serde-a53ce7e3270db625/out/private.rs

```
#[doc(hidden)]
pub mod __private228 {
    #[doc(hidden)]
    pub use crate::private::*;
}
use serde_core::__private228 as serde_core_private;

```

### src-tauri/target/debug/build/serde_core-8b14f0de7f71706b/out/private.rs

```
#[doc(hidden)]
pub mod __private228 {
    #[doc(hidden)]
    pub use crate::private::*;
}

```

### src-tauri/target/debug/build/serde_core-c3bbe2ef5fb7bfd9/out/private.rs

```
#[doc(hidden)]
pub mod __private228 {
    #[doc(hidden)]
    pub use crate::private::*;
}

```

### src-tauri/target/debug/build/target-lexicon-fe7a85c9487407a4/out/host.rs

```

#[allow(unused_imports)]
use crate::Aarch64Architecture::*;
#[allow(unused_imports)]
use crate::ArmArchitecture::*;
#[allow(unused_imports)]
use crate::CustomVendor;
#[allow(unused_imports)]
use crate::Mips32Architecture::*;
#[allow(unused_imports)]
use crate::Mips64Architecture::*;
#[allow(unused_imports)]
use crate::Riscv32Architecture::*;
#[allow(unused_imports)]
use crate::Riscv64Architecture::*;
#[allow(unused_imports)]
use crate::X86_32Architecture::*;

/// The `Triple` of the current host.
pub const HOST: Triple = Triple {
    architecture: Architecture::X86_64,
    vendor: Vendor::Unknown,
    operating_system: OperatingSystem::Linux,
    environment: Environment::Gnu,
    binary_format: BinaryFormat::Elf,
};

impl Architecture {
    /// Return the architecture for the current host.
    pub const fn host() -> Self {
        Architecture::X86_64
    }
}

impl Vendor {
    /// Return the vendor for the current host.
    pub const fn host() -> Self {
        Vendor::Unknown
    }
}

impl OperatingSystem {
    /// Return the operating system for the current host.
    pub const fn host() -> Self {
        OperatingSystem::Linux
    }
}

impl Environment {
    /// Return the environment for the current host.
    pub const fn host() -> Self {
        Environment::Gnu
    }
}

impl BinaryFormat {
    /// Return the binary format for the current host.
    pub const fn host() -> Self {
        BinaryFormat::Elf
    }
}

impl Triple {
    /// Return the triple for the current host.
    pub const fn host() -> Self {
        Self {
            architecture: Architecture::X86_64,
            vendor: Vendor::Unknown,
            operating_system: OperatingSystem::Linux,
            environment: Environment::Gnu,
            binary_format: BinaryFormat::Elf,
        }
    }
}

```

### src-tauri/target/debug/build/thiserror-7399ea59ce3845b2/out/private.rs

```
#[doc(hidden)]
pub mod __private18 {
    #[doc(hidden)]
    pub use crate::private::*;
}

```

