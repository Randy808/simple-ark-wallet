use std::process::Command;
use std::fs;
use std::path::{PathBuf, Path};
use std::sync::OnceLock;


fn read_bark_path() -> Option<String> {
	let path = format!("{}/ark-wallet/bark_config.txt",  dirs::data_dir().unwrap().display());
    let config_path =  Path::new(&path);

    std::fs::read_to_string(config_path).ok()
}

fn get_bark_directory() -> String {
	let bark_path = read_bark_path().unwrap();
    format!("{bark_path}/bark")
}

fn get_bark_command() -> Command {
	let mut command = Command::new(get_bark_directory());
	command
}

#[tauri::command]
async fn get_balance() -> Result<String, String> {
    let mut command = get_bark_command();
    command.arg("balance");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[tauri::command]
async fn send_money(pubkey: String, amount: u32) -> Result<String, String> {
    let mut command = get_bark_command();
    command.arg(format!("send"));
    command.arg(pubkey);
    command.arg(format!("{amount}sats"));
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[tauri::command]
async fn movements() -> Result<String, String> {
    let mut command = get_bark_command();
    command.arg("movements");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[tauri::command]
async fn get_vtxos() -> Result<String, String> {
    let mut command = get_bark_command();
    command.arg("vtxos");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[tauri::command]
async fn refresh() -> Result<String, String> {
    let mut command = get_bark_command();
    command.arg("refresh");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[tauri::command]
async fn vtxo_pubkey() -> Result<String, String> {
    let mut command = get_bark_command();
    command.arg("vtxo-pubkey");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_balance, send_money, vtxo_pubkey, get_vtxos, refresh])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
