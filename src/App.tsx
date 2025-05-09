import React, { useEffect, useState } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import Transactions from "./pages/Transactions";
import SeedPhrase from "./pages/SeedPhrase";
import Settings from "./pages/Settings";
import { WalletProvider } from "./context/WalletContext";
import {
  exists,
  writeTextFile,
  readTextFile,
  BaseDirectory,
  mkdir
} from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [activePage, setActivePage] = useState<
    | "dashboard"
    | "send"
    | "receive"
    | "transactions"
    | "seed-phrase"
    | "settings"
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
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  async function initializeApp() {
    const filePath = "bark_config.txt";

    // Check if file exists first
    const configExists = await exists(filePath, {
      baseDir: BaseDirectory.AppData,
    });

    let barkPath: string;

    if (configExists) {
      barkPath = await readTextFile(filePath, {
        baseDir: BaseDirectory.AppData,
      });
    } else {
      // Ask user to pick a directory
      const { open } = await import("@tauri-apps/plugin-dialog");
      const selected = await open({ directory: true });

      if (typeof selected === "string") {
        barkPath = selected;

        // Ensure AppData directory exists (Tauri handles the base directory itself, so you only need to ensure the file-level path is safe)
        await mkdir('', {
          baseDir: BaseDirectory.AppData,
          recursive: true
        });

        await writeTextFile(filePath, barkPath, {
          baseDir: BaseDirectory.AppData,
        });
      } else {
        throw new Error("User did not select a directory.");
      }
    }

    invoke("set_path", {
      path: BaseDirectory.AppData
    })
  }

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <WalletProvider>
      <Layout setActivePage={setActivePage}>{renderPage()}</Layout>
    </WalletProvider>
  );
}

export default App;
