# ThinkStack

A minimal stack-based memo app for Windows, built with Tauri + React.

When juggling multiple tasks in parallel, your head gets cluttered. Trying to remember everything pulls focus away from the task at hand. ThinkStack lets you **offload those thoughts into a visual stack** instead of keeping them piled up in your mind. Dump it the moment it comes up, knock them out one by one, and clear your head.

Type text and press Enter — items stack up in LIFO order. Simple, always-on-top, and distraction-free.

## Features

- **Stack (LIFO) structure** — new items appear at the top
- **Always-on-top window** — stays visible over other apps (pin/unpin toggle)
- **Inline editing** — double-click an item or use `/edit` command to edit in place
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
  App.tsx         ← Main component (input + item list)
  styles.css      ← Global styles
src-tauri/        ← Tauri/Rust backend
  src/lib.rs      ← App setup, global shortcut registration
  src/main.rs     ← Tauri entry point
  tauri.conf.json ← Tauri settings (window size, title, permissions)
```

## License

ISC
