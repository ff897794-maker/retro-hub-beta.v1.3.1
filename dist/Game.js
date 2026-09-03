export const Game = {
  launch(game) {
    if (!game) return;

    // Jeu Steam
    if (game.steam && game.appid) {
      const url = `steam://rungameid/${game.appid}`;
      window.electronAPI.launchGame(url);
      return;
    }

    // Jeu classique
    if (game.exe && game.exe.trim() !== "") {
      window.electronAPI.launchGame(game.exe);
    }
  },

  delete(index, games, saveGames, renderGrid) {
    const game = games[index];
    if (!game) return;

    if (!confirm(`Supprimer "${game.name}" ?`)) return;

    delete games[index];
    saveGames();
    renderGrid();
  },
};
