use std::process::Command;
use std::fs;
use std::path::{PathBuf, Path};
use std::sync::OnceLock;

static PATH: OnceLock<String> = OnceLock::new();

pub fn get_path() -> Option<&'static String> {
    PATH.get()
}

fn read_bark_path() -> Option<String> {
	let path = get_path();

	if path.is_none() {
		return None;
	}

    let config_path =  Path::new(path.unwrap());

    std::fs::read_to_string(config_path).ok()
}

fn get_bark_directory() -> String {
	// let bark_path = read_bark_path().unwrap_or(String::from(""));
	let bark_path = "";
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

#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JavaScript!");
}

#[tauri::command]
fn set_path(path: String) {
    PATH.set(path).ok();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_balance, send_money, set_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
