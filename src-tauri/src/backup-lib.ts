use std::process::Command;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, api::path::app_data_dir};
use std::sync::OnceLock;


static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();

pub fn set_app_handle(app: AppHandle) {
    APP_HANDLE.set(app).ok();
}

pub fn get_app_handle() -> &'static AppHandle {
    APP_HANDLE.get().expect("AppHandle not set")
}

fn read_bark_path() -> Option<String> {
    // Get the AppData directory from the AppHandle
    let path = app_data_dir(get_app_handle().config())?.join("bark_config.txt");

    match fs::read_to_string(&path) {
        Ok(contents) => Some(contents),
        Err(_) => None,
    }
}

fn get_bark_directory() -> String {
	let bark_path = read_bark_path().unwrap_or(String::from(""));
    format!("{bark_path}/bark")
}

#[tauri::command]
fn get_balance() -> Result<String, String> {
    let mut command = Command::new(get_bark_directory());
    command.arg("balance");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[tauri::command]
fn send_money(pubkey: String, amount: u32) -> Result<String, String> {
    let mut command = Command::new(get_bark_directory());
    command.arg(format!("send"));
    command.arg(pubkey);
    command.arg(format!("{amount}sats"));
    let output = command.output().map_err(|err| err.to_string())?;
    return movements();
}

#[tauri::command]
fn movements() -> Result<String, String> {
    let mut command = Command::new(get_bark_directory());
    command.arg("movements");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_balance, send_money])
		.setup(|app| {
            set_app_handle(app.handle().clone()); // Save the handle globally
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
