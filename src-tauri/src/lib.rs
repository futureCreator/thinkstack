use tauri::Manager;
use tauri::Emitter;

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
