use std::process::Command;
use std::fs;
use std::path::{PathBuf, Path};
use std::sync::{OnceLock, Mutex};
use tauri::{Builder, Manager, State};

#[derive(Default)]
struct AppState {
  wallet_name: String,
}

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

fn get_wallet_dir() -> String {
	format!("{}/ark-wallet/wallets",  dirs::data_dir().unwrap().display())
}

fn get_bark_command2(state: State<'_, Mutex<AppState>>) -> Command {
	let mut command = Command::new(get_bark_directory());

	let mut state = state.lock().unwrap();
	command.arg("--datadir");
	command.arg(format!("{}/{}", get_wallet_dir(), &state.wallet_name));
	command
}

#[tauri::command]
async fn get_balance(state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    let mut command = get_bark_command2(state);
    command.arg("balance");
    let output = command.output().map_err(|err| err.to_string())?;

	// This will return warnings as well, which we always get in the form of `Warning from Ark server: "You are running a manual build of bark; it may be incompatible with the server."`
	// if (&output.stderr).len() != 0 {
	// 	return Err(String::from_utf8_lossy(&output.stderr).to_string());
	// }

    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[tauri::command]
async fn send_money(pubkey: String, amount: u32, state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    let mut command = get_bark_command2(state);
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
async fn vtxo_pubkey(state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    let mut command = get_bark_command2(state);
    command.arg("vtxo-pubkey");
    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}


#[tauri::command]
async fn set_wallet(wallet_name: String, state: State<'_, Mutex<AppState>>) -> Result<(), ()> {
    let mut state = state.lock().unwrap();
  	state.wallet_name = wallet_name;
	Ok(())
}

#[tauri::command]
async fn create_wallet(name: String, network: String, asp_url: String, esplora_url: String) -> Result<String, String> {
	let wallet_dir = get_wallet_dir();
	fs::create_dir_all(&wallet_dir).map_err(|err| err.to_string())?;
	let mut command = get_bark_command();
    command.arg("create");
	//create --signet --asp ark.signet.2nd.dev --esplora esplora.signet.2nd.dev
	command.arg(format!("--{}", network));

	command.arg("--asp");
	command.arg(asp_url);

	command.arg("--esplora");
	command.arg(esplora_url);

	command.arg("--datadir");
	command.arg(format!("{}/{}", wallet_dir, name));

    let output = command.output().map_err(|err| err.to_string())?;
    return Ok(String::from_utf8_lossy(&output.stdout).to_string());
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
		.setup(|app| {
			app.manage(Mutex::new(AppState::default()));
			Ok(())
		})
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_balance, send_money, vtxo_pubkey, get_vtxos, refresh, create_wallet, set_wallet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
