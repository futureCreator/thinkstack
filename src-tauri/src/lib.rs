use tauri::Emitter;
use tauri::Manager;

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
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_always_on_top(true)?;

            // 글로벌 단축키 등록 (Ctrl+Shift+T)
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{
                    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
                };

                let shortcut =
                    Shortcut::new(Some(Modifiers::CONTROL | Modifiers::SHIFT), Code::KeyT);

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
