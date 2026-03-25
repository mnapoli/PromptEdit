mod commands;

use commands::AppState;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // In dev mode, Tauri passes extra args. Find the first arg that looks like a file path.
    let file_path = std::env::args()
        .skip(1)
        .find(|a| !a.starts_with('-'))
        .unwrap_or_default();
    #[cfg(debug_assertions)]
    eprintln!("[PromptEdit] file_path={:?}", file_path);
    let content = if !file_path.is_empty() {
        std::fs::read_to_string(&file_path).unwrap_or_default()
    } else if cfg!(debug_assertions) {
        "## Test prompt\n\nHello **world**, this is `inline code`.\n\n> A blockquote\n\n@src/main.tsx is mentioned here.\n".to_string()
    } else {
        String::new()
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .manage(Mutex::new(AppState {
            file_path,
            initial_content: content,
        }))
        .invoke_handler(tauri::generate_handler![
            commands::get_file_info,
            commands::list_project_files,
            commands::save_and_quit,
            commands::quit_without_save,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
