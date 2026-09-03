import { UI } from "./UI.js";
import { loadCategories, saveGames, syncCategories } from "./Storage.js";
import { renderGrid } from "/Render.js";

export function openEditModal(game, index, isNew = false) {
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
