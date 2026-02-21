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
- **Tabs** — organize items into categories (Work, Ideas, Today, Personal)
  - Each tab maintains its own item stack
  - Double-click a tab to customize its emoji icon
  - Item count badges on each tab
- **Keyboard shortcuts**:
  - `Ctrl+Shift+T` — focus the input field (global, works even when app is not focused)
  - `Ctrl+Shift+P` — toggle always-on-top pin
- **Slash commands**:
  - `/del {number}` — delete item by its number
  - `/edit {number}` — edit item by its number inline
  - `/pop` — remove the top (most recent) item
  - `/clear` — remove all items
  - `/tab {name}` — switch tabs (e.g., `/tab work`, `/tab ideas`)
  - `/tabs` — list available tabs

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
  App.tsx         ← Main component (input + item list + drag-and-drop + tabs)
  types.ts        ← TypeScript interfaces
  styles.css      ← Global styles
  components/
    InputBar.tsx   ← Input field + pin button + settings
    StackItem.tsx  ← Item renderer (drag handle, age badge, edit mode)
    EmptyState.tsx ← Empty state with command/shortcut guide
    Tabs.tsx       ← Tab bar with emoji customization
  hooks/
    useStore.ts    ← Tauri store hook (data persistence with tabs)
    useCommands.ts ← Slash command handler
  utils/
    timeAge.ts     ← Elapsed time formatter
    themeStorage.ts ← Theme persistence
    fontStorage.ts  ← Font persistence
src-tauri/        ← Tauri/Rust backend
  src/lib.rs      ← App setup, global shortcut registration
  src/main.rs     ← Tauri entry point
  tauri.conf.json ← Tauri settings (window size, title, permissions)
```

## License

ISC
