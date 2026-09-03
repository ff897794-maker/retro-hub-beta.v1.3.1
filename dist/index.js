// IMPORTS
import { UI } from "./UI.js";
import { Game } from "./Game.js";
import { GameCard } from "./GameCard.js";

import Sortable from "../libs/sortable.esm.js";

// DOM
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const steamFilter = document.getElementById("steamFilter");
const protectedCategories = ["Plateforme", "Arcade", "RPG", "TPS"];
const deleteHeaderBtn = document.getElementById("delete-category-header");
const confirmModal = document.getElementById("confirm-modal");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");

// STATE
let games = [];
let categories = [];
let categoryToDelete = null;

// LOAD / SAVE / SYNC
function loadGames() {
  const data = localStorage.getItem("retroGames");
  games = data ? JSON.parse(data) : {};
}

function saveGames() {
  localStorage.setItem("retroGames", JSON.stringify(games));
}

function loadCategories() {
  const defaults = ["Plateforme", "Arcade", "RPG", "TPS"];
  const saved = localStorage.getItem("retroCategories");
  categories = saved ? JSON.parse(saved) : [];

  defaults.forEach((def) => {
    if (!categories.includes(def)) categories.push(def);
  });

  localStorage.setItem("retroCategories", JSON.stringify(categories));
}

function syncCategories() {
  categoryFilter.innerHTML = '<option value="all">Toutes</option>';

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// MODAL EDIT
function openEditModal(game, index, isNew = false) {
  UI.modal.show(`
    <div id="dynamicModal"
        class="fixed inset-0 flex items-center justify-center bg-black/60 z-40">

      <div class="relative bg-slate-900 border-2 border-pink-700 p-4 rounded w-80 shadow-xl z-30">
        <h2 class="text-lg mb-2 underline">Modifier le jeu</h2>

        <input id="editName" placeholder="Nom du jeu" class="input w-full mb-2 required" value="${game.name || ""}" />

        <label>Catégorie</label>
        <select id="editCategory" class="input w-full mb-2 bg-slate-900 text-white"></select>

        <div class="flex gap-2 mb-2">
          <input id="newCategoryInput" class="input flex-1" placeholder="Nouvelle catégorie">
          <button id="addCategoryBtn" class="btn-small border p-1 rounded-lg">Ajouter</button>
        </div>

        <label>Époque / Famille</label>
        <select id="editEra" class="input w-full mb-2 bg-slate-900 text-white">
          <option value="base">Non classé</option>
          <option value="retro90">Retro 90s</option>
          <option value="early2000">Années 2000</option>
          <option value="modern">Moderne</option>
        </select>

        <label>Jaquette</label>
        <div class="flex gap-2 mb-2">
          <input id="editImage" type="text" class="input flex-1 border p-1" value="${game.image || ""}" />
          <button id="browseCover" class="btn-small border rounded-lg p-1">Parcourir</button>
        </div>

        <label>Chemin d'executeur</label>
        <div class="flex gap-2 mb-2">
          <input id="editExe" type="text" class="input flex-1 border ${game.steam ? "hidden" : ""}" value="${game.exe || ""}" />
          <button id="browseExe" class="btn-small border rounded-lg p-1 ${game.steam ? "hidden" : ""}">Parcourir</button>
        </div>

        <label class="flex items-center gap-2 mt-2">
          <input type="checkbox" id="editSteam" ${game.steam ? "checked" : ""} />
          <span>Jeu Steam</span>
        </label>

        <input id="editAppID"
              class="input w-full mt-2 border ${game.steam ? "" : "hidden"}"
              value="${game.appid || ""}"
              placeholder="AppID Steam" />

        <div class="flex justify-end gap-2 mt-4">
          <button id="editCancel" class="btn">Annuler</button>
          <button id="editSave" class="btn-primary">Enregistrer</button>
        </div>
      </div>
    </div>
  `);

  // Remplir la liste des catégories
  const categorySelect = document.getElementById("editCategory");
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === game.category) opt.selected = true;
    categorySelect.appendChild(opt);
  });

  // 👉 Pré-remplir l'époque (IMPORTANT : en dehors de la boucle)
  document.getElementById("editEra").value = game.era || "base";

  // Bouton ajout catégorie
  document
    .getElementById("addCategoryBtn")
    .addEventListener("click", addCategory);

  // Bouton annuler
  document.getElementById("editCancel").onclick = () => UI.modal.hide();

  // Parcourir EXE
  document.getElementById("browseExe").onclick = async () => {
    const file = await window.electronAPI.openFileDialog({
      filters: [{ name: "Executable", extensions: ["exe"] }],
    });
    if (file) document.getElementById("editExe").value = file;
  };

  // Parcourir image
  document.getElementById("browseCover").onclick = async () => {
    const filePath = await window.electronAPI.openFileDialog({
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });

    if (!filePath) return;

    const response = await fetch(`file://${filePath}`);
    const blob = await response.blob();

    const img = new Image();
    img.onload = () => {
      if (img.width > img.height) {
        alert(
          "L'image est trop large (format paysage). Merci d'importer une jaquette verticale.",
        );
        return;
      }
      document.getElementById("editImage").value = filePath;
    };

    img.src = URL.createObjectURL(blob);
  };

  // Steam toggle
  document.getElementById("editSteam").onchange = (e) => {
    const isSteam = e.target.checked;

    document.getElementById("editAppID").classList.toggle("hidden", !isSteam);
    document.getElementById("editExe").classList.toggle("hidden", isSteam);
    document.getElementById("browseExe").classList.toggle("hidden", isSteam);
  };

  // Sauvegarde
  document.getElementById("editSave").onclick = () => {
    const name = document.getElementById("editName").value.trim();
    const category = document.getElementById("editCategory").value;
    const era = document.getElementById("editEra").value;
    const image = document.getElementById("editImage").value.trim();
    const isSteam = document.getElementById("editSteam").checked;
    const appid = document.getElementById("editAppID").value.trim();
    const exe = document.getElementById("editExe").value.trim();

    if (!name) {
      alert("Veuillez entrer un nom de jeu.");
      return;
    }

    const newData = {
      name,
      category,
      image,
      steam: isSteam,
      appid: isSteam ? appid : null,
      exe: isSteam ? "" : exe,
      era,
    };

    if (isNew) {
      games.push(newData);
    } else {
      games[index] = newData;
    }
    saveGames();
    loadCategories();
    syncCategories();
    renderGrid();
    UI.modal.hide();
  };
}

