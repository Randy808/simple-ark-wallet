import React, { useEffect, useState } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import Transactions from "./pages/Transactions";
import SeedPhrase from "./pages/SeedPhrase";
import Settings from "./pages/Settings";
import { useWallet, WalletProvider } from "./context/WalletContext";
import { exists, readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import Setup from "./pages/Setup";
import CreateWallet from "./pages/CreateWallet";

function App() {
  const [activePage, setActivePage] = useState<
    | "dashboard"
    | "send"
    | "receive"
    | "transactions"
    | "seed-phrase"
    | "settings"
    | "create-wallet"
  >("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "send":
        return <Send />;
      case "receive":
        return <Receive />;
      case "transactions":
        return <Transactions />;
      case "seed-phrase":
        return <SeedPhrase />;
      case "settings":
        return <Settings />;
      case "create-wallet":
        return <CreateWallet />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  let [configExists, setConfigExists] = useState<boolean | undefined>();

  async function checkIfConfigExists() {
    const filePath = "bark_config.txt";

    console.log(BaseDirectory.AppData);
    // Check if file exists first
    const configExists = await exists(filePath, {
      baseDir: BaseDirectory.AppData,
    });

    let barkPath: string;
    if (configExists) {
      barkPath = await readTextFile(filePath, {
        baseDir: BaseDirectory.AppData,
      });
      console.log("BARK PATH:" + barkPath);
      setConfigExists(true);
      return;
    }

    setConfigExists(false);
  }

  useEffect(() => {
    checkIfConfigExists();
  }, []);

  return (
    (configExists === undefined && <></>) ||
    (configExists === false && (
      <Setup onContinue={() => setConfigExists(true)} />
    )) ||
    (configExists && (
      <WalletProvider>
        <Layout activePage={activePage} setActivePage={setActivePage}>{renderPage()}</Layout>
      </WalletProvider>
    ))
  );
}

export default App;
