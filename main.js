const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const { execFile } = require("child_process");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./dist/index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// --- Nouveau handler pour ouvrir un explorateur ---
ipcMain.handle("open-file-dialog", async (_event, filters) => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: filters.length
      ? filters
      : [{ name: "Tous les fichiers", extensions: ["*"] }],
  });
  return result.canceled ? null : result.filePaths[0];
});

// --- Handler existant pour lancer un jeu ---
ipcMain.on("launch-game", (_event, exePath) => {
  const cleanPath = exePath.replace(/^"(.*)"$/, "$1");

  if (cleanPath.startsWith("steam://")) {
    shell.openExternal(cleanPath).catch((err) => {
      console.error("Erreur lancement Steam:", err);
    });
  } else if (cleanPath.toLowerCase().endsWith(".lnk")) {
    execFile("explorer.exe", [cleanPath], (error) => {
      if (error) {
        console.error("Erreur lancement raccourci:", error);
      } else {
        console.log("Raccourci lancé avec succès!");
      }
    });
  } else {
    execFile(cleanPath, { cwd: path.dirname(cleanPath) }, (error) => {
      if (error) {
        console.error("Erreur lancement jeu:", error);
      } else {
        console.log("Jeu .exe lancé avec succès!");
      }
    });
  }
});
