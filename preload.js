const { contextBridge, ipcRenderer } = require("electron");
const { shell } = require("electron");

contextBridge.exposeInMainWorld("system", {
  openPath: (path) => shell.openPath(path),
});

contextBridge.exposeInMainWorld("electronAPI", {
  openFileDialog: (filters = []) =>
    ipcRenderer.invoke("open-file-dialog", filters),
  launchGame: (exePath) => ipcRenderer.send("launch-game", exePath),
});
