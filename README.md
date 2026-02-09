# ThinkStack

A minimal stack-based memo app for Windows, built with Tauri + React.

Type text and press Enter — items stack up in LIFO order. Simple, always-on-top, and distraction-free.

## Features

- **Stack (LIFO) structure** — new items appear at the top
- **Always-on-top window** — stays visible over other apps (pin/unpin toggle)
- **Data persistence** — items are saved automatically and restored on restart
- **Keyboard shortcuts**:
  - `Ctrl+Shift+T` — focus the input field (global, works even when app is not focused)
  - `Ctrl+Shift+P` — toggle always-on-top pin
- **Slash commands**:
  - `/del {number}` — delete item by its number
  - `/pop` — remove the top (most recent) item
  - `/clear` — remove all items
- **Korean IME support** — proper handling of CJK input composition

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend/Desktop**: Tauri v2 (Rust)
- **Target OS**: Windows

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://www.rust-lang.org/tools/install)

### Development

```bash
npm install
npm run tauri dev
```

### Production Build (Windows)

```bash
npm run tauri build
```

Generates installer files in `src-tauri/target/release/bundle/`:
- `nsis/ThinkStack_*_x64-setup.exe`
- `msi/ThinkStack_*_x64_en-US.msi`

## Project Structure

```
src/              ← React frontend
  App.tsx         ← Main component (input + item list)
src-tauri/        ← Tauri/Rust backend
  src/main.rs     ← Tauri entry point, window config
  tauri.conf.json ← Tauri settings (window size, title, permissions)
```

## License

ISC
