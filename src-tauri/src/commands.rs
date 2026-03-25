use ignore::WalkBuilder;
use serde::Serialize;
use std::sync::Mutex;
use tauri::{AppHandle, State};

pub struct AppState {
    pub file_path: String,
    pub initial_content: String,
}

#[derive(Serialize)]
pub struct FileInfo {
    pub path: String,
    pub content: String,
}

#[tauri::command]
pub fn get_file_info(state: State<'_, Mutex<AppState>>) -> FileInfo {
    let state = state.lock().unwrap();
    FileInfo {
        path: state.file_path.clone(),
        content: state.initial_content.clone(),
    }
}

#[tauri::command]
pub fn list_project_files() -> Vec<String> {
    let cwd = std::env::current_dir().unwrap_or_default();
    let mut files = Vec::new();
    let walker = WalkBuilder::new(&cwd)
        .hidden(true)
        .git_ignore(true)
        .git_global(false)
        .git_exclude(true)
        .max_depth(Some(20))
        .build();

    for entry in walker.flatten() {
        if entry.file_type().map_or(false, |ft| ft.is_file()) {
            if let Ok(rel) = entry.path().strip_prefix(&cwd) {
                files.push(rel.to_string_lossy().to_string());
            }
        }
        if files.len() >= 10_000 {
            break;
        }
    }
    files
}

#[tauri::command]
pub fn save_and_quit(app: AppHandle, state: State<'_, Mutex<AppState>>, content: String) {
    let state = state.lock().unwrap();
    if !state.file_path.is_empty() {
        let _ = std::fs::write(&state.file_path, &content);
    }
    app.exit(0);
}

#[tauri::command]
pub fn quit_without_save(app: AppHandle) {
    app.exit(0);
}
