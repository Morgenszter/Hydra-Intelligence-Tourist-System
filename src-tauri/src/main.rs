#[tauri::command]
fn log_telemetry(message: String) -> String {
    format!("[RUST HARDWARE LOG]: {}", message)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![log_telemetry])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