// FILTERS
function applyFilters() {
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

function renderGrid() {
  // Sécurisation
  if (!Array.isArray(games)) {
    games = [];
    localStorage.setItem("games", JSON.stringify(games));
  }

  const baseGrid = document.getElementById("gameGrid");

  const grids = {
    base: baseGrid,
    retro90: document.getElementById("grid-retro90"),
    early2000: document.getElementById("grid-2000"),
    modern: document.getElementById("grid-modern"),
  };

  // Vider les grilles
  Object.values(grids).forEach((g) => (g.innerHTML = ""));

  // Nettoyer les jeux
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

  // Ajouter un slot vide dans chaque grille
  Object.keys(grids).forEach((era) => {
    const realIndex = games.length;
    const slot = GameCard.createEmptySlot(realIndex, era, openEditModal);
    grids[era].appendChild(slot);
  });

  applyFilters();
  enableSortable();
}

// SORTABLEJS
function enableSortable() {
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

function reorderWithinEra(era, oldIndex, newIndex) {
  const eraGames = games.filter((g) => g.era === era);

  const moved = eraGames.splice(oldIndex, 1)[0];
  eraGames.splice(newIndex, 0, moved);

  const others = games.filter((g) => g.era !== era);
  games = [...others, ...eraGames];

  saveGames();
  renderGrid();
}

// CATEGORY MANAGEMENT
function addCategory() {
  const input = document.getElementById("newCategoryInput");
  const newCat = input.value.trim();

  if (!newCat) return;

  let categories = JSON.parse(localStorage.getItem("retroCategories")) || [];

  if (!categories.includes(newCat)) {
    categories.push(newCat);
    localStorage.setItem("retroCategories", JSON.stringify(categories));
  }

  loadCategories();
  syncCategories();

  const select = document.getElementById("editCategory");
  if (select) {
    select.innerHTML = "";
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });
  }

  input.value = "";
}

// INIT
loadGames();
loadCategories();
syncCategories();
renderGrid();

// DELETE CATEGORY
deleteHeaderBtn.addEventListener("click", () => {
  const current = categoryFilter.value;

  if (current === "all" || protectedCategories.includes(current)) {
    alert("Cette catégorie est protégée et ne peut pas être supprimée.");
    return;
  }

  categoryToDelete = current;
  document.getElementById("confirm-message").textContent =
    `Supprimer la catégorie "${current}" ?`;

  confirmModal.classList.remove("hidden");
});

confirmNo.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  categoryToDelete = null;
});

confirmYes.addEventListener("click", () => {
  if (!categoryToDelete) return;

  let cats = JSON.parse(localStorage.getItem("retroCategories")) || [];
  cats = cats.filter((c) => c !== categoryToDelete);

  localStorage.setItem("retroCategories", JSON.stringify(cats));

  loadCategories();
  syncCategories();
  renderGrid();

  confirmModal.classList.add("hidden");
  categoryToDelete = null;
});

// FILTER EVENTS
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
if (steamFilter) steamFilter.addEventListener("change", applyFilters);
window.openEditModal = openEditModal;
