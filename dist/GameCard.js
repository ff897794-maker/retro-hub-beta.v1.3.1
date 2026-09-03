import { UI } from "./UI.js";

export const GameCard = {
  create(game, index, { onLaunch, onDelete, onEdit }) {
    const card = document.createElement("div");

    card.className = "game-card group relative";
    card.dataset.index = index;
    card.setAttribute("draggable", "true");
    // card.classList.add(`aspect-${game.aspect || "big-box"}`);
    let aspect = "base";

    switch (game.era) {
      case "retro90":
        aspect = "big-box";
        break;
      case "early2000":
        aspect = "2000";
        break;
      case "modern":
        aspect = "modern";
        break;
      case "base":
      default:
        aspect = "base";
        break;
    }

    card.classList.add(`aspect-${aspect}`);

    // Structure 3D + texte séparé
    card.innerHTML = `
      <div class="game-box-visual">
        <div class="game-box-inner">
          <div class="game-box-front">
            <div class="box-cover w-\[180px] h-\[270px] bg-slate-800 rounded border-4 border-black overflow-hidden relative shadow-lg shadow-black">
          <img src="${game.image}" class="w-full h-full object-cover transition-transform duration-300 aspect-${aspect}"/>
            </div>
          </div>
          <div class="game-box-side"></div>
          <div class="game-card aspect-base">

        </div>
      </div>

      <!-- Texte séparé + apparition au survol -->
      <div class="game-info text-center mt-2 opacity-0 translate-y-1 transition-all duration-300 pointer-events-none">
        <p class="text-sm font-semibold text-white">${game.name}</p>
        <p class="text-xs text-blue-500">${game.category || ""}</p>
      </div>
    `;

    // Sélection au clic
    card.addEventListener("click", () => {
      card.classList.toggle("selected");
    });

    // CONTINUITÉ DE L’IMAGE SUR LA TRANCHE

    const side = card.querySelector(".game-box-side");
    // side.style.backgroundImage = `url('${game.image}')`;
    // if (game.era === "base") {
    // CD → tranche noire
    //   side.style.backgroundImage = "none";
    //   side.style.backgroundColor = "black";
    // } else {
    // Autres formats → tranche avec image
    side.style.backgroundImage = `url('file:///${game.image.replace(/\\/g, "/")}')`;
    // }

    // Pour tes overlays
    const cardInner = card.querySelector(".box-cover");

    // Bouton paramètres (molette) — déplacé en bas à droite
    UI.addSettingsButton(card, game, () => onEdit(game, index));

    // Bouton suppression (croix)
    UI.addDeleteButton(cardInner, index, onDelete);

    // Play / Unavailable overlay
    const isPlayable =
      (game.steam && game.appid && game.appid.trim() !== "") ||
      (!game.steam && game.exe && game.exe.trim() !== "");

    if (isPlayable) {
      UI.addPlayOverlay(cardInner, game, onLaunch);
    } else {
      UI.addUnavailableOverlay(cardInner);
    }

    // Clic droit → édition
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      onEdit(game, index);
    });

    // Badge Steam
    if (game.steam) {
      const badge = document.createElement("div");
      badge.className = `
        absolute top-1 left-1 
        bg-black/70 backdrop-blur-sm
        px-2 py-1 rounded shadow-lg z-20
        flex items-center gap-1
      `;
      badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387l1.146-4.02a4.5 4.5 0 1 1 5.44-5.44l4.02-1.146C21.8 15.438 24 13.302 24 12 24 5.373 18.627 0 12 0z"/>
        </svg>
        <span class="text-white text-xs font-bold">STEAM</span>
      `;
      cardInner.appendChild(badge);
    }

    // 🔥 FIX DRAG & DROP (ghost element)
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setDragImage(new Image(), 0, 0);
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    return card;
  },

  createEmptySlot(realIndex, era) {
    const slot = document.createElement("div");

    slot.className =
      "empty-slot flex items-center justify-center w-\[180px] h-\[180px] border-2 border-dashed border-slate-700 rounded text-slate-500 cursor-pointer";

    slot.dataset.index = realIndex;
    slot.textContent = "+ Ajouter un jeu";

    slot.addEventListener("click", () => {
      const newGame = {
        name: "",
        category: "",
        exe: "",
        image: "",
        steam: false,
        appid: "",
        era: era,
      };

      openEditModal(newGame, realIndex, true); // 👉 mode création
    });

    return slot;
  },
};
