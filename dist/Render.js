import { saveGames } from "./Storage";
import Sortable from "../libs/sortable.esm.js";

export function renderGrid() {
  const baseGrid = document.getElementById("gameGrid");

  const grids = {
    base: baseGrid,
    retro90: document.getElementById("grid-retro90"),
    early2000: document.getElementById("grid-2000"),
    modern: document.getElementById("grid-modern"),
  };

  // Vider les grilles
  Object.values(grids).forEach((g) => (g.innerHTML = ""));

  // Nettoyer les jeux (éviter les undefined)
  games = games.filter((g) => g);

  // Afficher les cartes
  games.forEach((game, index) => {
    const era = game.era || "base";

    const card = GameCard.create(game, index, {
      onLaunch: Game.launch,
      onDelete: (i) => Game.delete(i, games, saveGames, renderGrid),
      onEdit: openEditModal,
    });

    grids[era].appendChild(card);
  });

  // Ajouter un slot dans chaque grille
  Object.keys(grids).forEach((era) => {
    const realIndex = games.length; // index global
    const slot = GameCard.createEmptySlot(realIndex, era); // 👉 plus de callback
    grids[era].appendChild(slot);
  });

  applyFilters();
  enableSortable();
}

export function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const steam = steamFilter ? steamFilter.value : "all";

  document.querySelectorAll(".game-card").forEach((card) => {
    const index = card.dataset.index;
    const game = games[index];
    if (!game) return;

    let visible = true;

    if (search && !game.name.toLowerCase().includes(search)) visible = false;
    if (category !== "all" && game.category !== category) visible = false;

    if (steam === "steam" && !game.steam) visible = false;
    if (steam === "nonsteam" && game.steam) visible = false;

    card.style.display = visible ? "" : "none";
  });
}

export function enableSortable() {
  const grids = {
    base: document.getElementById("gameGrid"),
    retro90: document.getElementById("grid-retro90"),
    early2000: document.getElementById("grid-2000"),
    modern: document.getElementById("grid-modern"),
  };

  Object.keys(grids).forEach((era) => {
    const grid = grids[era];
    if (!grid) {
      console.warn("Grille introuvable pour :", era);
      return;
    }

    new Sortable(grid, {
      animation: 150,
      group: { name: era, pull: false, put: false },
      filter: ".empty-slot",
      preventOnFilter: false,
      onEnd: (evt) => reorderWithinEra(era, evt.oldIndex, evt.newIndex),
    });
  });
}

export function reorderWithinEra(era, oldIndex, newIndex) {
  const eraGames = games.filter((g) => g.era === era);

  const moved = eraGames.splice(oldIndex, 1)[0];
  eraGames.splice(newIndex, 0, moved);

  const others = games.filter((g) => g.era !== era);
  games = [...others, ...eraGames];

  saveGames();
  renderGrid();
}
